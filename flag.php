<?php

//Ueberpruefen, ob dieses Objekt schon geflagged wurde, dann nicht mehr flaggen zulassen

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden

if( !isset($_SESSION['UserID']) ){ header("Location: index.php"); die;}

if(isset($_GET['object']) && $_GET['object'] != ''){
     $errors = array();
     if(!isset($_GET['id']) || $_GET['id'] == ''){
          $errors[] = $lang['delete_handler']['error_no_id'];
     }
     if(!isset($_GET['object']) || $_GET['object'] == ''){
          $errors[] = $lang['delete_handler']['error_no_object'];
     }
     
     if(count($errors)){
          print '<!--error-->';
          foreach($errors as $val){
               print "<br />\n".escape_text($val);
          }
     }else{
          print escape_text($lang['flag_handler']['reason_flag'])."<br />\n";
          print '<form action="flag.php" method="post" name="flag" id="flag">
     <select name="reason">';
     sort($lang['flag_handler']['reasons']);
     $i=0;
     foreach($lang['flag_handler']['reasons'] as $val){
          print '<option value="'.$i.'">'.escape_text($val).'</option>';
          $i++;
     }
     print '     </select><br />
     '.escape_text($lang['comment']).': <textarea name="comment" style="border:1px solid black;"></textarea><br />
     <input type="hidden" name="object" value="'.escape_text($_GET['object']).'" />
     <input type="hidden" name="id" value="'.escape_text($_GET['id']).'" />
     <input type="button" name="abort" value="'.escape_text($lang['abort']).'" onclick="$.facebox.close();" />
     <input type="button" name="submit" value="'.escape_text($lang['flag']).'" onclick="flag_object();"/>
</form>';
     }
}elseif(isset($_POST['object']) && $_POST['object'] != ''){
     /*Array
(
    [reason] => 0
    [comment] => cvbn
    [object] => question
    [id] => 2
)*/
     $errors = array();
     if($_POST['reason'] == 0 || $_POST['reason'] == '' || !isset($_POST['reason']) || !is_numeric($_POST['reason'])){
          $errors[] = '1';
     }
     if(strlen($_POST['comment']) > $maximum_flag_comment_length){
          $errors[] = '2';
     }
     if($_POST['object'] == 'question'){//$_POST['object'] == 'comment' || $_POST['object'] == 'pinboard' || 
          
     }else{
          $errors[] = '3';
     }
     if($_POST['id'] == 0 || $_POST['id'] == '' || !isset($_POST['id']) || !is_numeric($_POST['id'])){
          $errors[] = '4';
     }
     
     if(count($errors)){
          print '<!--error-->';
          foreach($errors as $val){
               print "<br />\n".escape_text($val);
          }
     }else{
          db::insert('flags', array('object' => $_POST['object'], 'flagged_id' => $_POST['id'], 'user_id' => $_SESSION['UserID'], 'reason' => $_POST['reason'], 'comment' => $_POST['comment']));
     }
}

?>