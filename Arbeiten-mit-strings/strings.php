<?php

declare(strict_types=1);

$firstName = 'Max';
$lastName = 'Mustermann';
$fullName = $firstName . ' ' . $lastName;
$nameParts = [$firstName, $lastName];

echo "1. Strings verbinden\n";
echo "Mit dem Verkettungsoperator: $fullName\n";
echo 'Mit implode(): ' . implode(' ', $nameParts) . "\n\n";

$message = 'Hallo Welt';
echo "2. Auf einzelne Zeichen zugreifen\n";
echo "Erstes Zeichen: {$message[0]}\n";
echo "Siebtes Zeichen: {$message[6]}\n\n";

echo "3. Strings vergleichen\n";
echo 'strcmp("Apfel", "Banane"): ' . strcmp('Apfel', 'Banane') . "\n";
echo 'strcasecmp("Hallo", "HALLO"): ' . strcasecmp('Hallo', 'HALLO') . "\n\n";

$words = ['Banane', 'Apfel', 'Kirsche', 'Birne'];
sort($words, SORT_STRING);
echo "4. Alphabetisch sortieren\n";
echo implode(', ', $words) . "\n\n";

echo "5. Stringlaenge\n";
echo 'Laenge von "' . $message . '": ' . strlen($message) . "\n\n";

$sentence = 'PHP macht Spass mit Strings';
echo "6. Positionen finden\n";
echo 'Erstes s: ' . strpos($sentence, 's') . "\n";
echo 'Letztes s: ' . strrpos($sentence, 's') . "\n\n";

$original = 'Ich lerne JavaScript und JavaScript macht Spass.';
$replaced = str_replace('JavaScript', 'PHP', $original);
echo "7. Substrings ersetzen\n";
echo $replaced . "\n\n";

echo "8. Substring extrahieren\n";
echo 'Die ersten drei Zeichen: ' . substr($message, 0, 3) . "\n\n";

$mixedCase = 'Ein kleiner Text';
echo "9. Gross- und Kleinschreibung\n";
echo 'Kleinbuchstaben: ' . strtolower($mixedCase) . "\n";
echo 'Grossbuchstaben: ' . strtoupper($mixedCase) . "\n\n";

$spacedText = "   Text mit Leerzeichen   ";
echo "10. Whitespace trimmen\n";
echo 'trim():  >' . trim($spacedText) . "<\n";
echo 'ltrim(): >' . ltrim($spacedText) . "<\n";
echo 'rtrim(): >' . rtrim($spacedText) . "<\n\n";

$csv = 'HTML,CSS,PHP';
$technologies = explode(',', $csv);
echo "11. Strings aufteilen und zusammenfuegen\n";
echo 'explode(): ' . implode(' | ', $technologies) . "\n";
echo 'implode(): ' . implode(', ', $technologies) . "\n\n";

echo "12. Woerter und Substrings zaehlen\n";
echo 'Anzahl der Woerter: ' . str_word_count($sentence) . "\n";
echo 'Anzahl von "s": ' . substr_count($sentence, 's') . "\n";
