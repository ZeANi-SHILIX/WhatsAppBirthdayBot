[![npm](https://img.shields.io/npm/v/whatsapp-web.js.svg)](https://www.npmjs.com/package/whatsapp-web.js)

# WhatsApp Birthday Bot
A WhatsApp Bot that will Congratulations on the birthday of those close to you 


## Installation

Node v12+ is required.

0. Clone this project or download it and unzip it.
1. Inside the folder run the command `npm install`
2. To start the Bot, just type `npm start`

## Make your own birthday list

- You need to make Google Sheet with all the necessary details.
- You can also make it using [Google Forms](https://docs.google.com/forms).

The columns should be like this: (ofc you can change the order in  the code)

| Timestamp |	Name	| BirthdayType	| BirthdayLoazi |	HebrewDay	| HebrewMonth |	HebrewYear	| Phone	| Email | Sex
| ------------- | ------------- |------------- |------------- |------------- |------------- |------------- |------------- |------------- |------------- |
| (Automade) |	{Name}	| {genery}	| {01/01/1970} |	{א}	| {תשרי} |	{התשפב}	| {972501234567}	| {hello@world.com} | {זכר/נקבה} |

**NOTE:** Make sure the Google Sheet can viewed with the link.

## Define the Bot

If you want the bot will start a BirthdayProcesse when it initialize, you need to add this lines to code (with your own details):
```js
/* start process when the bot start */
birthdayProcesses['ssid'] = {           // ssid of the google sheet
    "name": "{name}",                   // name for processe
    "GroupType": "{type}",              // type of the blessing 
    "group": "{XXXXXXX@g.us}",          // where the blessing will send
    "userDebug": "{XXXXXXXXXX@c.us}",   // where all the info about the processe will send (can be contact/group)
    'checkBirthdayHour': "{10}"         // when the bot will check the birthday
} 
```
(the code of the bot can be found inside WaBot.js)


## Commands
- `!ping` - check if the bot is alive.
- `!get-time` - 
- `!birthday-stop` - 
- `!birthday-stop-all` - 
- `!birthday-list` - 
- `!birthday-start` - 
- `!birthday-start-json` - 
- `!setUTC` - 
- `!birthday-sethour` - 
- `!birthday-help` - 
- `!info` - 
- `!get-admins` - 
- `!set-admins` - 
- `!unset-admins` - 

## Deploy on server

for running the bot 24/7, it recommended to deploy it on server.
you can use AWS, Heroku, Orcale Esc.
(or bought Reseberry PI)


## Thanks

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - the base of this bot
