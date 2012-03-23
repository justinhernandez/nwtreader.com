<?php
// require!!!!!!!
include_once('phpQuery-onefile.php');

class Reader {

	public $short;
	public $stats;
	public $config;

	function __construct()
	{
		$this->short = include_once('config/bible_short.php');
		$this->stats = include_once('config/bible_stats.php');
		$this->config = $this->get_config();
	}
	
	/**
	 * Get initialization data 
	 */
	public function init()
	{
		return array_merge(
			$this->get_books(),
			$this->get_mp3_nwt(),
			$this->config
		);
	}

	/**
	 * Get mp3 filename for selected mp3
	 * 
	 * @return string
	 */
	public function get_mp3_nwt()
	{
		$base = 'http://download.jw.org/files/media_bible/';
		$short_name = $this->short_jw_name($this->short_name($this->config['book']));
		$book_num = $this->nice_integer($this->config['book']);
		$book_chapter = $this->nice_integer($this->config['chapter']);
		
		// load nwt data
		$html = file_get_contents($this->nwt_link($this->config['book'], $this->config['chapter']));
		$pq = phpQuery::newDocument($html);
		// get num of paragraphs
		$last = $pq->find('p')->size() - 3;
		// get paragraphs
		$nwt = $pq->find("p")->not(".site, p:gt({$last})")->htmlOuter();
		// strip out utf8 characters
		$nwt = preg_replace('/[^(\x20-\x7F)]*/', '', $nwt);

		return array(
			//'title' => $this->short[strtolower($short_name)] . ' ' . $this->config['chapter'],
			'mp3' => "{$base}{$book_num}_{$short_name}_E_{$book_chapter}.mp3",
			'nwt' => $nwt,
		);
	}

	/**
	 *  Get a string of available chapters for specified bible book
	 * 
	 * @param int $book
	 * @return string 
	 */
	public function get_chapters($book)
	{
		// load list of chapters
		$chapters_count = $this->stats[$this->short[$this->short_name($book)]]['chapters'];
		$chapters = '';
		for ($i = 1; $i <= $chapters_count; $i++)
			$chapters .= "<option value='{$i}'>$i</option>";

		return $chapters;
	}

	public function save_config($data)
	{
		$this->config = array_merge($this->config, $data);
		setcookie("config", serialize($this->config), 0, '/');		
	}
	
	/**
	 * Return a list of available mp3 data
	 * 
	 * @return array
	 */
	private function get_books()
	{
		// load list of books
		$books = '';
		$count = 1;
		// set available books
		foreach ($this->short as $s => $l)
		{
			$books .= "<option value='{$count}'>$l</option>";
			$count++;
		}

		// load chapters
		$chapters = $this->get_chapters($this->config['book']);

		return array(
			'books' => $books,
			'chapters' => $chapters,
			'book' => $this->config['book'],
			'chapter' => $this->config['chapter'],
		);
	}

	/**
	 * Get the short name for the specified book integer
	 * 
	 * @param int $book
	 * @return string 
	 */
	private function short_name($book)
	{
		$short_index = array_keys($this->short);

		return $short_index[$book - 1];
	}

	/**
	 * Get the jw.org type short name
	 * 
	 * @param string $name
	 * @return string
	 */
	private function short_jw_name($name)
	{
		return (is_numeric($name[0])) ? substr_replace($name, strtoupper($name[1]), 1, 1) : ucfirst(strtolower($name));
	}

	/**
	 * Nice integer with preceding zeros
	 * 
	 * @param string $int
	 * @return string
	 */
	private function nice_integer($int)
	{
		return (strlen($int) == 1) ? '0' . $int : $int;
	}

	/**
	 * Get the config settings from cookie
	 * 
	 * @return array 
	 */
	private function get_config()
	{
		$config = unserialize(@$_COOKIE['config']);
		
		if ( ! $config)
			$config = array(
				'book' => 1,
				'chapter' => 1,
				'theme' => 'white',
				'font' => 'ledger',
				'font_size' => 'normal',
			);
		
		return $config;
	}

	/**
	 * Get the bible link for the specified chapter
	 * 
	 * @return string
	 */
	private function nwt_link($book, $chapter)
	{
		$url = 'http://www.watchtower.org/e/bible/';
		$url .= $this->short_name($book) . '/';
		$url .= 'chapter_' . $this->nwt_link_num($chapter) . '.htm';

		return $url;
	}

	/**
	 * Return the nice bible integer for the nwt watchtower.org
	 * 
	 * @param int $num
	 * @return string 
	 */
	private function nwt_link_num($num)
	{
		if (strlen($num) == 1)
		{
			$num = '00' . $num;
		}
		elseif (strlen($num) == 2)
		{
			$num = '0' . $num;
		}

		return $num;
	}

}