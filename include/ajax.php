<?php

include_once('reader.php');
$reader = new Reader;


$data = array();
// switch ajax post request
if ($_POST)
{
	switch ($_POST['action'])
	{
		case 'mp3_nwt':
			// save data
			$reader->save_config(array(
				'book' => $_POST['book'],
				'chapter' => $_POST['chapter'],
			));
			$data = $reader->get_mp3_nwt();
			break;
		
		case 'chapters':
			$data = $reader->get_chapters($_POST['book']);
			break;
		
		case 'save_setting':
			// save data
			$reader->save_config(array(
				$_POST['option'] => $_POST['value'],
			));
			break;
	}
}

print json_encode($data);