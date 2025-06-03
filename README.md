# Tak

After having rolled my own chess bot in the past, after getting to know the Tak board game
I felt the urge to code it too. WIP

ℹ️ (this game isn't using typescript tooling, just making use of node.js's ability to ignore type annotations. it's just helping drive my UX)

The core logic should be runtime agnostic (ie `tak.ts` shouldn't depend on node.js or browser-exclusive APIs)
This allows me to eventually create dedicated clients/bots/whatever.

## usage

```
nvm use

# to play human vs human:
node play.ts

# to play against bot:
node play-vs-bot.ts

# to replay a game (WIP!)
node replay.ts games/g2.ptn
```

## TODO

- add autocomplete interface
- fix PTN loader
- basic strategy bot
- find roads should list all roads and their positions
- PTS read/write

## rules: 
- https://cdn.shopify.com/s/files/1/0493/0297/files/UniversityRulesSM.pdf?182053186103430866
- https://static1.squarespace.com/static/5e1ce8815cb76d3000d347f2/t/6482447fb0ca284557e6fc04/1686258824488/TakCompanionBookPDF.pdf

## playing/analysis interface
- https://ptn.ninja/

## playing site
- https://playtak.com/

## portable tak notation (PTN)
- https://ustak.org/portable-tak-notation/

## PTS ~ FEN
- https://ustak.org/tak-positional-system-tps/

## TAK BOTS
- wrapper https://github.com/chaitu236/ShlktBot-wrapper/blob/master/wrapper.py
- takbot (perl) https://github.com/scottven/TakBot
- tak ai (lua) https://github.com/jachiam/tak-ai
- taktitian (go) https://github.com/nelhage/taktician

