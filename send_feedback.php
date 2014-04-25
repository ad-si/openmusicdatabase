<?php

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden

if( !isset($_SESSION['UserID']) ){ header("Location: index.php"); die;}

$errors = array();
if(!isset($_POST['feedback_type']) || $_POST['feedback_type'] == ''){
     $errors[] = $lang['feedback']['errors']['no_type'];
}
if(!isset($_POST['subject']) || $_POST['subject'] == '' || $_POST['subject'] == $lang['feedback']['subject']){
     $errors[] = $lang['feedback']['errors']['no_subject'];
}
if(!isset($_POST['description']) || $_POST['description'] == '' || $_POST['description'] == $lang['feedback']['description']){
     $errors[] = $lang['feedback']['errors']['no_description'];
}

if(count($errors)){
     print '<span class="feedback_error">';
     print '<!--error-->'."\n";
     foreach( $errors as $val ){
          print '<em>'.escape_text($val)."</em><br />\n";                    
     }
     print '</span>';
}else{
     db::insert('feedback', array('user_id' => $_SESSION['UserID'], 'time' => time(), 'type' => $_POST['feedback_type'], 'subject' => $_POST['subject'], 'description' => $_POST['description']));
     //mail();
     print '<em class="thanks"><br /><br /><br /><br /><br /><br /><br /><br />'.escape_text($lang['feedback']['success']).'<br /><br /><br /><br /><br /><br /><br /><br /></em>';
}

?>