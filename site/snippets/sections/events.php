<?php $events = $data->children()->visible() ?>
<?php snippet('slider-events', array('collection' => $events)) ?>

<div id="page-description" class="page-description">
  <div class="dynamic-description">
    <?= $events->first()->pageDescription() ?>
  </div>
</div>