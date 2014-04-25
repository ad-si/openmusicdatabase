<?php

function escape_text($text) {
     return htmlspecialchars($text);
}

function replace_links($text){//http://elearning.lse.ac.uk/blogs/clt/?p=285
     return preg_replace('|([A-Za-z]{3,9})://([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((/[-\+~%/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?|', '<a href="leave_chuisy.php?link=$0" target="_blank">$0</a>', $text);
}


function is_valid_email($email) {
     $pattern1 = '/^[^0-9][a-zA-Z0-9_]+([.-][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/';//http://hmvrulz.wordpress.com/2008/09/22/8-practical-php-regular-expressions/
     $pattern2 = '/^([a-zA-Z0-9]((\.|\-|_)?[a-zA-Z0-9])*)@([a-zA-Z]((\.|\-)?[a-zA-Z0-9])*)\.([a-zA-Z]{2,8})$/';//http://www.peuss.com/PHP/RegEx/erkennungEmail.php
     return preg_match($pattern2, $email);
}


function get_dateiname ($ganze_url){//Funktion, um nur Dateinamen (ohne Erweiterung) aus einem String (URL oder Dateiname mit Erweiterung) zu extrahieren
     $needle = substr($ganze_url, strrpos($ganze_url, "/")+1);
     $laenge_ohne_php = strlen($needle)-4;
     return substr($needle, strrpos($needle, ".php")-$laenge_ohne_php, $laenge_ohne_php);
}

function show_frequenz($instrument){
	
	global $piano, $standard_pitch;

	$cont = '<div class="frequenz">';
	for ($i=-48; $i<40; $i++){
	
			$frequenz[$i] = $standard_pitch * pow(2,($i/12));

			if ($piano[$i][1] == '#')$a=' black';
			else $a=' white';	
		
			$br = wordwrap(round($i, 2), 1, "<br />", true);
			
		$cont .= '<div  id="'.$piano[$i].'" class="piano_button">'.$br.'</div>';
	}
	$cont .= '</div><br />';
	
	return $cont; 
}

function show_range($instrument){
	
	global $piano;

	for ($i=-48; $i<40; $i++){

			if ($piano[$i][1] == '#')$a=' black';
			else $a=' white';	
			
			if (isset($instrument[$i][0]))$b='playable';	
			elseif (isset($instrument[$i][1][0]))$b='playable';
			else $b='';	
			
		$cont .= '<div id="'.$piano[$i].'" class="piano_button'.$a.''.$b.'">'.$piano[$i] .'</div>';
	}
	
	return $cont; 
}


function iptocountry($ip){
     $ip = sprintf("%u",IP2Long($ip));
     
     $row = db::get('iptocountry', 'IP_from <= '.db::full_quote_str($ip).' AND IP_to >= '.db::full_quote_str($ip));
     
     if(count($row) == 0){
          $zwei = "Unbekannt";//in Sprachdatei auslagern
     }else{
          $zwei = escape_text($row['zwei']);
     }

     return $zwei;
}


function convert_seconds($seconds){
     
     if($seconds >= 86400){
          $days = floor($seconds/86400);
          $seconds = $seconds-($days*86400);
     }
     
     if($seconds >= 3600){
          $hours = floor($seconds/3600);
          $seconds = $seconds-($hours*3600);
     }
     
     if($seconds >= 60){
          $minutes = floor($seconds/60);
          $seconds = $seconds -($minutes*60);
     }
     
     $time_return = array();
     if(isset($days)){$time_return['days'] = $days;}else{$time_return['days'] = '0';}
     if(isset($hours)){$time_return['hours'] = $hours;}else{$time_return['hours'] = '0';}
     if(isset($minutes)){$time_return['minutes'] = $minutes;}else{$time_return['minutes'] = '0';}
     $time_return['seconds'] = $seconds;
     
     return $time_return;
}