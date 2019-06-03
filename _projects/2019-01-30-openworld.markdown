---
layout: project
title: "Open World Streaming System"
date: 2019-01-30 16:54:46
tools: Unity, C#, XML
img: openworldfeatured.png
thumb: quake_thumb.jpg
carousel:
- openworld/openworld1.jpg
- openworld/openworld2.jpg
abstract: Asset streaming in run-time
---
#### Asset streaming in run-time
<br>

This is an open world asset streaming system that dynamically loads and unloads static assets and Artificial Intelligence (AI) agents.

This system loads assets in run-time based on the player's current position. All the asset data like position, rotation and scale is kept on XML files, that are then read in run-time in order to instantiate each prefab.

As shown below, only the surrounding areas to the players get loaded and when the player moves around, the far away areas get deleted.

I created this low poly world to demonstrate this system; it currently holds static assets such as trees and rocks, but it also spawns NPCs that patrol areas, follow, and attack the player.

Have a look at the source code [here](https://github.com/AGPO93/OpenWorld).

<br>[![Open World System Demo](https://i.gyazo.com/ea19ae122aaeed3cb68843e99cc508d7.gif)](https://gyazo.com/ea19ae122aaeed3cb68843e99cc508d7)

<br>
<br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/c3Wc_TwDiF8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
