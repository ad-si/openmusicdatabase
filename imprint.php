<?php

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden

$title = escape_text($lang['imprint']);

$content .='
<div id="imprint">

<h3>Die Webseiten unter www.chuisy.com (inklusive Sub-Domains) und die auf diesen Seiten bereitgestellten Dienste sind ein Produkt der
Designection UG(haftungsbeschränkt) & Co. KG.</h3>
<br />
<b><a href="http://www.designection.com/">Designection UG(haftungsbeschränkt) & Co. KG.</a></b><br />
Schulstraße 20.<br /> 
88171 Weiler-Simmerberg<br />
<br />
<b>Geschäftsführer:</b><br />
<a href="mailto:johannes@chuisy">Johannes Müller</a><br />
<a href="mailto:philipp@chuisy">Philipp Höß</a><br />
<a href="mailto:adrian@chuisy">Adrian Sieber</a><br />
<br />
Die Designection UG(haftungsbeschränkt) & Co. KG. ist eine nach deutschem Recht gegründete und registrierte Gesellschaft.<br />
<br />
Registergericht: Amtsgericht Kempten <br /> 
Registernummer: HRA 9207<br />
UmsatzSt-Identifikationsnr. gemäß § 27a UmsatzStG: 134/155/02502<br />

</div>';

$template = new template($template_file);//Template parsen
$template->readtemplate();
$template->replace('TITLE', $title);
$template->replace('HEADER', $template_header);
$template->replace('MENU', $menu);
$template->replace('CONTENT', $content);
$template->replace('FOOTER', $footer);
$template->parse();

?>