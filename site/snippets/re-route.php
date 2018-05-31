<?php if (!_bot_detected() && !r::ajax()): ?>
	<script>
		if(window.location.hash.length === 0 && document.documentElement.clientWidth > 1024) {	
			url = window.location.origin + '#<?= $page->uid() ?>';
			window.location = url;
		}
	</script>
<?php endif ?>