<?php snippet('header') ?>

<div id="intro-videos">

  <?php foreach ($page->pagevideos()->toStructure() as $key => $v): ?>

      <?php

        $poster = '';
        if ($thumb = $v->thumb()->toFile()) $poster = $thumb->width(1500)->url();
        $video = null;

        if ($v->stream()->isNotEmpty() ||
          $v->mp4()->isNotEmpty() ||
          $v->file()->isNotEmpty() ||
          $v->webm()->isNotEmpty()) {

          $video = brick('video')
                ->attr('class', 'media intro-video')
                ->attr('poster', $poster)
                ->attr('logo-color', $v->color())
                ->attr('width', '100%')
                ->attr('height', 'auto')
                ->attr('muted', 'true')
                ->attr('playsinline', 'true')
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

</div>

<div id="intro-text">
  <div id="title-1"><?= $page->title1()->html() ?></div>
  <div id="title-2" class="bold"><?= $page->title2()->html() ?></div>
  <div id="title-3"><?= $page->title3()->html() ?></div>
  <div id="title-4" class="bold"><?= $page->title4()->html() ?></div>
</div>

<?php snippet('footer') ?>
