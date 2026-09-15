<?php
// Dieses Skript zeigt wichtige Techniken im Umgang mit Variablen und Datentypen.

// Verschiedene Datentypen definieren.
$name = "Anna";                    // String
$alter = 25;                       // Integer
$koerpergroesse = 1.68;            // Float
$istStudentin = true;              // Boolean
$hobbys = ["Lesen", "Radfahren"]; // Array

echo "<h1>Variablen und Datentypen</h1>";

// Den Datentyp mit gettype() feststellen.
echo "<h2>Datentypen</h2>";
echo "Der Datentyp von name ist: " . gettype($name) . "<br>";
echo "Der Datentyp von alter ist: " . gettype($alter) . "<br>";
echo "Der Datentyp von koerpergroesse ist: " . gettype($koerpergroesse) . "<br>";
echo "Der Datentyp von istStudentin ist: " . gettype($istStudentin) . "<br>";

// var_dump() gibt zusätzlich den Wert und weitere Typinformationen aus.
echo "<pre>";
var_dump($name, $alter, $koerpergroesse, $istStudentin, $hobbys);
echo "</pre>";

// Typkonvertierung: Der String wird zunächst in eine Zahl umgewandelt.
$alterAlsText = "30";
$alterAlsZahl = (int) $alterAlsText;
$alterAlsFloat = (float) $alterAlsZahl;
$alterAlsBoolean = (bool) $alterAlsZahl;

echo "<h2>Typkonvertierung</h2>";
echo "Vorher: " . gettype($alterAlsText) . "<br>";
echo "Als Integer: " . $alterAlsZahl . " (" . gettype($alterAlsZahl) . ")<br>";
echo "Als Float: " . $alterAlsFloat . " (" . gettype($alterAlsFloat) . ")<br>";
echo "Als Boolean: " . ($alterAlsBoolean ? "true" : "false") . "<br>";

// Variablen prüfen: isset() prüft, ob eine Variable existiert und nicht null ist.
$optionalerWert = null;
$leererText = "";

echo "<h2>Variablen prüfen</h2>";
echo "isset(\$name): " . (isset($name) ? "true" : "false") . "<br>";
echo "isset(\$optionalerWert): " . (isset($optionalerWert) ? "true" : "false") . "<br>";
echo "empty(\$leererText): " . (empty($leererText) ? "true" : "false") . "<br>";
echo "is_null(\$optionalerWert): " . (is_null($optionalerWert) ? "true" : "false") . "<br>";

// unset() löscht eine Variable. Danach ist sie nicht mehr gesetzt.
$zuLoeschendeVariable = "wird gelöscht";
unset($zuLoeschendeVariable);
echo "Nach unset(): " . (isset($zuLoeschendeVariable) ? "noch gesetzt" : "nicht mehr gesetzt") . "<br>";

// Variable Variablen: Der Inhalt von $variablenName wird zu einem Variablennamen.
$variablenName = "farbe";
$$variablenName = "Blau";
echo "<h2>Variable Variable</h2>";
echo "Der Wert von \\$farbe ist: " . $farbe . "<br>";

// Referenz: Beide Variablen zeigen auf denselben Speicherwert.
$original = "Startwert";
$referenz =& $original;
$referenz = "Geänderter Wert";

echo "<h2>Referenzen</h2>";
echo "Wert von original nach der Änderung über die Referenz: " . $original . "<br>";
echo "Wert von referenz: " . $referenz . "<br>";
?>
