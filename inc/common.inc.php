<?php

function error_handler($errno, $errstr, $errfile, $errline) {
    if (substr($_SERVER['REQUEST_URI'], 0, 5) == '/dev/')
        echo '<pre>'.(new ErrorException($errstr, 0, $errno, $errfile, $errline)).'</pre>';
    else
    // mail('philipp@chuisy.com, christopher@chuisy.com', 'chuisy-Fehler!', new ErrorException($errstr, 0, $errno, $errfile, $errline));
    // TODO: Zu Fehlerseite weiterleiten
    if ($errno != E_WARNING && $errno != E_NOTICE)
        exit;
}

set_error_handler('error_handler');

include('config.inc.php');//Config-Datei einbinden
include('charts.inc.php');


if($wartung == 1){header('Location: maintenance.php');};//wenn Wartungsmodus aktiviert ist, auf die Wartungsseite weiterleiten


include('classes/db_mysql.php');
include('classes/template.class.php');//Template-Klasse einbinden

/*
if (get_magic_quotes_gpc()) {
    function strip_array($var) {
        return is_array($var) ? array_map('strip_array', $var) : stripslashes($var);
    }
    
    $_POST = strip_array($_POST);
    $_SESSION = strip_array($_SESSION);
    $_GET = strip_array($_GET);
}*/

//richtige Sprachdatei einbinden
if(isset($_GET['lang'])){//wenn sonst die Sprache per GET übergeben wird
     $language = $_GET['lang'];
}else{//wenn nichts angegeben ist, wird diese Sprache ausgewaehlt (hier de für deutsch)
     $language = 'de';
};
define('LANGUAGE', $language);


if(file_exists('lang/'.$language.'.php')){//falls generierte Sprach-Datei existiert, Sprach-Datei einbinden 
     include('lang/'.$language.'.php');
}else{//Sonst deutsch einbinden
     include('lang/de.php');
}

include('functions.inc.php');//Funktions-Datei einbinden

/*
//nicht aktivierte Accounts ausloggen
$not_activated = db::getAll('user', array('activated' => 0, 'loggedin' => 1));
for($o=0;$o<count($not_activated);$o++){
     db::update('user', array('loggedin' => 0), $not_activated[$o]['id']);
}


//Accounts ausloggen, die inaktiv sind
$time = time() - 60*60;
$inactive = db::getAll('user', '`last_action` <= '.db::full_quote_str($time).' AND `loggedin` = 1');//'..'
for($g=0;$g<count($inactive);$g++){
     db::update('user', array('loggedin' => 0), $inactive[$g]['id']);
}

//User wird tatsächlich ausgeloggt und auf index.php geleitet; letzte Aktion des Users wird upgedatet
if(isset($_SESSION['UserID']) && $_SESSION['UserID'] != ''){
     db::update('user', array('last_action' => time()), $_SESSION['UserID']);
     $logged_in = db::get('user', $_SESSION['UserID']);
     if($logged_in['loggedin'] == 0 && $logged_in['login_hash'] == ''){
          $_SESSION = array();
          session_destroy();
          header('Location: index.php');
     }
}*/

$dateiname = get_dateiname($_SERVER['PHP_SELF']);
if(isset($lang['title'][$dateiname])){
     $title = escape_text($lang['title'][$dateiname]);//sprach- und dateispezifischen Titel ausgeben
}

$feedback_formular ='
			<div id="opener"><span id="arrow_open">F e e d b a c k</span></div>	
			<div id="content">
			<form id="feedback">
     				<input type="radio" name="feedback_type" value="problem" /><em>'.escape_text($lang['feedback']['problem']).'</em>
     				<input type="radio" name="feedback_type" value="question" /><em>'.escape_text($lang['feedback']['question']).'</em>
     				<input type="radio" name="feedback_type" value="idea" /><em>'.escape_text($lang['feedback']['idea']).'</em>
     				<input type="radio" name="feedback_type" value="praise" /><em>'.escape_text($lang['feedback']['praise']).'</em>
     				<input maxlength="200" type="text" name="subject" id="feedback_subject" value="'.escape_text($lang['feedback']['subject']).'" onfocus="clearField(this, \''.escape_text($lang['feedback']['subject']).'\');" onclick="clearField(this, \''.escape_text($lang['feedback']['subject']).'\');" onBlur="insertField(this, \''.escape_text($lang['feedback']['subject']).'\');" style="color:rgb(100, 100, 100);" />
     				<textarea id="feedback_description" name="description" onfocus="clearField(this, \''.escape_text($lang['feedback']['description']).'\');" onclick="clearField(this, \''.escape_text($lang['feedback']['description']).'\');" onBlur="insertField(this, \''.escape_text($lang['feedback']['description']).'\');" style="color:rgb(100, 100, 100);">'.escape_text($lang['feedback']['description']).'</textarea>
     				<input type="button" value="'.escape_text($lang['send']).'" onclick="send_feedback();" />
				</form></div>';

	
$menu .= '';
$menu .= '
	<h1>Openmusicdatabase</h1>
		<form action="index.php"><fieldset><input type="text" name="search" /></fieldset></form> 
		<a id="upload" href="upload.php" >Upload</a>
	<a href="instruments.php">Instruments</a>
	<a href="range.php">Range</a>
	<a href="charts.php">Charts</a>
	<a href="circles.php">Circles</a>	
';
				
$footer .='
	<ul>
	   <li><span id="copyright">Openmusiclibrary 2010 </span></li>
       <li><a href="imprint.php">Impressum</a></li>
	   <li><a href="terms_of_use.php">Terms of Use</a></li>
	   <li><a href="privacy.php">Privacy Policy</a></li>
     </ul>
';	

$content = ''; //leere Variable fuer den Content vorgeben, die dann in der Datei aufgefuellt wird
?>
