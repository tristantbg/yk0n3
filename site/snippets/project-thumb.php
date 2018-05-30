<a href="<?= $project->url() ?>" class="project-item">

	<?php if ($featured->isNotEmpty()): ?>
		<?php snippet('responsive-image', array('field' => $featured, 'ratio' => 1/1, 'maxWidth' => 1000, 'preload' => true)) ?>
	<?php else: ?>
		<div class="ph" style="padding-top: 100%"></div>
	<?php endif ?>

	<div class="project-item--infos">
		<div class="project-item--header">
			<div class="project-item--title bold ttu"><?= $project->title()->html() ?></div>
			<div class="project-item--subtitle"><?= $project->subtitle()->html() ?></div>
		</div>

		<div class="project-item--footer">
			<?php if ($project->influencers()->isNotEmpty()): ?>
				<div class="project-analytics x xjb">
					<div>Influencers</div>
					<div class="bold"><?= $project->influencers()->html() ?></div>
				</div>
			<?php endif ?>
			<?php if ($project->impressions()->isNotEmpty()): ?>
				<div class="project-analytics x xjb">
					<div>Impressions</div>
					<div class="bold"><?= $project->impressions()->html() ?></div>
				</div>
			<?php endif ?>
			<?php if ($project->engagement()->isNotEmpty()): ?>
				<div class="project-analytics x xjb">
					<div>Engagement rate</div>
					<div class="bold"><?= $project->engagement()->html() ?></div>
				</div>
			<?php endif ?>
		</div>
	</div>

</a>