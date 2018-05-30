<div id="projects">
	<?php foreach ($data->children()->visible() as $key => $project): ?>

		<?php if(true || $project->featured()->isNotEmpty()): ?>

			<?php snippet('project-thumb', array('project' => $project, 'featured' => $project->featured())) ?>
			<?php snippet('project-thumb', array('project' => $project, 'featured' => $project->featured2())) ?>
			<?php snippet('project-thumb', array('project' => $project, 'featured' => $project->featured3())) ?>

		<?php endif ?>

	<?php endforeach ?>
</div>