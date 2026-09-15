<?php
/**
 * Übungsaufgabe: Zufallszahlen in PHP generieren
 *
 * Diese Datei zeigt sowohl die traditionellen PHP-Funktionen
 * als auch die neue Random\Randomizer-Klasse (ab PHP 8.2).
 */

echo "=== 1. Traditionelle Funktionen ===" . PHP_EOL;

// --- rand() ---
// Erzeugt eine Zufallszahl zwischen 1 und 100
$randZahl = rand(1, 100);
echo "rand(1, 100): " . $randZahl . PHP_EOL;

// --- mt_rand() ---
// mt_rand() nutzt den "Mersenne Twister"-Algorithmus und ist schneller/besser als rand()
$mtRandZahl = mt_rand(1, 50);
echo "mt_rand(1, 50): " . $mtRandZahl . PHP_EOL;

echo PHP_EOL . "=== 2. Random\\Randomizer-Klasse (PHP 8.2+) ===" . PHP_EOL;

// Die Randomizer-Klasse benötigt eine "Engine". Ohne Angabe wird
// automatisch eine sichere Standard-Engine (Secure) verwendet.
$randomizer = new \Random\Randomizer();

// --- Einfache Zufallszahl zwischen 1 und 100 ---
$randomizerZahl = $randomizer->getInt(1, 100);
echo "Randomizer->getInt(1, 100): " . $randomizerZahl . PHP_EOL;

echo PHP_EOL . "=== 3. Praxisbeispiel: Lotterie-Simulation ===" . PHP_EOL;

/**
 * Simuliert eine einfache Lotterie-Ziehung.
 * Es werden 6 unterschiedliche Zahlen zwischen 1 und 49 gezogen
 * (klassisches "6 aus 49"-Prinzip).
 */
function lotterieZiehung(int $anzahlZahlen = 6, int $min = 1, int $max = 49): array
{
    $randomizer = new \Random\Randomizer();

    // pickArray liefert eine gegebene Anzahl an EINZIGARTIGEN Werten
    // aus einem Array zurück - perfekt für eine Lotterie ohne Wiederholungen.
    $zahlenPool = range($min, $max);
    $gezogeneZahlen = $randomizer->pickArray($zahlenPool, $anzahlZahlen);

    // Zur besseren Lesbarkeit sortieren wir die gezogenen Zahlen
    sort($gezogeneZahlen);

    return $gezogeneZahlen;
}

$lottoZahlen = lotterieZiehung();
echo "Gezogene Lottozahlen (6 aus 49): " . implode(", ", $lottoZahlen) . PHP_EOL;

// --- Bonus: Zusatzzahl mit shuffleArray() demonstrieren ---
echo PHP_EOL . "=== Bonus: Array mischen mit shuffleArray() ===" . PHP_EOL;
$karten = ["Herz-Ass", "Pik-König", "Karo-Dame", "Kreuz-Bube", "Herz-10"];
$gemischteKarten = $randomizer->shuffleArray($karten);
echo "Gemischte Karten: " . implode(", ", $gemischteKarten) . PHP_EOL;
