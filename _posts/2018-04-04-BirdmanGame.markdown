---
layout: post
title:  "Birdware"
date:   2018-01-25 16:54:46
author: Andrés Pereira
categories: 
- Blog
- Game design
- Development
- Low-level programming
img: birdman-poster.jpg
thumb: c_thumb.jpg
---

<b>Birdman The Game<b/>

  Having been set the task of developing a game inspired by the movie Birdman, my teammates and I decided to Warioware type of game,        featuring several minigames and a "hub" that would work as a minigame on its own, in order to keep the player on his toes at all times.

<b>Presentation feedback<b/>

  After pitching our idea, we were given the green light to start the development process of the game, however, we were told to find a way  to give more meaning to the hub area, since in the game we pitched it only served as a lobby to access the game and lacked importance.

<b>Development process<b/>
  
  My main tasks for this project were the scene manager, the menu, the "hub", the gameover screen, and putting together all of the scenes.
  
  - Scene Manager: I implemented a very similar scene manager to the one I used in my previous game (infinite runner), but this time using     unique pointers.
  - Menu: It featured a simple menu from where the player could either choose to play the game or exit.
  - Hub: Once the player hit Play from the main menu, the hub scene would be rendered and from here, players could move around in the           theatre area and choose which minigame to play. The score and the main timer for the game were displayed in this scene.
  - Gameover screen: This is the screen the player would see once the main timer came to an end and the game finished. It featured a list       of the highscores and it would also give the player the option to replay the game or exit.
  - Putting together the game: This consisted of linking the main menu to the hub scene, and then the hub scene to all of the minigames, and the gameover scene, in a way that the player always had the option to go from the minigames back to the hub whenever, from the hub to the main menu, and from the gameover screen to replay the game.
  

<b>Possible improvements<b/>
  
 - One of the biggest points where the game could have improved on was the number of minigames it featured. For our initial game idea to work out, we needed a significant amount of minigames the player had to finish in order for the play in the theatre to be a success. Unfortunately we were only able to develop two minigames, and as a result, the game play turned repetitive rapidly.
 - The lobby scene was initially meant to work as a hub where the minigames were accessed by the player in a specific order and at the right time, working in its own as a on going minigame throughout the game, by granting the player with bonus points when the right minigame was played and the right time. In the end product the lobby only featured the minigames (that could be accessed at any time and in any order with no difference on the score), a timer, and the score count. For this reason the lobby scene had a "boring" feel to it and it did not play an important role.
  

