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
	public const int MAX_GESCHWINDIGKEIT = 250;

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
		return $this->marke . ' ' . $this->modell . ' fährt.';
	}

	public function inspektionDurchführen(): string
	{
		return $this->marke . ' ' . $this->modell . ' wurde inspiziert.';
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

$erstesAuto = new Auto('WVWZZZ1JZXW000001', 'Volkswagen', 'Golf');
$zweitesAuto = new Auto('WBAAA11000AB00002', 'BMW', '3er');

echo $erstesAuto->fahre() . PHP_EOL;
echo $erstesAuto->inspektionDurchführen() . PHP_EOL;
echo 'VIN: ' . $erstesAuto->vin . PHP_EOL;
echo 'Maximalgeschwindigkeit: ' . $erstesAuto->getMaximalgeschwindigkeit() . ' km/h' . PHP_EOL;
echo 'Anzahl Autos: ' . Auto::zeigeAnzahlAutos() . PHP_EOL;
