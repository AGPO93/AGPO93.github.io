---
layout: post
title:  "Endless Runner"
date:   2018-03-15 16:54:46
author: Andrés Pereira
categories: 
- Blog
- Game design
- Development
- Low-level programming
img: endless-chrome.jpg
thumb: c_thumb.jpg
---

<b>The Spec<b/>
  
  Our second assignment for the Low Level Programming module was to make an infinite runner game in ASGE. The two most important aspects of the game are the presence of procedural level generation, and a highscores table that is persistent over playthroughs.

<b>Development Process<b/>
  
  My first idea was to make a gravity shifting game, where there's obstacles running from one side to the other on both the top and the bottom of the screen, and the player has to avoid them by "shifting the gravity" and essentially changing from running on the bottom side to the top side and so on.
  The player movement was the first task I decided to tackle, and because the player would only move on the Y-axis it was only a matter of defining his start (bottom) position and end (top) position, making sure the transition was smooth and the sprite didn't teleport.
  Rather than having the player continuously move forwards on the X-axis, it was far easier to have the obstacles do the job, so I set it up so obstacles spawned on the right side of the screen and moved to the left side. Once each obstacle was out of the screen, it would get deleted.
  If the player collides with one of the obstacles the game ends, meaning the playthroughs are rather short.
  The score in the the game was based on the amount of obstacles dodged by the player, so every time an obstacle got deleted, the score would be increased by 1. Once the player hit an obstacle and lost, his score would be stored in a vector and then added to the highscore list (provided said score was higher than any of the top 3 scores on the list).
  
<b>What Went Wrong?<b/>
  
  - Sprite Movement: the sprite movement in the game was based on the frames per second rather than delta time - this generated major       issues when running the game on different PCs, as it was simply unplayable on some PCs whilst it would run perfectly on mine.
  
  - Timing: I massively underestimated the amount of time it would take me to develop this game, and as a result the end product was         nowhere near what I had planned.
  
  - Obstacle Spawning: at first I had one obstacle base class which inherited from the GameObject class, and the idea was to spawn these     obstacles from two different places on the Y-axis, but for some reason all of the obstacles were being spawned in the same place,       for which reason I ended up having two different classes for the top obstacles and bottom obstacles.
  
  - Collisions:
  
  
  collision wasnt accurate
  procedural generation of obstacles was shit
