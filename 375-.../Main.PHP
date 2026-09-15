<?php

function greets($num1, $num2) {
    $res = $num1 + $num2;
    return $res;
}

$value = greets(5, 4);
$value2 = greets(2, 3);

$res = greets($value, $value2);

echo $res;

?>