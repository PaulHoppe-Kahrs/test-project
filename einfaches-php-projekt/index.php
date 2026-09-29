<?php
session_start();

$notes = $_SESSION['notes'] ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['new_note']) && trim($_POST['new_note']) !== '') {
        $notes[] = trim($_POST['new_note']);
        $_SESSION['notes'] = $notes;
    }

    if (isset($_POST['clear'])) {
        $_SESSION['notes'] = [];
        $notes = [];
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Einfaches PHP Projekt</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="container">
        <h1>Meine To-Do-Liste</h1>

        <form method="post" class="todo-form">
            <input type="text" name="new_note" placeholder="Neue Aufgabe eingeben..." maxlength="120">
            <button type="submit">Hinzufügen</button>
        </form>

        <form method="post" class="clear-form">
            <button type="submit" name="clear" value="1" class="clear-btn">Liste leeren</button>
        </form>

        <ul class="notes">
            <?php if (empty($notes)): ?>
                <li class="empty">Noch keine Aufgaben vorhanden.</li>
            <?php else: ?>
                <?php foreach ($notes as $note): ?>
                    <li><?= htmlspecialchars($note, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            <?php endif; ?>
        </ul>
    </main>
</body>
</html>
