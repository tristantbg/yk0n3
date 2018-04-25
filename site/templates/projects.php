<?php snippet('header') ?>

<div id="projects" class="c8 co2 fl x xjb xw">
	<?php foreach ($projects as $key => $project): ?>

		<?php if(true || $project->featured()->isNotEmpty()): ?>

			<a href="<?= $project->url() ?>" class="project-item">

				<?php if ($project->featured()->isNotEmpty()): ?>
					<?php snippet('responsive-image', array('field' => $project->featured(), 'ratio' => 1/1, 'maxWidth' => 1000)) ?>
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

		<?php endif ?>

	<?php endforeach ?>
</div>

<?php snippet('footer') ?>
