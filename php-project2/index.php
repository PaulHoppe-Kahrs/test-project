<?php
// Einfache Variablen für die folgenden Ausgabebeispiele.
$name = 'Paul';
$age = 25;
$skills = ['HTML', 'CSS', 'PHP'];

// Heredoc ersetzt Variablen automatisch.
$heredocText = <<<TEXT
Hallo $name!
Du lernst gerade PHP und bist $age Jahre alt.
TEXT;

// Nowdoc behandelt den Inhalt als unveränderten Text.
$nowdocText = <<<'TEXT'
Das ist ein Nowdoc-Text.
Die Variable $name wird hier nicht ersetzt.
TEXT;
?>
<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>PHP-Ausgabemethoden</title>
</head>
<body>
	<h1>PHP-Sprachkonstrukte und Ausgabemethoden</h1>

	<h2>echo und print</h2>
	<?php
	// echo und print geben einfache Zeichenketten aus.
	echo '<p>Diese Nachricht wurde mit echo ausgegeben.</p>';
	print '<p>Diese Nachricht wurde mit print ausgegeben.</p>';
	?>

	<h2>heredoc und nowdoc</h2>
	<pre><?= htmlspecialchars($heredocText, ENT_QUOTES, 'UTF-8') ?></pre>
	<pre><?= htmlspecialchars($nowdocText, ENT_QUOTES, 'UTF-8') ?></pre>

	<h2>printf</h2>
	<?php
	// printf setzt Werte in eine formatierte Zeichenkette ein.
	printf('<p>%s ist %d Jahre alt.</p>', $name, $age);
	?>

	<h2>print_r</h2>
	<pre><?php print_r($skills); ?></pre>

	<h2>var_dump</h2>
	<pre><?php var_dump($skills); ?></pre>

	<h2>var_export</h2>
	<pre><?php var_export($skills); ?></pre>
</body>
</html>
