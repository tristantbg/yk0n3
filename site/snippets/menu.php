<?php

// main menu items
$items = $pages->visible();

// only show the menu if items are available
if($items->count()):

?>

<div id="logo">
  <?php snippet('logo') ?>
</div>

<div id="burger">
	<span></span>
	<span></span>
	<span></span>
	<span></span>
</div>

<nav id="menu">
  <ul>
    <?php foreach($items as $item): ?>
    	<?php if (!$item->isHomepage()): ?>
    		<li><a<?php e($item->isOpen(), ' class="active"') ?> href="<?= $item->url() ?>"><?= $item->title()->html() ?></a></li>
    	<?php endif ?>
    <?php endforeach ?>
    <div id="languages">
      <?php foreach($site->languages() as $language): ?>
          <a<?php e($site->language() == $language, ' class="bold"') ?> href="<?= $page->url($language->code()) ?>">
            <?= html($language->code()) ?>
          </a>
      <?php endforeach ?>
    </div>
  </ul>
</nav>
<?php endif ?>
