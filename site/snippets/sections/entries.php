<?php $entries = $data->children()->visible(); ?>
<?php snippet('slider-entries', array('collection' => $entries)) ?>

<div id="page-description" class="page-description">
	<div class="dynamic-description">
    <?= $entries->first()->pageDescription() ?>
  </div>
</div>