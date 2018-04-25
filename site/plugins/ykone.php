<?php

page::$methods['pageDescription'] = function($page) {


  $t = $page->intendedTemplate();

  $description = '';

  switch ($t) {
    case 'entry':
      $description .= '<h1>'.$page->title().'</h1>';
      $description .= $page->text()->kt();
      break;

    case 'event':
      $description .= '<h1>'.$page->title().'</h1>';
      if($page->date()) $description .= '<div class="ttu">'.$page->date('F d Y').'</div>';
      if($page->place()->isNotEmpty()) $description .= '<div class="ttu">@ '.$page->place().'</div>';
      if($page->link()->isNotEmpty()) $description .= '<a href="'.$page->link().'" class="lead">Register</a>';
      $description .= $page->text()->kt();
      break;

    default:
      $description .= '<h1>'.$page->title().'</h1>';
      $description .= $page->text()->kt();
      break;
  }

  return html($description);
};
