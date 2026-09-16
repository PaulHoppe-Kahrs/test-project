<?php
declare(strict_types=1);

class Fahrzeug
{
	private string $marke = '';
	private string $modell = '';
	private int $geschwindigkeit = 0;

	public function setMarke(string $marke): void
	{
		$this->marke = $marke;
	}

	public function getMarke(): string
	{
		return $this->marke;
	}

	public function setModell(string $modell): void
	{
		$this->modell = $modell;
	}

	public function getModell(): string
	{
		return $this->modell;
	}

	public function setGeschwindigkeit(int $geschwindigkeit): void
	{
		$this->geschwindigkeit = max(0, $geschwindigkeit);
	}

	public function getGeschwindigkeit(): int
	{
		return $this->geschwindigkeit;
	}

	public function beschleunigen(int $wert): void
	{
		$this->geschwindigkeit += $wert;
	}
}

$fahrzeug = new Fahrzeug();
$fahrzeug->setMarke('Volkswagen');
$fahrzeug->setModell('Golf');
$fahrzeug->setGeschwindigkeit(50);

$fahrzeug->beschleunigen(30);

echo 'Marke: ' . $fahrzeug->getMarke() . PHP_EOL;
echo 'Modell: ' . $fahrzeug->getModell() . PHP_EOL;
echo 'Aktuelle Geschwindigkeit: ' . $fahrzeug->getGeschwindigkeit() . ' km/h' . PHP_EOL;
