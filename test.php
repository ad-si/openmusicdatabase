<?php 

header("Content-Type: application/xhtml+xml");

echo '<?xml version="1.0" standalone="yes"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"
  "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de">
  <head>
    <title>SVG-Inline-Code (Variante 2)</title>
	<meta http-equiv="content-type" content="application/xhtml+xml; charset=UTF-8" />
  </head>
  <body>
    <h1>SVG-Grafik innerhalb eines XHTML-Dokuments</h1>
    <p>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" version="1.1"
	  viewBox="0 0 100 100" >
        <circle cx="50" cy="50" r="50" />
      </svg>
    </p>
  </body>
</html>';

?>
