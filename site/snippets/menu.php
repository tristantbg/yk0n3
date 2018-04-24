<?php

// main menu items
$items = $pages->visible();

// only show the menu if items are available
if($items->count()):

?>

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
    <li>FR/<span class="bold">EN</span></li>
  </ul>
</nav>
<?php endif ?>