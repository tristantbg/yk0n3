<div class="slider slider-entries" cell-align="left">
  <?php foreach ($collection as $key => $p): ?>

      <?php if($image = $p->featured()->toFile()): ?>

        <div class="slide" 
        id="<?= $p->uid() ?>" 
        data-caption="<?= esc($p->pageDescription()) ?>"
        >

          <div class="content image contain">
            <?php
            $srcset = '';
            $src = $image->width(1000)->url();
            for ($i = 1000; $i <= 3000; $i += 500) $srcset .= $image->width($i)->url() . ' ' . $i . 'w,';
            ?>
            <img class="media <?php e($key < 3, " lazyload lazypreload") ?>"
          	src="<?php $image->width(500)->url() ?>"
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
