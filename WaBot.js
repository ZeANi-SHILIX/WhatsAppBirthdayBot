/* TODO:
- testing 
- clean up the code

*/

const groupID_debug = '120363041776751646'; // only for testing, should be removed
const BOT_ADMINS = ['972507923132@c.us', '972504083675@c.us']; // TODO: commant for adding more

var birthdayProcesses = {};
var birthdayList = {};
var ADD_HOUR_TO_UTC = 3;

birthdayProcesses['1baIl7jbt6seVYrSyJYkVTiL_u8EOOxqDWcCQmAuUpO4'] = {
    "name": "idf_mil",
    "GroupType": "idf",
    "group": "120363041776751646@g.us", // '972526515354-1631541593'
    "userDebug": "120363041776751646@g.us",
    'checkBirthdayHour': 12
}

const url = 'https://docs.google.com/spreadsheets/d/';
const q1 = '/gviz/tq?';
const q2 = 'tqx=out:json';

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
    return new Date(new Date(d).setHours(d.getUTCHours() + ADD_HOUR_TO_UTC));
}



function randomSentence(personName, personAge, GroupType) {
    var sentencelist = {
        "genery": [
            `מזל טוב ${personName} לרגל הולדתו ה${personAge}!!\nעד 120 שנה`,
            `מי הכי יפה בעיר? ${personName} הכי יפה בעיר!!\nמזל טוב ליום הולדתך ה${personAge}!!\nעד 120 שנה`,
            `הופהההה!!! ${personName} חוגג יומולדת  ${personAge} היום!!\nמזל טובבבב!!`,
            `למי יש יומולדת? למי יש יומולדת?\nל${personName} יש יומולדת!!\nמזל טוב להגיעך ל ${personAge}! עד 120 שנה :)`,

        ],
        "idf": [
            `מזל טוב ${personName} להגיעך ל${personAge}\nמחלקה 1 במיל' מצדיעה לך על שירותך המסור, אוהבים אותך ומעריכים מאוד`,
            `🎼היום יום הולדת
            היום יום הולדת
            היום יום הולדת ל${personName}🎊🎉
            מזלללל טובבבב🥳
            מה תאחלו לו?`,
            `מזל טוב ל${personName} שהזדקן בעוד שנה👻
            מאחלים לך את כל הטוב שבעולם🎊🥳`,
            `מזל טוב ל${personName} ליום הולדתו ה-${personAge}🥳
            מאחלים לך הצלחה בכל, תמיד מאחוריך מחלקה 1!`,
            `הכלניות אדומות
            הורדים ורודים
            למי יש יום הולדת
            ל${personName} המדהים🎉🎊
            מזל טוב!🥳`,
            `הידעת?
            היום לפני ${personAge} שנים ${personName} נולד!🎊🥳 
            מה תאחלו לו?`,
            `אחשלנו היקר ${personName} אוהבים אותך מאוד, גם אם לא באת מהפלחוד,מאחלים לך מזל טוב ענק לרגל יום הולדתך ה${personAge}, שתהיה לך שנה מאושרת ושמחה,
            בריאות, עושר, וצמיחה.
            שאת כל משאלותיך תגשים ותזכור לא לשים על אנשים.
            תישאר כמו שאתה יא כוכב
            כל אחד מאיתנו בך מאוהב
            אוהבים מחלקה 1 במילואים!`,
            `מזל טוב ${personName} נשמה שכמוך שתהיה לך שנה מטורפת, של הגשמה, מימוש עצמי, סיפוק, בשמחה בריאות עושר וכושר,
            תשמח תשיר ותרקוד,
            ותמשיך בדרכך לצעוד,
            אוהבים מחלקה 1 במילואים!`,
            `תחזיקו חזק כי היום המזל טוב הולך ישר ל${personName} !!! כן כן,
            לא ידעתם לא סיפרנו אבל היום ${personAge} הוא חוגג 
           ולעשות מסיבה אצלו בגג כל שנה הוא נוהג
           שתהיה לך שנה מלאה בטוב,
           שתדע להנות לשמוח ולאהוב 
           והכי חשוב תפסיק להיות צהוב
           אוהבים מחלקה 1 במילואים!`


        ]
    }
    try {
        var randomInt = Math.floor(Math.random() * sentencelist[GroupType].length);
        return sentencelist[GroupType][randomInt];
    } catch (error) {
        console.log("GroupType not vaild " + error)
        var randomInt = Math.floor(Math.random() * sentencelist.genery.length);
        return sentencelist.genery[randomInt];
    }

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
        if (dateHeb.month == birthdayHeb.month && dateHeb.day == birthdayHeb.day) {
            return dateHeb.year - birthdayHeb.year;
        }
    }
    if (datePrefer == 'לועזי') {
        if (dateNow.getMonth() == birthdayLoazi.getMonth() && dateNow.getDate() == birthdayLoazi.getDate()) {
            return dateNow.getFullYear() - birthdayLoazi.getFullYear();
        }
    }
    return 0;
}

function birthday_massege(ssid) {
    birthdayList[ssid] = [];
    let url1 = `${url}${ssid}${q1}&${q2}`;

    fetch(url1)
        .then(res => res.text())
        .then(data => {
            var json = JSON.parse(data.substr(47).slice(0, -2));
            rows = json.table.rows;

            dateNow = getIsraelTime()
            dateHeb = new Hebcal.HDate(dateNow);
            console.log(`${dateNow}\nHebTime: ${dateHeb}\n-----`)
            //for testing
            dateHeb = new Hebcal.HDate(9, "Sh'vat", 5790) //Sh'vat
            //dateNow = new Date("2020-08-06")



            // loop on all the rows (for each person)
            rows.forEach(element => {
                /*
                c - cell
                v - value
                f - format
                */
                try {
                    PersonName = element.c[1].v;
                    datePrefer = element.c[2].v;
                    birthdayLoazi = element.c[3].f;
                } catch (error) {
                    console.log(error)
                }

                try {
                    day_he = element.c[4].v.trim();
                    month_he = element.c[5].v;
                    year_he = element.c[6].v.trim();
                } catch (error) {
                    if (datePrefer == "עברי") { client.sendMessage(birthdayProcesses[ssid].userDebug, `ל${personName} יש בעיה בתאריך העברי (חוגג יומולדת עברי)`); }
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

                // make HDate
                if (year_he[0] == 'ה') { year_he = year_he.slice(1) }
                year_he_num = 5000 + convertToNumber(year_he)

                day_he_num = convertToNumber(day_he)
                birthdayHeb = new Hebcal.HDate(day_he_num, month_he, year_he_num);

                // fix Loazi Date
                var birthday_array = birthdayLoazi.split("/");
                birthdayLoazi = new Date(birthday_array[2], birthday_array[1] - 1, birthday_array[0]); //month start from 0 

                age = comperDate(dateNow, birthdayLoazi, dateHeb, birthdayHeb, datePrefer)

                console.log(`${birthdayHeb}\n--------`)

                if (age > 0) {
                    birthdayList[ssid].push({ "name": PersonName, "age": age })
                }
            });
        })
        .then(() => {
            console.log("birthdayList contain " + birthdayList[ssid].length + " objects")
            if (birthdayList[ssid].length == 0) {

            } else {
                birthdayList[ssid].forEach(person => {
                    client.sendMessage(birthdayProcesses[ssid].group, randomSentence(person.name, person.age, birthdayProcesses[ssid].GroupType));
                })
            }
            birthdayList[ssid] = []; // reset list
        })
}

async function check_birthday(ssid) {
    client.sendMessage(birthdayProcesses[ssid].userDebug, `כעת העדכונים של הבוט עבור ${birthdayProcesses[ssid].name}, ישלחו כאן`);

    while (true) {
        var todayHour = getIsraelTime().getHours();
        if (todayHour == birthdayProcesses[ssid].checkBirthdayHour) {
            console.log(`--------\nTime: ${todayHour}, --> Start to check birthdays...`)
            client.sendMessage(birthdayProcesses[ssid].userDebug, `השעה: ${todayHour}, --> בודק ימי הולדת...`);
            birthday_massege(ssid)
        } 
        /*else {
            console.log(`--------\nTime: ${todayHour}`)
            client.sendMessage(birthdayProcesses[ssid].userDebug, `השעה: ${todayHour}, אני חי! :)`);
        }*/

        /*  1000*60         is a minute 
            1000*60*60      is a hour
            1000*60*60*24   is a day     */
        await sleep(1000 * 60 * 60); // 

        if (birthdayProcesses[ssid] == undefined) {
            break;
        }
    }
}

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
    client.sendMessage(`${groupID_debug}@g.us`, 'הבוט מחובר לחשבון');

    for (ssid in birthdayProcesses){
        check_birthday(ssid)
    }
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    /*##############################
                ping - pong
     ###############################*/
    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');
    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');
    } else if (msg.body === '!פינג אחי') {
        msg.reply('פונג אחי');
    } else if (msg.body === '!פונג אחי') {
        msg.reply('פינג אחי');
    } else if (msg.body.startsWith('!ping')) {
        msg.reply('pong');
    } else if (msg.body.startsWith('!פינג')) {
        msg.reply('פונג');
    }

    /*#################################
     enable / disable birthday process
     ##################################*/

    // only admin can do that
    else if (msg.body === '!birthday-stop-all') {
        // if sended in private chat
        var author = msg.author
        if (author == undefined) { author = msg.from }

        if (BOT_ADMINS.includes(author)) {
            birthdayProcesses = {};
            msg.reply('All the Birthday process turned off');
        } else {
            msg.reply("You don't have the premision for that");
        }

    }
    // admin and the who start the process can stop
    // !birthday-stop {name}
    else if (msg.body.startsWith('!birthday-stop')) {
        var words = msg.body.split(' ');
        // if sended in private chat
        var author = msg.author
        if (author == undefined) {
            author = msg.from
        }
        if (noDoubleWhitespace(msg.body) == false) {
            msg.reply('Please Enter again without double whitespace')
        } else {
            for (const [key, value] of Object.entries(birthdayProcesses)) {
                if (value.name == words[1]) {
                    if (BOT_ADMINS.includes(author) || author == value.userDebug) {
                        delete birthdayProcesses[key]
                        msg.reply(`Birthday process ${value.name} has disable`);
                    } else {
                        msg.reply("You don't have the premision for that");
                    }

                }
            }
        }
    }    
    // get list
    else if (msg.body === '!birthday-list') {
        msg.reply("All the birthday processes:\n" + JSON.stringify(birthdayProcesses));
    }

    /*###############################################
     start process - !birthday-start ssid name type
     ################################################*/

    // !birthday-start {ssid} {name} {type} 
    else if (msg.body.startsWith('!birthday-start')) {
        var words = msg.body.split(' ');

        if (noDoubleWhitespace(msg.body) == false) {
            msg.reply('Please Enter again without double whitespace')
        } else if (words.length < 3) {
            // error while setting
            msg.reply('not enough arguments');

        } else {
            //check if vaild
            let url1 = `${url}${words[1]}${q1}&${q2}`;
            fetch(url1)
                .then(res => res.text())
                .then(data => {
                    try {
                        // is it data table?
                        var json = JSON.parse(data.substr(47).slice(0, -2));

                        // check no double process
                        if (birthdayProcesses[words[1]] == undefined) {

                            // if sended in private chat
                            author = msg.author
                            if (author == undefined) { author = msg.from }
                            // if no type, set to general
                            GroupType = words[3]
                            if (GroupType == undefined || GroupType == '') { GroupType = 'genery' }

                            birthdayProcesses[words[1]] = {
                                "name": words[2],
                                "GroupType": GroupType,
                                "group": msg.from,
                                "userDebug": author,
                                'checkBirthdayHour': 10
                            }
                            // start the process
                            check_birthday(words[1]);
                            msg.reply('Start running ' + words[2]);

                        } else {
                            msg.reply('Already running');
                        }



                    } catch (error) {
                        console.log(error)
                        msg.reply('Error with the table');
                    }
                })
        }

    }

    /*##############################
                Others
     ###############################*/
    // set UTC time (admin only)
    // !setUTC {hour}
    else if (msg.body.startsWith('!setUTC')) {
        var author = msg.author;
        if (author == undefined) {
            author = msg.from;
        }
        if (BOT_ADMINS.includes(author)) {
            if (noDoubleWhitespace(msg.body) == false) {
                msg.reply('Please Enter again without double whitespace')
            } else {
                num = str.replace(/^\D+/g, "");
                ADD_HOUR_TO_UTC = num;
                msg.reply('UTC has change to +' + num);
            }
        } else {
            msg.reply("You don't have the premision for that");
        }
    }

    // set checkBirthdayHour (admins and author)
    // !birthday-sethour {name} {hour}
    else if (msg.body.startsWith('!birthday-sethour')) {
        var words = msg.body.split(' ');

        var author = msg.author
        if (author == undefined) { author = msg.from }

        if (noDoubleWhitespace(msg.body) == false) {
            msg.reply('Please Enter again without double whitespace')
        } else if (words.length < 3) {
            // error while setting
            msg.reply('not enough arguments');
        } else if (Number.isInteger(words[2])) {
            msg.reply('Please Enter vaild time');
        } else {
            for (const [key, value] of Object.entries(birthdayProcesses)) {
                if (value.name == words[1]) {
                    if (BOT_ADMINS.includes(author) || author == value.userDebug) {
                        birthdayProcesses[key].checkBirthdayHour = words[2]
                        msg.reply(`Birthday process ${value.name} hour has changed to ${words[2]}`);
                    } else {
                        msg.reply("You don't have the premision for that");
                    }

                }
            }
        }
    }
});

function noDoubleWhitespace(str) {
    var oneWhiteSpcae = false;
    for (let index = 0; index < str.length; index++) {
        if (str[index] == " ") {
            if (oneWhiteSpcae) {
                return false;
            }
            oneWhiteSpcae = true;
        } else {
            oneWhiteSpcae = false;
        }
    }
    return true;
}