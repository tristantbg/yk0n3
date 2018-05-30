<?php if (!_bot_detected() && !r::ajax()): ?>
	<script>
		if(document.documentElement.clientWidth > 1024) {	
			url = window.location.origin + '#<?= $page->uid() ?>';
			window.location = url;
		}
	</script>
<?php endif ?>