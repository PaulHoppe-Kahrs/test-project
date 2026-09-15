<?php

// 1. Numerisches Array erstellen und modifizieren
$obst = ['Apfel', 'Banane', 'Orange', 'Birne', 'Mango'];
$obst[] = 'Erdbeere';
$obst[] = 'Ananas';
array_shift($obst);
array_unshift($obst, 'Kirsche');

echo "Obst: " . implode(', ', $obst) . PHP_EOL;

// 2. Assoziatives Array für ein Buch
$buch = [
    'titel' => 'Der kleine Prinz',
    'autor' => 'Antoine de Saint-Exupéry',
    'preis' => 12.99,
];
$buch['preis'] = 14.99;
$buch['jahr'] = 1943;

echo "Buch: {$buch['titel']} von {$buch['autor']}, Preis: {$buch['preis']} EUR, Jahr: {$buch['jahr']}" . PHP_EOL;

// 3. Namen und Noten kombinieren
$schueler = ['Anna', 'Ben', 'Clara', 'David', 'Emilia'];
$noten = [2, 1, 3, 1, 2];
$schuelerNoten = array_combine($schueler, $noten);

// 4. Nach Noten absteigend sortieren und beste Note ermitteln
arsort($schuelerNoten);
$besteNote = min($schuelerNoten);
$besterSchueler = array_search($besteNote, $schuelerNoten, true);

echo "Schüler und Noten:" . PHP_EOL;
foreach ($schuelerNoten as $name => $note) {
    echo "$name: $note" . PHP_EOL;
}
echo "Beste Note: $besteNote, erhalten von: $besterSchueler" . PHP_EOL;
