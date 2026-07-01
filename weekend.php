<?php

$url = "https://api.openf1.org/v1/sessions?year=2026";

$json = file_get_contents($url);

header("Content-Type: application/json");

echo $json;

?>
