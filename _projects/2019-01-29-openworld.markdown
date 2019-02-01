---
layout: project
title:  "Open World Streaming System"
date:   2019-01-28 16:54:46
tools: Unity, XML
img: openworld1.jpg
thumb: quake_thumb.jpg
carousel:
- openworld/openworld1.jpg
- openworld/openworld2.jpg
abstract: Loads and unloads assets in run-time based on the player's position
---
#### Open World Streaming System
<br>
This system loads assets in run-time based on the player's current position. All the asset data like position, rotation and scale is kept on XML files, that are then read in run-time in order to instantiate each prefab.

As shown below, only the surrounding areas to the players get loaded and when the player moves around, the far away areas get deleted.

I created this low poly world to demonstrate this system; it currently holds static assets such as trees and rocks, but it also spawns NPCs that patrol areas, follow, and attack the player.
