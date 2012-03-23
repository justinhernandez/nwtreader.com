<?php
	require 'include/reader.php';
	$reader = new Reader;
	$data = $reader->init();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title>NWT Reader</title>
		<link type="text/css" href="css/reset.css" rel="stylesheet">
		<link type="text/css" href="css/style.css" rel="stylesheet">
		<link href="skin/jplayer-black-and-yellow.css" rel="stylesheet" type="text/css" />
		<link href='http://fonts.googleapis.com/css?family=Average|Ledger|PT+Serif|Playfair+Display|Cardo' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div id="header">
			<div id="header_title">
				<h1>NWT Reader</h1>
			</div>
			<div id="nwt_info">
				<select id="books"><?php print $data['books'] ?></select>
				&nbsp;&nbsp;
				<select id="chapters"><?php print $data['chapters'] ?></select>
			</div>
			<div id="jp_container_1" class="jp-player">
				<div class="jp-audio-container">
					<div class="jp-audio">
						<div class="jp-type-single">
							<div id="jp_interface_1" class="jp-interface">
								<ul class="jp-controls">
									<li><a href="#" class="jp-play" tabindex="1">play</a></li>
									<li><a href="#" class="jp-pause" tabindex="1">pause</a></li>
									<li><a href="#" class="jp-mute" tabindex="1">mute</a></li>
									<li><a href="#" class="jp-unmute" tabindex="1">unmute</a></li>
								</ul>
								<div class="jp-progress-container">
									<div class="jp-progress">
										<div class="jp-seek-bar">
											<div class="jp-play-bar"></div>
										</div>
									</div>
								</div>
								<div class="jp-volume-bar-container">
									<div class="jp-volume-bar">
										<div class="jp-volume-bar-value"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="nwt">
			<div id="nwt_options">
				<a href="#" id="options">options</a>
			</div>
			<div id="nwt_inner"><?php print $data['nwt'] ?></div>
		</div>
		<div id="options_box">
			<div id="font">
				<select>
					<option value="average" class="average">Average</option>
					<option value="ledger" class="ledger">Ledger</option>
					<option value="pt_serif" class="pt_serif">PT Serif</option>
					<option value="playfair" class="playfair">Playfair Display</option>
					<option value="cardo" class="cardo">Cardo</option>
				</select>
			</div>
			<div id="font_size">
				<a class="tiny" href="#">Aa</a>
				<a class="small" href="#">Aa</a>
				<a class="normal" href="#">Aa</a>
				<a class='big' href="#">Aa</a>
				<a class="huge" href="#">Aa</a>
			</div>
			<div id="theme">
				<a class="white" href="#">white</a>
				<a class="black" href="#">black</a>
				<a class="sepia" href="#">sepia</a>
			</div>
		</div>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery.jplayer.min.js"></script>
		<script type="text/javascript" src="js/site.js"></script>
		<script type="text/javascript">
			$(function(){
				// load jplayer
				jplayer({ mp3: '<?php print $data["mp3"] ?>' });
				set_books_chapters(<?php print $data["book"] ?>, <?php print $data["chapter"] ?>);
				set_theme('<?php print $data["theme"] ?>', '<?php print $data["font"] ?>', '<?php print $data["font_size"] ?>');
			});
		</script>
	</body>
</html>