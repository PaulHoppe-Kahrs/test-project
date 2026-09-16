<?php
declare(strict_types=1);

date_default_timezone_set('Europe/Berlin');

$now = new DateTimeImmutable();
$currentDateWithDate = date('Y-m-d H:i:s');
$currentDateWithDateTime = $now->format('d.m.Y H:i:s');

$currentTimestamp = time();
$dateTimeTimestamp = $now->getTimestamp();

$newYear = new DateTimeImmutable($now->format('Y') . '-12-31 00:00:00');
if ($newYear <= $now) {
	$newYear = $newYear->modify('+1 year');
}

$secondsUntilNewYear = $newYear->getTimestamp() - $currentTimestamp;
$daysUntilNewYear = (int) ceil($secondsUntilNewYear / 86400);

$dateString = '24.12.2026';
$parsedDate = DateTime::createFromFormat('d.m.Y', $dateString);
$dateErrors = DateTime::getLastErrors();
$hasDateErrors = $dateErrors !== false
	&& ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0);
$isValidDate = $parsedDate !== false
	&& !$hasDateErrors
	&& checkdate(
		(int) $parsedDate->format('m'),
		(int) $parsedDate->format('d'),
		(int) $parsedDate->format('Y')
	);
?>
<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Umgang mit Datum und Zeit in PHP</title>
	<style>
		:root {
			color-scheme: light;
			font-family: Arial, sans-serif;
			line-height: 1.5;
			color: #172033;
			background: #f4f6f8;
		}

		body {
			margin: 0;
			padding: 2rem 1rem;
		}

		main {
			max-width: 760px;
			margin: 0 auto;
		}

		section {
			margin-top: 1rem;
			padding: 1.25rem;
			background: #ffffff;
			border: 1px solid #d9e0e8;
			border-radius: 8px;
		}

		h1,
		h2 {
			margin-top: 0;
		}

		code {
			padding: 0.1rem 0.3rem;
			background: #eef1f5;
			border-radius: 3px;
		}

		.valid {
			color: #16733a;
			font-weight: 700;
		}
	</style>
</head>
<body>
<main>
	<h1>Umgang mit Datum und Zeit in PHP</h1>

	<section>
		<h2>1. Aktuelles Datum und Zeit</h2>
		<p><strong>Mit date():</strong> <?= htmlspecialchars($currentDateWithDate, ENT_QUOTES, 'UTF-8') ?></p>
		<p><strong>Mit DateTime:</strong> <?= htmlspecialchars($currentDateWithDateTime, ENT_QUOTES, 'UTF-8') ?></p>
	</section>

	<section>
		<h2>2. Zeitstempel und Tage bis Silvester</h2>
		<p><strong>Aktueller Timestamp mit time():</strong> <?= $currentTimestamp ?></p>
		<p><strong>Timestamp mit DateTime::getTimestamp():</strong> <?= $dateTimeTimestamp ?></p>
		<p><strong>Zieldatum:</strong> <?= $newYear->format('d.m.Y') ?></p>
		<p><strong>Tage bis zum Zieldatum:</strong> <?= $daysUntilNewYear ?></p>
	</section>

	<section>
		<h2>3. String in ein Datum umwandeln</h2>
		<p><strong>Datums-String:</strong> <?= htmlspecialchars($dateString, ENT_QUOTES, 'UTF-8') ?></p>
		<?php if ($isValidDate && $parsedDate !== false): ?>
			<p class="valid">Das Datum ist gültig.</p>
			<p><strong>Formatiertes Datum:</strong> <?= $parsedDate->format('Y-m-d') ?></p>
		<?php else: ?>
			<p>Das Datum ist ungültig.</p>
		<?php endif; ?>
	</section>
</main>
</body>
</html>
