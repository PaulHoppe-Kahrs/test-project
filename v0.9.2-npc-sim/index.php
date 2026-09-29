<?php
session_start();

function shortestPath(array $graph, string $from, string $to): array
{
    if ($from === $to) {
        return [$from];
    }

    $queue = [$from];
    $visited = [$from => true];
    $parents = [$from => null];

    while (!empty($queue)) {
        $node = array_shift($queue);

        foreach ($graph[$node] ?? [] as $neighbor) {
            if (isset($visited[$neighbor])) {
                continue;
            }

            $visited[$neighbor] = true;
            $parents[$neighbor] = $node;

            if ($neighbor === $to) {
                $path = [$to];
                $current = $to;

                while ($parents[$current] !== null) {
                    $current = $parents[$current];
                    array_unshift($path, $current);
                }

                return $path;
            }

            $queue[] = $neighbor;
        }
    }

    return [$from];
}

function calculateGoal(array $npc): string
{
    $scores = [
        'food' => 100 - $npc['hunger'],
        'water' => 100 - $npc['thirst'],
        'medical' => 100 - $npc['health'],
    ];

    if ($npc['trust'] > 45 && $npc['has_safehouse_knowledge']) {
        $scores['safehouse'] = $npc['trust'];
    }

    if ($npc['health'] < 35) {
        $scores['medical'] += 40;
    }

    if ($npc['hunger'] < 35) {
        $scores['food'] += 30;
    }

    if ($npc['thirst'] < 35) {
        $scores['water'] += 30;
    }

    $goal = 'food';
    $bestScore = -INF;

    foreach ($scores as $key => $score) {
        if ($score > $bestScore) {
            $bestScore = $score;
            $goal = $key;
        }
    }

    return $goal;
}

function locationForGoal(string $goal): string
{
    $targets = [
        'food' => 'Supermarkt',
        'water' => 'Tankstelle',
        'medical' => 'Apotheke',
        'safehouse' => 'Safehouse',
    ];

    return $targets[$goal] ?? 'Safehouse';
}

function initWorld(): array
{
    return [
        'time' => 8,
        'log' => [
            'Die Welt wird gestartet. Die erste Stunde beginnt.',
            'Lukas und Mara werden in die Simulation eingefügt.'
        ],
        'graph' => [
            'Safehouse' => ['Supermarkt', 'Wohnhaus'],
            'Supermarkt' => ['Safehouse', 'Tankstelle'],
            'Wohnhaus' => ['Safehouse'],
            'Tankstelle' => ['Supermarkt', 'Apotheke'],
            'Apotheke' => ['Tankstelle'],
        ],
        'zombies' => [
            'Safehouse' => 0,
            'Supermarkt' => 3,
            'Wohnhaus' => 1,
            'Tankstelle' => 2,
            'Apotheke' => 1,
        ],
        'npcs' => [
            'Lukas' => [
                'location' => 'Safehouse',
                'goal' => 'food',
                'hunger' => 38,
                'thirst' => 52,
                'health' => 68,
                'trust' => 64,
                'has_safehouse_knowledge' => true,
                'recruitment_pending' => false,
                'joined_group' => false,
            ],
            'Mara' => [
                'location' => 'Wohnhaus',
                'goal' => 'water',
                'hunger' => 44,
                'thirst' => 58,
                'health' => 72,
                'trust' => 29,
                'has_safehouse_knowledge' => false,
                'recruitment_pending' => false,
                'joined_group' => false,
            ],
        ],
    ];
}

function applyInteraction(array &$npc, string $location, array &$log, string $npcName): void
{
    $log[] = "$npcName ist jetzt an $location und versucht, die Situation zu lösen.";

    switch ($location) {
        case 'Supermarkt':
            $npc['hunger'] = max(0, $npc['hunger'] - 26);
            $npc['thirst'] = max(0, $npc['thirst'] - 8);
            $log[] = "$npcName findet eine Konserve und sammelt Nahrung ein.";
            break;

        case 'Tankstelle':
            $npc['thirst'] = max(0, $npc['thirst'] - 28);
            $npc['hunger'] = max(0, $npc['hunger'] - 6);
            $log[] = "$npcName füllt Wasser und sammelt Vorräte.";
            break;

        case 'Apotheke':
            $npc['health'] = min(100, $npc['health'] + 22);
            $npc['trust'] = min(100, $npc['trust'] + 4);
            $log[] = "$npcName bekommt Hilfe und stabilisiert sich.";
            break;

        case 'Safehouse':
            $npc['health'] = min(100, $npc['health'] + 14);
            $npc['trust'] = min(100, $npc['trust'] + 6);

            if ($npc['trust'] > 50 && $npc['has_safehouse_knowledge']) {
                $npc['recruitment_pending'] = true;
                $log[] = "$npcName zeigt Interesse am Safehouse und fragt nach einer sicheren Bleibe.";
            } else {
                $log[] = "$npcName ruht sich im Safehouse aus.";
            }
            break;

        case 'Wohnhaus':
            $npc['hunger'] = max(0, $npc['hunger'] - 10);
            $npc['thirst'] = max(0, $npc['thirst'] - 8);
            $npc['health'] = min(100, $npc['health'] + 6);
            $log[] = "$npcName nutzt das Wohnhaus als kurzzeitige Basis.";
            break;
    }

    if ($npc['health'] < 30) {
        $npc['goal'] = 'medical';
    }
}

function advanceWorld(array &$world): void
{
    $world['time'] += 1;
    $world['log'][] = 'Eine neue Stunde beginnt.';

    foreach ($world['npcs'] as $name => &$npc) {
        $npc['hunger'] = min(100, $npc['hunger'] + 7);
        $npc['thirst'] = min(100, $npc['thirst'] + 9);

        $goal = calculateGoal($npc);
        $npc['goal'] = $goal;
        $target = locationForGoal($goal);

        if ($npc['location'] === $target) {
            applyInteraction($npc, $target, $world['log'], $name);
            continue;
        }

        $path = shortestPath($world['graph'], $npc['location'], $target);

        if (count($path) > 1) {
            $npc['location'] = $path[1];
            $world['log'][] = "$name bewegt sich auf $target zu und erreicht $path[1].";
        } else {
            $world['log'][] = "$name bleibt in $npc[location] und wartet auf ein besseres Ziel.";
        }

        if ($npc['location'] === 'Supermarkt' && $world['zombies']['Supermarkt'] > 0) {
            $npc['health'] = max(0, $npc['health'] - 8);
            $world['log'][] = "$name gerät in ein Zombie-Event am Supermarkt. -8 HP.";
        }

        if ($npc['location'] === 'Tankstelle' && $world['zombies']['Tankstelle'] > 0) {
            $npc['health'] = max(0, $npc['health'] - 6);
            $world['log'][] = "$name wird an der Tankstelle beobachtet. -6 HP.";
        }
    }

    unset($npc);
}

$world = $_SESSION['world'] ?? initWorld();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['advance_tick'])) {
        advanceWorld($world);
    }

    if (isset($_POST['recruit']) && !empty($_POST['recruit'])) {
        $recruitName = $_POST['recruit'];

        if (isset($world['npcs'][$recruitName])) {
            $world['npcs'][$recruitName]['joined_group'] = true;
            $world['npcs'][$recruitName]['recruitment_pending'] = false;
            $world['log'][] = "$recruitName schließt sich der Gruppe an. Der Spieler entscheidet sich für die Aufnahme.";
        }
    }

    $_SESSION['world'] = $world;
}

$hour = $world['time'];
$map = [
    'Safehouse' => ['Supermarkt', 'Wohnhaus'],
    'Supermarkt' => ['Safehouse', 'Tankstelle'],
    'Wohnhaus' => ['Safehouse'],
    'Tankstelle' => ['Supermarkt', 'Apotheke'],
    'Apotheke' => ['Tankstelle'],
];

function statusLabel(int $value): string
{
    if ($value > 75) {
        return 'gut';
    }

    if ($value > 40) {
        return 'mittel';
    }

    return 'kritisch';
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NPC Utility AI v0.9.2</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="page">
        <header class="header">
            <div>
                <p class="eyebrow">World Simulation</p>
                <h1>NPC Utility AI v0.9.2</h1>
            </div>
            <form method="post">
                <button type="submit" name="advance_tick" value="1">+1 Stunde simulieren</button>
            </form>
        </header>

        <section class="world-panel">
            <div class="clock">
                <strong>Stunde:</strong> <?= htmlspecialchars((string)$hour, ENT_QUOTES, 'UTF-8'); ?>:00
            </div>

            <div class="map">
                <?php foreach ($map as $node => $neighbors): ?>
                    <div class="node <?= $node === $world['npcs']['Lukas']['location'] ? 'active' : ''; ?>">
                        <span><?= htmlspecialchars($node, ENT_QUOTES, 'UTF-8'); ?></span>
                        <?php if (!empty($neighbors)): ?>
                            <small><?= htmlspecialchars(implode(', ', $neighbors), ENT_QUOTES, 'UTF-8'); ?></small>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>

        <section class="npcs">
            <?php foreach ($world['npcs'] as $name => $npc): ?>
                <article class="npc-card">
                    <div class="npc-top">
                        <h2><?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?></h2>
                        <?php if ($npc['joined_group']): ?>
                            <span class="badge joined">in Gruppe</span>
                        <?php elseif ($npc['recruitment_pending']): ?>
                            <span class="badge pending">will bleiben</span>
                        <?php endif; ?>
                    </div>

                    <ul>
                        <li><strong>Ort:</strong> <?= htmlspecialchars($npc['location'], ENT_QUOTES, 'UTF-8'); ?></li>
                        <li><strong>Ziel:</strong> <?= htmlspecialchars($npc['goal'], ENT_QUOTES, 'UTF-8'); ?></li>
                        <li><strong>Hunger:</strong> <?= $npc['hunger']; ?> (<?= statusLabel((int)$npc['hunger']); ?>)</li>
                        <li><strong>Durst:</strong> <?= $npc['thirst']; ?> (<?= statusLabel((int)$npc['thirst']); ?>)</li>
                        <li><strong>Gesundheit:</strong> <?= $npc['health']; ?> (<?= statusLabel((int)$npc['health']); ?>)</li>
                        <li><strong>Vertrauen:</strong> <?= $npc['trust']; ?></li>
                    </ul>

                    <?php if ($npc['recruitment_pending'] && !$npc['joined_group']): ?>
                        <form method="post">
                            <button type="submit" name="recruit" value="<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>">NPC aufnehmen</button>
                        </form>
                    <?php endif; ?>
                </article>
            <?php endforeach; ?>
        </section>

        <section class="log-panel">
            <h3>Off-Screen-Aktivitäten</h3>
            <ul>
                <?php foreach (array_slice($world['log'], -10) as $entry): ?>
                    <li><?= htmlspecialchars($entry, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            </ul>
        </section>
    </div>
</body>
</html>
