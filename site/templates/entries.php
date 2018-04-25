<?php snippet('header') ?>

<?php snippet('slider-entries', array('collection' => $entries)) ?>

<div id="page-description">
	<div class="dynamic-description">
    <?= $entries->first()->pageDescription() ?>
  </div>
</div>

<?php snippet('footer') ?>
