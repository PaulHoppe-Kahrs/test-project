<?php

function displayWelcome(): void {
    echo "Willkommen zum PHP-Funktionen-Tutorial!<br>\n";
}

function sumNumbers(int $a, int $b = 10): void {
    $summe = $a + $b;
    echo "Summe von $a und $b ist: $summe<br>\n";
}

function listIngredients(string ...$ingredients): void {
    echo "Zutatenliste:<br>\n";
    foreach ($ingredients as $ingredient) {
        echo "- " . htmlspecialchars($ingredient) . "<br>\n";
    }
}

$globalVar = "Ich bin eine globale Variable";

function demonstrateScope(): void {
    global $globalVar;
    $localVar = "Ich bin eine lokale Variable";
    
    echo "Innerhalb der Funktion: $globalVar<br>\n";
    echo "Innerhalb der Funktion: $localVar<br>\n";
}

function counter(): void {
    static $count = 0;
    $count++;
    echo "Funktion wurde $count-mal aufgerufen.<br>\n";
}

displayWelcome();

sumNumbers(5);
sumNumbers(5, 20);

listIngredients("Mehl", "Zucker", "Eier", "Milch"); 

sumNumbers(b: 50, a: 10); 

demonstrateScope();

counter();
counter();
counter();

?>