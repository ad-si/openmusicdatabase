<?php

include('inc/common.inc.php');//fuer alle Dateien gleiche Informationen einbinden



$content .='
<div id="upload">

	<form name="upload" action="http://www." method="post" enctype="multipart/form-data">
		<fieldset>
			<input type="text" value="Songtitle" placeholder="Songtitle"/>
			<input type="text" value="Composer" placeholder="Composer"/>  
			<input type="text" value="Arranger" placeholder="Arranger"/>
		</fieldset>
		
		<br />
		
			<label for="instrument">Instrument</label>  <select name="Instrument" placeholder="Instrumet" value="Instrument"><br />
												<option>Piano</option>
												<option>Grand Piano</option>
												<option>E-Piano</option>
												<option></option>
											</select><br />
			<label for="instrumentation">Instrumentation</label>			<!-- DURCH DRAG AND DROP ERSETZEN!!! --> 
			<select name="Instrumentation" placeholder="Instrumentation" >
				<option>Big Band</option>
				<option>Orchestra</option>
				<option>Big Band</option>
				<option>Big Band</option>
				<option>Big Band</option>
				<option>Big Band</option>
            </select><br />
		
		<fieldset>	
			<label id="meter_label" for="meter">Meter:</label>		<span id="meter">
												<input type="number" min="2" max="16" value="4"/><br />
												<input type="number" min="2" max="16" value="4"/>
											</span>
			<label for="bars">Bar:</label>  		<input type="number" min="1" value="1"/>
		    <label for="tempo">Tempo:</label>		<input type="number" value="120" min="1" max="230" />bpm
			<label for="time">Time:</label>			<input type="time" max="99:99" value="00:00"/>min
		</fieldset>
		
     		<label for="key">Key</label>			<select/>
												<option>C</option>
												<option>C#</option>
												<option>D</option>
												<option>D#</option>
												<option>E</option>
												<option>F</option>
												<option>F#</option>
												<option>G</option>
												<option>G#</option>
												<option>A</option>
												<option>A#</option>
												<option>B</option>
											<select/>
											<select>
											    <option>Major</option>
												<option>Minor</option>
											</select><br />
			<label for="levelofdifficulty">Level of Difficulty</label>
											<select>
												<option>1</option>
												<option>2</option>
												<option>3</option>
												<option>4</option>
												<option>5</option>
												<option>6</option>
												<option>7</option>
												<option>8</option>
												<option>9</option>
												<option>10</option>
											</select><br />
			
			<div class="links"><img id="Audio" src="img/audio.png" alt="Audio" /></div>
			<div class="links"><img id="Video" src="img/video.png" alt="Video" /></div>
			<div class="links"><img id="Image" src="img/image.png" alt="Image" /></div>
			<div class="links"><img id="Midi" src="img/midi.png" alt="Midi" /></div>
			<div class="links"><img id="MusicXML" src="img/musicxml.png" alt="MusicXML" /></div>
			
			<!--<label for="audio">Audio</label>		<input type="file" value="Image" placeholder="Audio"/><br />
			<label for="video">Video</label>		<input type="file" value="Image" placeholder="Video"/><br />
			<label for="image">Image</label>		<input type="file" value="Image" placeholder="Image"/><br />
			<label for="midi">Midi</label>			<input type="file" value="Midi" placeholder="Midi"/><br />
			<label for="musicxml">MusicXML</label>	<input type="file" value="MusicXML" placeholder="MusicXML"/><br />
			-->
    <input type="submit" />
	</form>
	
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