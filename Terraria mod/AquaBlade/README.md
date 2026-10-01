# AquaBlade

Ein tModLoader-Modprojekt mit .NET-8-Ziel. Es fügt Prismedge hinzu: ein türkisfarbenes Pixel-Art-Schwert mit 2.000 Nahkampfschaden und einer Rezeptur aus einem Dirt Block.

## Installation und Build

1. Installiere tModLoader 1.4.4 oder neuer und das .NET-8-SDK.
2. Kopiere den Ordner `AquaBlade` in den tModLoader-Ordner `ModSources` (meist unter `Documents/My Games/Terraria/tModLoader/ModSources`).
3. Öffne `AquaBlade.csproj` in einer IDE oder führe dort `dotnet build` aus.
4. Alternativ kannst du in tModLoader **Workshop → Develop Mods → Build + Reload** verwenden.

Die Projektdatei importiert `tModLoader.targets` aus dem übergeordneten `ModSources`-Ordner, wie es tModLoader für die Mod-Entwicklung erwartet.
