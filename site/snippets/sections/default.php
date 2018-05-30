<?php snippet('slider', array('medias' => $data->medias()->toStructure())) ?>

<div id="page-description" class="page-description">
	<h1><?= $data->title()->html() ?></h1>
	<?= $data->text()->kt() ?>
</div>