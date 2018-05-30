<?php snippet('re-route') ?>

<?php snippet('header') ?>

<?php snippet('slider', array('medias' => $page->medias()->toStructure())) ?>

<div id="page-description">
	<?= $page->text()->kt() ?>
</div>

<?php snippet('footer') ?>