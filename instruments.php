<?php
include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden
include('inc/fingering.inc.php');  //Griffetabellen-erzeugungs-funktionen

$content .= '<div id="instruments" >';

//trumpet
$content .= '
<h2>Trumpet</h2>
<img src="img/trumpet.svg" style="height:150px;" alt="trumpet" />';
$content .= trumpet();


//trombone
$content .= '
<h2>Tenortrombone</h2>
<img src="img/tenortrombone.svg" style="height:200px;" alt="trombone" />';
$content .= tenorTrombone();


//tenorbasstrombone
$content .= '
<h2>Tenorbasstrombone</h2>
<img src="img/tenortrombone.svg" style="height:200px;" alt="tenorbasstrombone" />';
$content .= tenorBassTrombone();


//tenorsaxophone
$content .= '<h2>Tenor Saxophone</h2>';
$content .= tenorSaxophone();
	

$content .= '</div>';
	

$template = new template($template_file);//Template parsen
$template->readtemplate();
$template->replace('TITLE', $title);
$template->replace('HEADER', $template_header);
$template->replace('MENU', $menu);
$template->replace('CONTENT', $content);
$template->replace('FOOTER', $footer);
$template->parse();

?>