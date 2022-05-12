# WhatsApp Birthday Bot
A WhatsApp  Bot that will Congratulations on the birthday of those close to you 


## Installation

Node v12+ is required.

1. Inside the folder run the command `npm install`
2. To start the Bot, just type `npm start`

## Make your own birthday list

- You need to make Google Sheet with the details you want.
- You can also make it using [Google Forms](https://docs.google.com/forms).

The columns should be like this: (ofc you can change in code)
| Timestamp(automade) |	Name	| BirthdayType	| BirthdayLoazi |	HebrewDay	| HebrewMonth |	HebrewYear	| Phone	| Email |


## Define the Bot

```js
const groupID = '1234XXXXXXXXX';
const groupID_debug = '1234XXXXXXXXX';
const ssid = 'XXXXXXXXXXXXXX_XXXXXXXXX';
var checkBirthdayHour = 10;
```

## Deploy on server



## Thanks

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - the base of this bot
