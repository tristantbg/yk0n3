<?php snippet('header') ?>

<div id="mobile-home">
	<?php snippet('sections/'.$page->intendedTemplate(), array('data' => $page)) ?>
</div>

<div id="fullpage">
	<?php foreach($pages->visible() as $section): ?>
		<section class="section" page-type="<?= $section->intendedTemplate() ?>" data-anchor="<?= $section->uid() ?>">
			<?php snippet('sections/'.$section->intendedTemplate(), array('data' => $section)) ?>
		</section>
	<?php endforeach ?>
</div>

<?php snippet('footer') ?>
