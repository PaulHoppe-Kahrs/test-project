<?php

echo "<h1>Operatoren in PHP</h1>";

$zahl1 = 10;
$zahl2 = 3;

$addition = $zahl1 + $zahl2;
$subtraktion = $zahl1 - $zahl2;
$multiplikation = $zahl1 * $zahl2;
$division = $zahl1 / $zahl2;
$modulo = $zahl1 % $zahl2;

echo "<h2>Arithmetische Operatoren</h2>";
echo "Addition: $addition<br>";
echo "Subtraktion: $subtraktion<br>";
echo "Multiplikation: $multiplikation<br>";
echo "Division: $division<br>";
echo "Modulo: $modulo<br>";

$wert = 20;
$wert += 5;
$wert -= 3;
$wert *= 2;
$wert /= 4;
$wert %= 5;

echo "<h2>Kurzformen von mathematischen Operatoren</h2>";
echo "Wert nach Kurzformen: $wert<br>";

$counter = 5;
$vorInkrement = ++$counter;
$nachInkrement = $counter++;
$vorDekrement = --$counter;
$nachDekrement = $counter--;

echo "<h2>Inkrement- und Dekrement-Operatoren</h2>";
echo "Vor-Inkrement: $vorInkrement<br>";
echo "Nach-Inkrement: $nachInkrement<br>";
echo "Vor-Dekrement: $vorDekrement<br>";
echo "Nach-Dekrement: $nachDekrement<br>";

$potenz = 2 ** 5;
echo "<h2>Exponential-Operator</h2>";
echo "2 ** 5 = $potenz<br>";

$vorname = "Anna";
$nachname = "Müller";
$vollerName = $vorname . " " . $nachname;
$vollerName .= "!";

echo "<h2>Verkettungsoperator</h2>";
echo "Vollständiger Name: $vollerName<br>";

$gleich = (10 == 10) ? "true" : "false";
$identisch = (10 === "10") ? "true" : "false";
$ungleich = (5 != 3) ? "true" : "false";
$ungleichIdentisch = (5 !== "5") ? "true" : "false";
$kleiner = (3 < 5) ? "true" : "false";
$groesser = (8 > 4) ? "true" : "false";
$kleinerGleich = (4 <= 4) ? "true" : "false";
$groesserGleich = (9 >= 10) ? "true" : "false";

echo "<h2>Vergleichsoperatoren</h2>";
echo "10 == 10: $gleich<br>";
echo "10 === '10': $identisch<br>";
echo "5 != 3: $ungleich<br>";
echo "5 !== '5': $ungleichIdentisch<br>";
echo "3 < 5: $kleiner<br>";
echo "8 > 4: $groesser<br>";
echo "4 <= 4: $kleinerGleich<br>";
echo "9 >= 10: $groesserGleich<br>";

$alter = 20;
$status = ($alter >= 18) ? "Erwachsen" : "Minderjährig";

echo "<h2>Ternärer Operator</h2>";
echo "Alter 20 => $status<br>";

$benutzerName = null;
$ausgabeName = $benutzerName ?? "Gast";

echo "<h2>Null-Coalescing-Operator</h2>";
echo "Benutzername: $ausgabeName<br>";

$vergleich = 5 <=> 10;
$vergleich2 = 10 <=> 5;
$vergleich3 = 5 <=> 5;

echo "<h2>Spaceship-Operator</h2>";
echo "5 <=> 10 = $vergleich<br>";
echo "10 <=> 5 = $vergleich2<br>";
echo "5 <=> 5 = $vergleich3<br>";

$logischUnd = (true && false) ? "true" : "false";
$logischOder = (true || false) ? "true" : "false";
$logischNicht = (!true) ? "true" : "false";

echo "<h2>Logische Operatoren</h2>";
echo "true && false: $logischUnd<br>";
echo "true || false: $logischOder<br>";
echo "!true: $logischNicht<br>";

$kurzschlussUnd = false && (5 / 0);
$kurzschlussOder = true || (5 / 0);

echo "<h2>Short-circuit Evaluation</h2>";
echo "false && (5 / 0) => $kurzschlussUnd<br>";
echo "true || (5 / 0) => $kurzschlussOder<br>";

$zuweisung = 15;
$zuweisung = $zuweisung + 5;

echo "<h2>Zuweisungsoperator</h2>";
echo "Zuweisung: $zuweisung<br>";

?>
