<?php snippet('header') ?>

<?php snippet('slider-events', array('collection' => $events)) ?>

<div id="page-description">
  <div class="dynamic-description">
    <?= $events->first()->pageDescription() ?>
  </div>
</div>

<?php snippet('footer') ?>
