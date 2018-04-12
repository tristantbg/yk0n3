<?php snippet('header') ?>

<?php foreach ($projects as $key => $project): ?>

	<?php if($project->featured()->isNotEmpty()): ?>

	<?php $featured = $project->featured()->toFile() ?>

		<div class="project-item">

			<?= $project->title()->html() ?>
			
		</div>

	<?php endif ?>

<?php endforeach ?>

<?php snippet('footer') ?>