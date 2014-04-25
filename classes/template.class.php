<?php
// Klasse initialisieren
class template {

     var $tmp_file; // Pfad zur Template Datei
     var $error; // Fehlermeldung
     var $content; // Inhalt des Templates

     // Konstruct
     function template($file, $error = "Template Datei nicht gefunden!") {
          // Variabeln auf Standardwerte setzen
          $this->tmp_file = $file;
          $this->error = $error;
          $this->content = "";
     }

     // Template Datei öffnen
     function readtemplate() {
          $file = @fopen($this->tmp_file, "r");
          if(!$file) {
               echo $this->error;
          }else{ // Datei einlesen
               while(!feof($file)) {
                    $temp = fgets($file, 4096);
                    $this->content .= $temp;
               }
          }
     }

// Platzhalter ersetzen
     function replace($title, $value) {// Alle {TITLE} durch VALUE ersetzen
          $this->content = str_replace("{" . $title . "}", $value, $this->content);
     }

// Fertige Datei ausgeben
     function parse() {
          echo $this->content;
     }

}
?>
