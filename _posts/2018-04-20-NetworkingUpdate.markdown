---
layout: post
title:  "Networking Game Update"
date:   2018-04-20 16:54:46
author: Andrés Pereira
categories: 
- Blog
- Game design
- Development
- Low-level programming
img: capture.png
thumb: c_thumb.jpg
---

<b>Audio Engine<b/>

After the audio engine was implemented, and the audio assets added to the project, I set it up so the audio files are played at the right times. The background music starts playing when the game is executed and there is a sound effect that plays every time the menu is navigated or an option is selected. 
In-game sound effects are still needed.


<b>Character Selection<b/>

Before the match begins, the player has to form his team in the character selection screen, and the characters he chooses must be sent to the in game scene so the right characters are rendered and the correct information appears on screen. I used a static function and static variables to send the character selection from that scene to the in game scene.


<b>Art Assets<b/>

There is no art in the game yet, and there's only one character sprite. Backgrounds, multiple character sprites, and UI sprites are needed.
