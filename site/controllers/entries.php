<?php

return function ($site, $pages, $page) {
	$entries = $page->children()->visible();

	return array(
	'entries' => $entries
	);
}

?>
