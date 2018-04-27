<?php

page::$methods['pageDescription'] = function($page) {


  $t = $page->intendedTemplate();

  $description = '';

  switch ($t) {
    case 'entry':
      $description .= '<h1>'.$page->title().'</h1>';
      $description .= $page->text()->kt();
      if($page->download()->isNotEmpty() && $page->download()->toFile()) $description .= '<div class="mt4"><a href="'.$page->download()->toFile()->url().'" class="lead" download>Download</a></div>';
      break;

    case 'event':
      $description .= '<h1>'.$page->title().'</h1>';
      if($page->date()) $description .= '<div class="ttu">'.$page->date('F d Y').'</div>';
      if($page->place()->isNotEmpty()) $description .= '<div class="ttu">@ '.$page->place().'</div>';
      $description .= '<div class="mt2">'.$page->text()->kt().'</div>';
      if($page->link()->isNotEmpty()) $description .= '<div class="mt4"><a href="'.$page->link().'" class="lead">Register</a></div>';
      break;

    default:
      $description .= '<h1>'.$page->title().'</h1>';
      $description .= $page->text()->kt();
      break;
  }

  return html($description);
};
