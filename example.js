var groupID = '120363041776751646'; // '972526515354-1631541593'
var groupID_debug = '120363041776751646';
const ssid = '16PT0Ifn_ukhlUxIMm8WsWobgXWysvH8eynRzbEeiKts';

var birthdayList = [];
var checkBirthdayHourHebrew = 21, checkBirthdayHourLoazi = 17;
var checkBirthday_Active = true;

const { Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require("node-fetch-commonjs");
const Hebcal = require('hebcal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // true - without browser
        args: ["--no-sandbox"]
    },

});
function getIsraelTime() {
    var d = new Date();
    return new Date(new Date(d).setHours(d.getUTCHours() + 3));
    /*
    let options = {
        timeZone: 'Asia/Jerusalem',
        // timeZone: 'Europe/London',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    },
        formatter = new Intl.DateTimeFormat([], options);
    return new Date(formatter.format(new Date()));
    */
}

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

function randomSentence(personName, personAge) {
    var sentencelist = [
        `מזל טוב ${personName} לרגל הולדתו ה${personAge}!!\nעד 120 שנה`,
        `מי הכי יפה בעיר? ${personName} הכי יפה בעיר!!\nמזל טוב ליום הולדתך ה${personAge}!!\nעד 120 שנה`,
        `הופהההה!!! ${personName} חוגג יומולדת  ${personAge} היום!!\nמזל טובבבב!!`,
        `למי יש יומולדת? למי יש יומולדת?\nל${personName} יש יומולדת!!\nמזל טוב להגיעך ל ${personAge}! עד 120 שנה :)`,
        `מזל טוב${personName} להגיעך ל${personAge}\nמחלקה 1 במיל' מצדיעה לך על שירותך המסור, אוהבים אותך ומעריכים מאוד`,
    ]
    var randomInt = Math.floor(Math.random() * sentencelist.length);
    //console.log(sentencelist[randomInt]);
    return sentencelist[randomInt];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function birthday_massege() {
    const url = 'https://docs.google.com/spreadsheets/d/';
    // the ssid declare up
    const q1 = '/gviz/tq?';
    const q2 = 'tqx=out:json';
    let url1 = `${url}${ssid}${q1}&${q2}`;   

    fetch(url1)
        .then(res => res.text())
        .then(data => {
            var json = JSON.parse(data.substr(47).slice(0, -2));
            rows = json.table.rows;

            function comperDate(dateNow, birthday, dateHeb, birthdayHeb, datePrefer) {
                // jewish checked at night
                // loazi is the morning
                var todayHour = getIsraelTime().getHours();

                if (datePrefer == 'עברי' && todayHour == checkBirthdayHourHebrew) {
                    if (dateHeb.month == birthdayHeb.month && dateHeb.day == birthdayHeb.day) {
                        return dateHeb.year - birthdayHeb.year;
                    }
                }
                if (datePrefer == 'לועזי' && todayHour == checkBirthdayHourLoazi) {
                    if (dateNow.getMonth() == birthday.getMonth() && dateNow.getDate() == birthday.getDate()) {
                        return dateNow.getFullYear() - birthday.getFullYear();
                    }
                }
                return 0;
            }

            //for testing: "Feb 04, 2017 22:24:00"
            dateNow = getIsraelTime()
            dateHeb = new Hebcal.HDate(dateNow);
            //console.log(dateNow)
            //console.log(`${dateNow}, heb: ${dateHeb}`)


            /*
            * __jump the day after sunset__
            *
            * problem: the user date not contain time,
            * so the compersion will not be correct.
            * 
            * better solution is to check in 9AM (Loazi, after midnight), and in 9PM (Jewish, after sunset)
 
            dateHeb.setCity('Jerusalem');
            console.log(dateHeb.sunset());
            var isHebDayStart = false;
            if (dateHeb.sunset()<dateNow){
                isHebDayStart = true;
                tempDate = new Date(dateNow);
                tempDate.setDate(dateNow.getDate()+1)
                dateHeb = new Hebcal.HDate(tempDate)
                console.log(`${dateHeb}`)
            }
            */

            // loop on all the rows (for each person)
            rows.forEach(element => {
                /*
                c - cell
                v - value
                f - format
                */
                PersonName = element.c[1].v;
                birthday = element.c[2].f;
                datePrefer = element.c[3].v;

                var birthday_array = birthday.split("/");
                birthday = new Date(birthday_array[2], birthday_array[1] - 1, birthday_array[0]); //month start from 0 
                birthdayHeb = new Hebcal.HDate(birthday);

                age = comperDate(dateNow, birthday, dateHeb, birthdayHeb, datePrefer)
                //console.log(age+"," + dateNow+ birthday+"\n"+ dateHeb+ birthdayHeb)

                if (age > 0) {
                    birthdayList.push({ "name": PersonName, "age": age })
                }
            });
        })
        .then(data => {
            console.log("birthdayList contain " + birthdayList.length + " objects")
            if (birthdayList.length == 0) {

            } else {
                birthdayList.forEach(person => {
                    client.sendMessage(`${groupID}@g.us`, randomSentence(person.name, person.age));
                })
            }
        })
}

async function check_birthday() {

    while (true) {
        var todayHour = getIsraelTime().getHours();
    /*
        if (todayHour == checkBirthdayHourHebrew) {
            console.log(`--------\nTime: ${todayHour}, --> Start to check Jewish birthdays...`)
            client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, --> זמן לבדוק ימי הולדת עבריים...`);
            birthday_massege()
        } else if (todayHour == checkBirthdayHourLoazi) {
            console.log(`--------\nTime: ${todayHour}, --> Start to check Loazi birthdays...`)
            client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, --> זמן לבדוק ימי הולדת לועזיים...`);
            birthday_massege()
        } else {
            console.log(`--------\nTime: ${todayHour}`)
            client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, אני חי! :)`);
        }
*/
        console.log(`--------\nTime: ${todayHour}`)
        client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, הבוט של אורקל חי! :)`);
        
        if (!checkBirthday_Active){
            break;
        }

        /*
        1000*60 is a minute 
        1000*60*60 is a hour
        1000*60*60*24 is a day           
        */
        await sleep(1000 * 60 * 60);
    }
}

client.on('ready', () => {
    console.log('READY');
    client.sendMessage(`${groupID_debug}@g.us`, 'הבוט מחובר לחשבון');

    check_birthday()

});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');

    } else if (msg.body === '!פינג השב') {
        // Send a new message as a reply to the current one
        msg.reply('פונג');

    } else if (msg.body === '!פינג') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'פונג');

    } else if (msg.body === '!פינג אחי') {
        // Send a new message to the same chat
        msg.reply('פונג אחי');

    } else if (msg.body === '!פונג אחי') {
        // Send a new message to the same chat
        msg.reply('פינג אחי');

    }
    // enable / disable birthday process  
    else if (msg.body === '!birthday-off') {
        if (checkBirthday_Active){
            checkBirthday_Active = false
            msg.reply('Birthday is off');
        } else {
            msg.reply('Birthday already disabled');
        }
    } else if (msg.body === '!birthday-on') {
        if (checkBirthday_Active){
            msg.reply('Birthday already enabled');
        } else {
            checkBirthday_Active = true
            check_birthday();
            msg.reply('Birthday is on');
        }
        

    }
});
