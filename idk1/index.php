<?php

declare(strict_types=1);

abstract class Fahrzeug
{
    abstract public function fahre(): string;
}

interface Inspektion
{
    public function inspektionDurchführen(): string;
}

class Auto extends Fahrzeug implements Inspektion
{
    public const MAX_GESCHWINDIGKEIT = 250;

    private static int $anzahlAutos = 0;

    public function __construct(
        public readonly string $vin,
        private string $marke,
        private string $modell,
    ) {
        self::$anzahlAutos++;
    }

    public function fahre(): string
    {
        return $this->marke . ' ' . $this->modell . ' fährt jetzt.';
    }

    public function inspektionDurchführen(): string
    {
        return 'Inspektion für ' . $this->marke . ' ' . $this->modell . ' erfolgreich.';
    }

    public static function zeigeAnzahlAutos(): int
    {
        return self::$anzahlAutos;
    }

    final public function getMaximalgeschwindigkeit(): int
    {
        return self::MAX_GESCHWINDIGKEIT;
    }
}

$auto1 = new Auto('WVWZZZ1JZXW000001', 'Volkswagen', 'Golf');
$auto2 = new Auto('WBAAA11000AB00002', 'BMW', '3er');

echo $auto1->fahre() . PHP_EOL;
echo $auto1->inspektionDurchführen() . PHP_EOL;
echo 'VIN: ' . $auto1->vin . PHP_EOL;
echo 'Maximalgeschwindigkeit: ' . $auto1->getMaximalgeschwindigkeit() . ' km/h' . PHP_EOL;
echo 'Anzahl Autos: ' . Auto::zeigeAnzahlAutos() . PHP_EOL;