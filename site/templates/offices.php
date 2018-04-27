<?php snippet('header') ?>

<?php if ($featured = $page->featured()->toFile()): ?>
<div id="map" style="background-image: url('<?= $featured->width(4000)->url() ?>')"></div>
<?php endif ?>

<div id="offices-text">
  <div id="title-1">Nos</div>
  <div id="title-2" class="bold">Bureaux</div>
  <div id="offices">
    <?php foreach ($page->children()->visible() as $key => $office): ?>
      <div class="office ttu" event-target="office" data-caption="<?= esc($office->pageDescription()) ?>">
        <?= $office->title()->html() ?>
      </div>
    <?php endforeach ?>
  </div>
</div>

<div id="page-description" class="dynamic-description hide fixed">
  <?= $page->children()->visible()->first()->pageDescription() ?>
</div>

<?php snippet('footer') ?>
