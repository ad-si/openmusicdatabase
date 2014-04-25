<?php

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden




$content .='
<div id="range">
<table>
	<tr>
		<td>Frequenz</td>
		<td>'.show_frequenz(0).'</td>
	</tr>
	<tr>
		<td>Piano</td>
		<td>'.show_range(0).'</td>
	</tr>
	<br />
	<tr>
		<td>Human Voice</td>
		<td>'.show_range($human).'</td>
	</tr>
	<tr>
		<td>Bass</td>
		<td>'.show_range($bass).'</td>
	</tr>
	<tr>
		<td>Bartion</td>
		<td>'.show_range($baritone).'</td>
	</tr>
	<tr>
		<td>Tenor</td>
		<td>'.show_range($tenor).'</td>
	</tr>
	<tr>
		<td>Alto</td>
		<td>'.show_range($alto).'</td>
	</tr>
	<tr>
		<td>Mezzosporano</td>
		<td>'.show_range($mezzosoprano).'</td>
	</tr>
	<tr>
		<td>Soprano</td>
		<td>'.show_range($soprano).'</td>
	</tr>
	
	<br />
	
	<tr>
		<td>Trumpet</td>
		<td>'.show_range($trumpet).'</td>
	</tr>
	<tr>
		<td>Tenortrombone</td>
		<td>'.show_range($trombone).'</td>
	</tr>
	<tr>
		<td>Tenorbasstrombone</td>
		<td>'.show_range($tenorbasstrombone).'</td>
	</tr>
	<tr>
		<td>Tenor Saxophone</td>
		<td>'.show_range($tenor_saxophone).'</td>
	</tr>
</table>
</div>
';


$template = new template($template_file);//Template parsen
$template->readtemplate();
$template->replace('TITLE', $title);
$template->replace('HEADER', $template_header);
$template->replace('MENU', $menu);
$template->replace('CONTENT', $content);
$template->replace('FOOTER', $footer);
$template->parse();

?>