<?php
// Die Konfiguration wird mit require eingebunden.
require __DIR__ . '/config.php';

// Funktionen werden mit require_once nur einmal eingebunden.
require_once __DIR__ . '/functions.php';

// Diese Dateien werden ebenfalls demonstrativ eingebunden.
include __DIR__ . '/data.php';
include_once __DIR__ . '/config.php';

// data.php gibt einen Wert zurück, der hier in einer Variable gespeichert wird.
$welcomeMessage = include __DIR__ . '/data.php';

// Eine Variable wird zugewiesen und eine Funktion aufgerufen.
$pageTitle = 'Modulares PHP-Skript';
$formattedMessage = formatMessage($welcomeMessage);
?>
<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
</head>
<body>
	<h1><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></h1>
	<p><?= htmlspecialchars($formattedMessage, ENT_QUOTES, 'UTF-8') ?></p>
	<p>Webseite: <?= htmlspecialchars(SITE_NAME, ENT_QUOTES, 'UTF-8') ?></p>
</body>
</html>
