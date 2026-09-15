<?php

declare(strict_types=1);

echo "1. for-Schleife\n";
for ($number = 1; $number <= 10; $number++) {
	if ($number === 5) {
		continue;
	}

	echo $number . "\n";
}

echo "\n2. while-Schleife\n";
$x = 100.0;
while ($x >= 1) {
	echo $x . "\n";
	$x /= 2;
}

echo "\n3. do-while-Schleife\n";
$counter = 10;
do {
	echo $counter . "\n";
	$counter--;
} while ($counter >= 0);

echo "\n4. break und continue\n";
for ($number = 1; $number <= 20; $number++) {
	if ($number % 2 !== 0) {
		continue;
	}

	if ($number > 15) {
		break;
	}

	echo $number . "\n";
}
