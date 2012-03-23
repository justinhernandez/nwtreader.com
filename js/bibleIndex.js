var totalScriptures;
var bibleMode = 'regular';
var testVerse;
var testTimeout;

$(document).ready(function(){
	loadMp3List();
	
	// tests verse at specified seconds
	$('.test_verse').live('click', function(){
		test_verse(this);
		
		return false;
	});
	
	// remove verse listing
	$('.delete_verse').live('click', function(){
		if (confirm("Delete verse?"))
		{
			pause();
			$(this).parent('li').remove();
			redo_verses();
		}
		
		return false;
	});
	
	// change mp3
	$('#chapters').change(function(){
		loadMp3();
	});
	
	// change books
	$('#books').change(function(){
		book_change();
	});
	
	$('#mark_scripture').click(function(){
		addMark();
	});
	
	$('#submit_data').click(function(){
		// if no scriptures don't submit
		if ($('.scripture').size() == 0)
			return false;
		
		submit_data();
	});
	
	$('#add_verse_button').click(function(){
		add_verse();
	});
	
	$('#next_button').click(function(){
		nextMp3();
	});
	
	$('#prev_button').click(function(){
		prevMp3();
	});
	
	$('#playpause_button').click(function(){
		playpause();
	});
	
	$('#toggle_mode').click(function(){
		toggle_mode();
	});
	
	$('.scripture').live('click', function(){
		testVerse = $(this).prev('.verse').text();
	});
	
	$(window).resize(function(){
		sticky_bottom();
	});
	
	// bind keys
	bindKeys();
	// make mark button sticky
	sticky_bottom();
});

// bind shortcuts
function bindKeys()
{
	// play pause
	$(document).bind('keydown', '0', function(evt){
		playpause();
		
		return false;
	});
	
	// add recording mark
	$(document).bind('keydown', 'space', function(evt){
		addMark();
	});
	
	// advance one mp3 forward
	$(document).bind('keydown', 's', function(evt){
		$('#books option:selected').next().attr('selected','selected');
		$('#books').change();
	});
	
	// advance one mp3 forward
	$(document).bind('keydown', 'a', function(evt){
		$('#books option:selected').prev().attr('selected','selected');
		$('#books').change();
	});

	// advance one mp3 forward
	$(document).bind('keydown', 'z', function(evt){
		prevMp3();
	});
	
	// go backwards
	$(document).bind('keydown', 'x', function(evt){
		nextMp3();
	});
}

function addMark(insert)
{	
	// create text input
	time	= ( ! insert)
			? total_seconds($('.jp-current-time').text())
			: 0;
			
	if (bibleMode == 'regular')
	{
		verse = $('#collect_data li').size() + 2;
		i = '<li><span class="verse">' + verse + '</span>: ';
		i += '<input type="text" class="scripture" value="' + time + '" />';
		i += '&nbsp;&nbsp;<a href="#" class="test_verse">test</a>';
		i += '&nbsp;&nbsp;<a href="#" class="delete_verse">remove</a></li>';

		// check if it's an insert
		if ( ! insert)
		{
			$('#collect_data ol').prepend(i);
		}
		else
		{
			$(insert).before(i);
		}
	}
	else if (bibleMode == 'test')
	{	
		if (testVerse)
		{
			offset = $('#collect_data ol li').size() - testVerse + 1;
			$('#collect_data ol li:eq(' + offset + ') .scripture').val(time);
		}
	}
}

function loadMp3()
{
	$.post('include/ajax.php', {
		action: 'load',
		book: $('#books').val(),
		chapter: $('#chapters').val()
	}, function(data){
		data = $.parseJSON(data);
		// get nwt data
		$('#nwt').html(data['nwt']);
		data['nwt'] = '';
		
		jplayer(data);
		$('#collect_data ol').html('');
		
		// check if export data exists
		data_exists(data['exists']);
	});
}

function jplayer(files)
{
	$('#jquery_jplayer_1').remove();
	$('body').prepend('<div id="jquery_jplayer_1" class="jp-jplayer"></div>');

	new jPlayerPlaylist({
		jPlayer: "#jquery_jplayer_1",
		cssSelectorAncestor: "#jp_container_1"
	}, files, {
		solution: "html, flash",
		swfPath: "js",
		supplied: "mp3",
		wmode: "window"
	});
}

function total_seconds(input)
{
	parts = input.split(':');
	minutes = parseInt(parts[0]) * 60;
	seconds = parseInt(parts[1]);
	
	return minutes + seconds;
}

function loadMp3List()
{
	$.post('include/ajax.php', {
		action : 'load_mp3_list'
	}, function(data){
		data = $.parseJSON(data);
		// insert options
		$('#books').append(data['books']);
		$('#chapters').append(data['chapters']);
		// choose selected mp3 data
		$('#books').val(data['selected_book']);
		$('#chapters').val(data['selected_chapter']);
		
		loadMp3();
	});
}

function submit_data()
{
	count = $('.scripture').size();
	if (confirm("Submit " + count + " verses for " + $('#books option:selected').text() + ' ' + $('#chapters').val() + "?"))
	{
		$.post('include/ajax.php', {
			action : 'submit_data',
			scriptures : collect_data(),
			book: $('#books option:selected').text(),
			chapter: $('#chapters').val()
		}, function(data){
			data = $.parseJSON(data);
			// insert options
			$('#collect_data ol').html('');
		});
	}
	
	data_exists(true);
}

// collect scripture data
function collect_data()
{
	collect = [];
	$('.scripture').each(function(i){
		collect[i] = $(this).val();
	});
	
	return collect;
}

function test_verse(e)
{
	toggle_mode('test');
	// get value and rewind for 5 seconds
	val = $(e).prev('input').val() - $('#test_offset').val();
	playStatus('pause');
	$("#jquery_jplayer_1").jPlayer('play', val);
	// play for 5 seconds then pause
	clearTimeout(testTimeout); 
	testTimeout = setTimeout('pause()', 10000);
}

function book_change()
{
	$.post('include/ajax.php', {
		action: 'chapters',
		book: $('#books').val()
	}, function(data){
		$('#chapters').html($.parseJSON(data));
		loadMp3();
	});
}

function pause()
{
	$("#jquery_jplayer_1").jPlayer('pause');
	playStatus('play');
}

function add_verse()
{
	pause();
	verse = $('#add_verse').val();
	after = $('#collect_data li').size() - verse + 1;
	addMark('#collect_data ol li:eq(' + after + ')');
	redo_verses();
}

function data_exists(exists)
{
	exists	= (exists)
			? 'true'
			: 'false';
	
	$('#data_exists').text(exists).removeClass().addClass(exists);
}

function prevMp3()
{
	$('#chapters option:selected').prev().attr('selected','selected');
	$('#chapters').change();
}

function nextMp3()
{
	$('#chapters option:selected').next().attr('selected','selected');
	$('#chapters').change();
}

function playpause()
{				
	action	= ($('#playpause_button').val() == 'play')
			? 'play' 
			: 'pause';
			
	playStatus();

	$('#jquery_jplayer_1').jPlayer(action);
}

function playStatus(text)
{
	if ( ! text)
	{
		text	= ($('#playpause_button').val() == 'play')
				? 'pause' 
				: 'play';
	}
				
	$('#playpause_button').val(text);
}

function sticky_bottom()
{
	sticky = $('#sticky_bottom').height();
	page = $(window).height();
	offset = page - sticky + 'px';
	$('#sticky_bottom').css({ 'top': offset, 'left': 0 });
}

function redo_verses()
{
	size = $('#collect_data li').size() + 1;
	
	$('.verse').each(function(i){
		$(this).text(size);
		size--;
	});
}

function toggle_mode(mode)
{
	if ( ! mode)
	{
		mode	= ($('#toggle_mode').val() == 'regular')
				? 'test'
				: 'regular';
	}
	
	if (mode == 'test')
		pause();
	
	bibleMode = mode;
	
	$('#toggle_mode').val(mode);
}