---
layout: post
title:  "Networking Game"
date:   2018-04-15 16:54:46
author: Andrés Pereira
categories: 
- Blog
- Game design
- Development
- Low-level programming
img: butwhole.jpg
thumb: c_thumb.jpg
---

<b>The Spec<b/>

As a final assignment, we were given the task to develop a turn based combat game featuring a networking system that allows players to connect to a lobby, and a chat system on top of the turn based mechanic.
We decided to develop a Heroes of Might and Magic type of game, inspired mainly by South Park The Fractured But Whole. This meant our game would have the turn based combat mechaninc, with each player having to form his team in the lobby choosing from a number of characters with different abilities (attacks, heal, etc). After each player is ready, the game starts and there is only one action allowed per turn, with the option of fleeing or surrendering.

<b>Development Process<b/>

After doing a fair amount of planning we delegated tasks to all the members of our team, and my first task was to make a menu system.

  - Menu System: our game would feature a main menu, from where the player has the option to start or exit the game, but also access the       settings menu. In the settings menu the player can change the screen size (fullscreen or windowed), and the option to mute the sound       in the game.
    There's also a pause menu, that the player can access once in game, and from where the options of fleeing and resuming the game are       available.
    
The second task I worked on was the UI for the game.

  - UI: the game features a simple UI that shows the characters health, attacks, server status, and provides information on who's turn is     it.

<b>What Went Wrong<b/>
  
  So far: Our game supports gamepads, but the menu system doesn't work very well with them. When navigating through the menus, its only possible for the players who use a gamepad to select the first and last option on the menu.
