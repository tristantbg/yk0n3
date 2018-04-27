<?php snippet('header') ?>

<div id="manifesto">

  <?php foreach ($page->pagevideo()->toStructure() as $key => $v): ?>

      <?php

        $poster = '';
        if ($thumb = $v->thumb()->toFile()) $poster = $thumb->width(1500)->url();
        $video = null;

        if ($v->stream()->isNotEmpty() ||
          $v->mp4()->isNotEmpty() ||
          $v->file()->isNotEmpty() ||
          $v->webm()->isNotEmpty()) {

          $video = brick('video')
                ->attr('class', 'media intro-video contain')
                ->attr('poster', $poster)
                ->attr('logo-color', $v->color())
                ->attr('width', '100%')
                ->attr('height', 'auto')
                ->attr('muted', 'true')
                ->attr('loop', 'true')
                ->attr('preload', 'auto');

          if ($v->stream()->isNotEmpty()) $video->attr('data-stream', $v->stream());

          if ($v->mp4()->isNotEmpty()) {

            $video->append('<source src=' . $v->mp4() . ' type="video/mp4">');

          } else if ($file = $v->file()->toFile()){

            $video->append('<source src=' . $file->url() . ' type="video/mp4">');

            if ($file = $v->webm()->toFile()) $video->append('<source src=' . $file->url() . ' type="video/webm">');
          }

          echo $video;
        }
        ?>

  <?php endforeach ?>

  <div id="page-description" class="fixed">
    <h1><?= $page->title()->html() ?></h1>
    <br><?= $page->text()->kt() ?>
  </div>

</div>

<?php snippet('footer') ?>
