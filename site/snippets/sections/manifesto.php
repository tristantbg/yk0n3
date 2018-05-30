<div id="manifesto">

  <?php foreach ($data->pagevideo()->toStructure() as $key => $v): ?>

      <?php

        $poster = '';
        if ($thumb = $v->thumb()->toFile()) $poster = $thumb->width(1500)->url();
        $video = null;

        if ($v->stream()->isNotEmpty() ||
          $v->mp4()->isNotEmpty() ||
          $v->file()->isNotEmpty() ||
          $v->webm()->isNotEmpty()) {

          $video = brick('video')
                ->attr('class', 'media manifesto-video contain')
                ->attr('poster', $poster)
                ->attr('logo-color', $v->color())
                ->attr('width', '100%')
                ->attr('height', 'auto')
                ->attr('muted', '')
                // ->attr('autoplay', 'true')
                ->attr('playsinline', '')
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

  <div id="page-description" class="page-description hide fixed">
    <h1><?= $data->title()->html() ?></h1>
    <div><?= $data->text()->kt() ?></div>
  </div>

</div>