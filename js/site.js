$(function(){	
	// change mp3
	$('#chapters').change(function(){
		load_mp3();
	});
	
	// change books
	$('#books').change(function(){
		book_change();
	});
	
	// set nwt height
	set_nwt_dimensions();
	$(window).resize(function(){
		set_nwt_dimensions();
	});
	
	// show options
	$('#options').click(function(){
		$('#options_box').toggle();
		// hide options box on body click
		$('#header, #nwt').one('click', function(){
			$('#options_box').hide();
		});
		
		return false;
	});
	
	// handle theme clicks
	$('#theme a').click(function(){
		set_theme_item($(this).attr('class'), 'white black sepia', 'theme');
		
		return false;
	});
	
	// handle theme clicks
	$('#font').change(function(){
		set_theme_item($('#font option:selected').attr('class'), 'average ledger pt_serif playfair cardo', 'font');
		
		return false;
	});
	
	// handle theme clicks
	$('#font_size a').click(function(){
		set_theme_item($(this).attr('class'), 'tiny small normal big huge', 'font_size');
		
		return false;
	});
	
	// set options box location
	options_box();
});

// load mp3 file
function load_mp3()
{
	$('#jquery_jplayer_1').jPlayer('stop');
	$('#nwt_inner').html('<div id="loading">loading....</div>');
	
	$.post('include/ajax.php', {
		action: 'mp3_nwt',
		book: $('#books').val(),
		chapter: $('#chapters').val()
	}, function(data){
		data = $.parseJSON(data);
		// get nwt data
		$('#nwt_inner').html(data['nwt']);
		data['nwt'] = '';
		// load jplayer
		jplayer(data);
	});
}

// load chapters for specified book
function book_change()
{
	$.post('include/ajax.php', {
		action: 'chapters',
		book: $('#books').val()
	}, function(data){
		$('#chapters').html($.parseJSON(data)).change();
	});
}

// load jplayer
function jplayer(mp3)
{
	$('#jquery_jplayer_1').remove();
	$('#nwt_info').after('<div id="jquery_jplayer_1" class="jp-jplayer"></div>');

	$("#jquery_jplayer_1").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", mp3).jPlayer("play");
		},
		ended: function (event) {
			$(this).jPlayer("play");
		},
		solution: "html, flash",
		swfPath: "js",
		supplied: "mp3"
	});
}

function set_nwt_dimensions()
{	
	$('#nwt').height( $(window).height() - $('#header').height() );
}

function options_box()
{
	options = $('#options').offset();
	left = $(window).width() - $('#options_box').width() - 40;
	
	$('#options_box').css({ top: options.top + 20 + 'px', left: left + 'px' });
}

function set_books_chapters(book, chapter)
{
	$('#books').val(book);
	$('#chapters').val(chapter);
}

function set_theme(theme, font, size)
{
	$('#nwt, #nwt_inner').hide().removeClass().addClass(theme + ' ' + font + ' ' + size).show();
	$('#font select').val(font);
}

function set_theme_item(add, remove, type)
{
	$('#nwt, #nwt_inner').hide().removeClass(remove).addClass(add).show();
	save_theme_option(add, type);
}

function save_theme_option(value, type)
{
	$.post('include/ajax.php', {
		action: 'save_setting',
		option: type,
		value: value
	});
}