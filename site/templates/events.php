<?php snippet('header') ?>

<?php snippet('slider-events', array('collection' => $events)) ?>

<div id="page-description">
  <h1><?= $page->title()->html() ?></h1>
  <div class="dynamic-description">
    <?= $events->first()->pageDescription() ?>
  </div>
</div>

<?php snippet('footer') ?>
