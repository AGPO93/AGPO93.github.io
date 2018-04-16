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

<b>The spec<b/>
  
  Our second assignment for the Low Level Programming module was to make an infinite runner game in ASGE. The two most important aspects of the game are the presence of procedural level generation, and a highscores table that is persistent over playthroughs.

<b>dev process<b/>
  
  My first idea was to make a gravity shifting game, where there's obstacles running from one side to the other on both the top and the bottom of the screen, and the player has to avoid them by "shifting the gravity" and essentially changing from running on the bottom side to the top side and so on.
  The player movement was the first task I decided to tackle, and because the player would only move on the Y-axis it was only a matter of defining his start (bottom) position and end (top) position, making sure the transition was smooth and the sprite didn't teleport.
  Rather than having the player continuously move forwards on the X-axis, it was far easier to have the obstacles do the job, so I set it up so obstacles spawned on the right side of the screen and moved to the left side. Once each obstacle was out of the screen, it would get deleted.
  

<b>what went wrong<b/>
  
  delta time
  underestimated time
  obstacles spawning on bottom fine but not on top
  collision wasnt accurate
  procedural generation of obstacles was shit
