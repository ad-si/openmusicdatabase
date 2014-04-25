<?php

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden
     	 
$content .='';
 
	 
     
$template_header .= '';


$template = new template($template_file);//Template parsen
$template->readtemplate();
$template->replace('TITLE', $title);
$template->replace('HEADER', $template_header);
$template->replace('MENU', $menu);
$template->replace('CONTENT', $content);
$template->replace('FOOTER', $footer);
$template->parse();

?>