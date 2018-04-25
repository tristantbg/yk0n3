<?php

return function ($site, $pages, $page) {
	$events = $page->children()->visible();

	return array(
	 'events' => $events
	);
}

?>
