const groupID = '120363041776751646'; // '972526515354-1631541593'
const groupID_debug = '120363041776751646';
const ssid = '1baIl7jbt6seVYrSyJYkVTiL_u8EOOxqDWcCQmAuUpO4';

var birthdayList = [];
var checkBirthdayHour = 10;
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
        `מזל טוב ${personName} להגיעך ל${personAge}\nמחלקה 1 במיל' מצדיעה לך על שירותך המסור, אוהבים אותך ומעריכים מאוד`,
    ]
    var randomInt = Math.floor(Math.random() * sentencelist.length);
    //console.log(sentencelist[randomInt]);
    return sentencelist[randomInt];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function convertToNumber(str) {
    if (str == "" || str == null) return 0
    if (str.length == 1) {
        return asciiConvertor(str)
    }
    sum = 0
    for (var i = 0; i < str.length; i++) {
        sum += asciiConvertor(str[i])
    }
    return sum;
}
function asciiConvertor(char) {

    if (char.length != 1) return 0
    ascii = char.codePointAt(0);
    if (ascii > 1487 && ascii < 1498) return ascii - 1487
    if (ascii > 1498 && ascii < 1501) return (ascii - 1497) * 10
    if (ascii == 1502) return (ascii - 1498) * 10
    if (ascii > 1503 && ascii < 1507) return (ascii - 1499) * 10
    if (ascii == 1508) return (ascii - 1500) * 10
    if (ascii == 1510) return (ascii - 1501) * 10
    if (ascii > 1510 && ascii < 1515) return (ascii - 1510) * 100
    //console.log("asciiConvertor active" + ascii)
    return 0
}

function comperDate(dateNow, birthdayLoazi, dateHeb, birthdayHeb, datePrefer) {
    if (datePrefer == 'עברי') {
        // && todayHour == checkBirthdayHourHebrew
        if (dateHeb.month == birthdayHeb.month && dateHeb.day == birthdayHeb.day) {
            return dateHeb.year - birthdayHeb.year;
        }
    }
    if (datePrefer == 'לועזי') {
        // && todayHour == checkBirthdayHourLoazi
        if (dateNow.getMonth() == birthdayLoazi.getMonth() && dateNow.getDate() == birthdayLoazi.getDate()) {
            return dateNow.getFullYear() - birthdayLoazi.getFullYear();
        }
    }
    return 0;
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

            dateNow = getIsraelTime()
            dateHeb = new Hebcal.HDate(dateNow);

            //for testing
            //dateHeb = new Hebcal.HDate(8 ,"Iyyar" ,5790)
            //dateNow = new Date("2020-08-06")

            console.log(`${dateNow}, HebTime: ${dateHeb}\n-----`)

            // loop on all the rows (for each person)
            rows.forEach(element => {
                /*
                c - cell
                v - value
                f - format
                */
                PersonName = element.c[1].v;
                datePrefer = element.c[2].v;
                birthdayLoazi = element.c[3].f;
                try {
                    day_he = element.c[4].v.trim();
                    month_he = element.c[5].v;
                    year_he = element.c[6].v.trim();
                } catch (error) {
                    if (datePrefer == "עברי") { client.sendMessage(`${groupID_debug}@g.us`, `ל${personName} יש בעיה בתאריך העברי (חוגג יומולדת עברי)`);}
                    day_he = ""
                    month_he = ""
                    year_he = ""
                }
                try {
                    phoneNum = element.c[7].v;
                } catch (error) {
                    //console.log("no phone number")
                    phoneNum = ""
                }
                try {
                    emailAdress = element.c[8].v;
                } catch (error) {
                    //console.log("no email")
                    emailAdress = ""
                }


                console.log(PersonName + "\n" +
                    datePrefer + "\n" +
                    birthdayLoazi
                    // + "\n" + day_he + " " + month_he + " " + year_he 
                    // + "\n" +phoneNum + "\n" + emailAdress
                )

                if (year_he[0] == 'ה') { year_he = year_he.slice(1) }
                year_he_num = 5000 + convertToNumber(year_he)

                day_he_num = convertToNumber(day_he)
                birthdayHeb = new Hebcal.HDate(day_he_num, month_he, year_he_num);

                var birthday_array = birthdayLoazi.split("/");
                birthdayLoazi = new Date(birthday_array[2], birthday_array[1] - 1, birthday_array[0]); //month start from 0 

                age = comperDate(dateNow, birthdayLoazi, dateHeb, birthdayHeb, datePrefer)

                console.log(`${dateHeb}\n${birthdayHeb}\nage: ${age}\n--------`)

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
        if (todayHour == checkBirthdayHour) {
            console.log(`--------\nTime: ${todayHour}, --> Start to check birthdays...`)
            client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, --> זמן לבדוק ימי הולדת...`);
            birthday_massege()
        } else {
            console.log(`--------\nTime: ${todayHour}`)
            client.sendMessage(`${groupID_debug}@g.us`, `השעה: ${todayHour}, אני חי! :)`);
        }

        if (!checkBirthday_Active) {
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
        msg.reply('פונג');

    } else if (msg.body === '!פינג') {
        client.sendMessage(msg.from, 'פונג');

    } else if (msg.body === '!פינג אחי') {
        msg.reply('פונג אחי');

    } else if (msg.body === '!פונג אחי') {
        msg.reply('פינג אחי');
    }

    // enable / disable birthday process  
    else if (msg.body === '!birthday-off') {
        if (checkBirthday_Active) {
            checkBirthday_Active = false
            msg.reply('Birthday is off');
        } else {
            msg.reply('Birthday already disabled');
        }
    } else if (msg.body === '!birthday-on') {
        if (checkBirthday_Active) {
            msg.reply('Birthday already enabled');
        } else {
            checkBirthday_Active = true
            check_birthday();
            msg.reply('Birthday is on');
        }
    }
});
