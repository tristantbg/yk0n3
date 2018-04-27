<?php snippet('header') ?>

<?php snippet('slider', array('medias' => $page->medias()->toStructure())) ?>

<div id="page-description">
	<h1><?= $page->title()->html() ?></h1>
	<?= $page->text()->kt() ?>
</div>

<?php snippet('footer') ?>