<?php
$name = "Anna";
$alter = 25;
$koerpergroesse = 1.68;
$istStudentin = true;
$hobbys = ["Lesen", "Radfahren"];

echo "<h1>Variablen und Datentypen</h1>";

echo "<h2>Datentypen</h2>";
echo "Der Datentyp von name ist: " . gettype($name) . "<br>";
echo "Der Datentyp von alter ist: " . gettype($alter) . "<br>";
echo "Der Datentyp von koerpergroesse ist: " . gettype($koerpergroesse) . "<br>";
echo "Der Datentyp von istStudentin ist: " . gettype($istStudentin) . "<br>";

echo "<pre>";
var_dump($name, $alter, $koerpergroesse, $istStudentin, $hobbys);
echo "</pre>";

$alterAlsText = "30";
$alterAlsZahl = (int) $alterAlsText;
$alterAlsFloat = (float) $alterAlsZahl;
$alterAlsBoolean = (bool) $alterAlsZahl;

echo "<h2>Typkonvertierung</h2>";
echo "Vorher: " . gettype($alterAlsText) . "<br>";
echo "Als Integer: " . $alterAlsZahl . " (" . gettype($alterAlsZahl) . ")<br>";
echo "Als Float: " . $alterAlsFloat . " (" . gettype($alterAlsFloat) . ")<br>";
echo "Als Boolean: " . ($alterAlsBoolean ? "true" : "false") . "<br>";

$optionalerWert = null;
$leererText = "";

echo "<h2>Variablen prüfen</h2>";
echo "isset(\$name): " . (isset($name) ? "true" : "false") . "<br>";
echo "isset(\$optionalerWert): " . (isset($optionalerWert) ? "true" : "false") . "<br>";
echo "empty(\$leererText): " . (empty($leererText) ? "true" : "false") . "<br>";
echo "is_null(\$optionalerWert): " . (is_null($optionalerWert) ? "true" : "false") . "<br>";

$zuLoeschendeVariable = "wird gelöscht";
unset($zuLoeschendeVariable);
echo "Nach unset(): " . (isset($zuLoeschendeVariable) ? "noch gesetzt" : "nicht mehr gesetzt") . "<br>";

$variablenName = "farbe";
$$variablenName = "Blau";
echo "<h2>Variable Variable</h2>";
echo "Der Wert von \\$farbe ist: " . $farbe . "<br>";

$original = "Startwert";
$referenz =& $original;
$referenz = "Geänderter Wert";

echo "<h2>Referenzen</h2>";
echo "Wert von original nach der Änderung über die Referenz: " . $original . "<br>";
echo "Wert von referenz: " . $referenz . "<br>";
?>
