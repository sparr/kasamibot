# KasamiFork - Autonomous Screeps bot

This is a fork of the KasamiBot codebase (https://github.com/kasami/kasamibot/), made with the blessing of Kasami, and with the name changed at Kasami's request to avoid confusion.

KasamiBot is published as an autonomous bot written exclusively by Kasami. KasamiFork is meant to be a collaborative codebase, treating Kasami's published changes as an upstream source and accepting pull requests and Issues from other contributors.

Below you will find the README for KasamiBot, some of which is not applicable to this codebase. Updating the README and other documentation is on the agenda for this fork.

--

**Current Release: Cake and grief counseling - version 1.0**

Read more about KasamiBot on the Github pages:

[Documentation](https://kasami.github.io/kasamibot/) and [features](https://kasami.github.io/kasamibot/features.html). The source code is available on [github](https://github.com/kasami/kasamibot/).

---

## Install the bot:

* [Steam Workshop](http://steamcommunity.com/sharedfiles/filedetails/?id=1139264355)
* [npm i screeps-bot-kasamibot](https://www.npmjs.com/package/screeps-bot-kasamibot)
* [Download zip and use the files in dist-folder](https://github.com/kasami/kasamibot/archive/master.zip)

---

## What is Screeps?
Screeps is an open source MMO RTS game for programmers, where your mission is to code an AI. There is an official server hosted by the developers, and there are multiple open private servers. You can also run a server locally. To learn more, [visit screeps.com](https://screeps.com/) or [the steam page](http://store.steampowered.com/app/464350/Screeps/).

## What is KasamiBot?
KasamiBot is a code base used by me (Kasami) on the public server, but customized for automation to be used as an opponent on private servers. It has a lot of features, and will be quite hard to compete with for new players, so you can customize the difficulty in the config.js-file. It allows you to set the bot as passive, meaning it will not attack your rooms; and slow, meaning it will use less of the advanced features included in the bot.

The bot is distributed as an minified version of the Typescript codebase I'm working on. This is not a community-driven codebase, but my personal screeps codebase.

I have also decided to include the full source code, available under the directory source on github. It is compiled from the original typescript, but is not uglified and should provide enough detail to understand what is going on and tweak it if you want to do that. I've also added a section in the documentation about how you can take manual control of the bot and use it as I do.

## Can I use it on the public server?
Screeps is a game about programming your own AI. While I can't stop you from using this code on the public server, I highly recommend developing your own AI instead. I have decided to release the source for the bot, so you can further develop it, tune it and use it as you want. If you have any questions about the bot or about the features, please post an issue on github, and I can either answer there or further develop the documentation.

Remember, there is no right way to program your screeps AI, so I recommend trying to come up with your own solutions. Over time you will find a lot of joy in figuring our clever things to implement.

---

> The next big release will focus on combat, and better replace the current HarassManager with a smarter DestructionManager. The goal is that it should be able to remove all hostile rooms around it.

## Plans for release 1.1 - Some just like to watch the world burn
* DestructionManager for intelligent attacks on hostile rooms
* Improved AI for defending units when under siege
* Better AI for Bank-teams, being able to defend themselves
* Better defense when under siege, and response from the room itself and neighbouring rooms
* Operation for guarding rooms owned by an enemy, but without spawns. This to prevent rebuilding.
* Towers should be smarter, and avoid being drained
* New team for harassing enemy rooms, that targets all neighbouring rooms and try to kill civilian units
* Nuke-defense
* Offensive use of nukes
* Long-term siege at enemy rooms, with longbows, drainers and wreckerteams

## Roadmap
* Use Observers for scouting when reacing RCL 8
* Faster and consistent boosting of units
* Better response for invaders in portal room
* More efficient wallbuilding, by splitting it up to repairers and haulers
* Pillage enemy rooms by stealing valuable resources
* Better operation for guarding wanted outposts
* Tracking CPU usage for better deciding on how capable we are of expanding
* New room-type, fortress, that is used to limit CPU-usage
* Better DistributionManager for lowering transfer-costs of energy
* Better TradeManager for finding good deals on the market