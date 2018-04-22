<div class="slider">
  <?php foreach ($medias as $key => $image): ?>

    <?php if($image = $image->toFile()): ?>

      <div class="slide"
      data-caption="<?= $image->caption()->kt()->escape() ?>"
      >

        <div class="content image contain">
          <?php
          $srcset = '';
          $src = $image->width(1000)->url();
          for ($i = 1000; $i <= 3000; $i += 500) $srcset .= $image->width($i)->url() . ' ' . $i . 'w,';
          ?>
          <img class="media lazy<?php e($key == 0, " lazyload lazypreload") ?>" 
          src="<?= $image->width(100)->dataUri() ?>"
          data-flickity-lazyload="<?= $src ?>"
          data-srcset="<?= $srcset ?>"
          data-sizes="auto"
          data-optimumx="1.5"
          alt="<?= $image->page()->title()->html().' - © '.$site->title()->html() ?>" height="100%" width="auto" />
          <noscript>
            <img src="<?= $image->width(1000)->url() ?>" alt="<?= $image->page()->title()->html().' - © '.$site->title()->html() ?>" width="100%" height="auto" />
          </noscript>
        </div>

      </div>

    <?php endif ?>

  <?php endforeach ?>
</div>
