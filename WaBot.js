const { Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require("node-fetch-commonjs");
const Hebcal = require('hebcal');
const fs = require('fs');

const BIRTHDAY_BOT_VERSION = "1.1.0";
var BOT_ADMINS = [];
var birthdayProcesses = {};
var birthdayList = {};
var ADD_HOUR_TO_UTC = 3;

/* start process when the bot start
birthdayProcesses['ssid'] = {
    "name": "{name}",
    "GroupType": "{type}",
    "group": "{XXXXXXX@g.us}",
    "userDebug": "{XXXXXXXXXX@c.us}",
    "checkBirthdayHour": "{10}",
    "benAishHi": false
} */

BOT_ADMINS = read_AdminsFile();
birthdayProcesses = read_BirthdayProcesses();

const url = 'https://docs.google.com/spreadsheets/d/';
const q1 = '/gviz/tq?';
const q2 = 'tqx=out:json';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // true - without browser
        args: ["--no-sandbox"]
    },

});

function randomSentence(personName, personAge, GroupType, personSex) {
    var sentencelist = {
        "genery": {
            "זכר": [
                `מזל טוב ${personName} לרגל הולדתו ה${personAge}!!\nעד 120 שנה`,
                `מי הכי יפה בעיר? ${personName} הכי יפה בעיר!!\nמזל טוב ליום הולדתך ה${personAge}!!\nעד 120 שנה`,
                `הופהההה!!! ${personName} חוגג יומולדת  ${personAge} היום!!\nמזל טובבבב!!`,
                `למי יש יומולדת? למי יש יומולדת?\nל${personName} יש יומולדת!!\nמזל טוב להגיעך ל ${personAge}! עד 120 שנה :)`,

            ],
            "נקבה": [
                `מזל טוב ${personName} לרגל הולדתה ה${personAge}!!\nעד 120 שנה`,
                `מי הכי יפה בעיר? ${personName} הכי יפה בעיר!!\nמזל טוב ליום הולדתך ה${personAge}!!\nעד 120 שנה`,
                `הופהההה!!! ${personName} חוגגת יומולדת  ${personAge} היום!!\nמזל טובבבב!!`,
                `למי יש יומולדת? למי יש יומולדת?\nל${personName} יש יומולדת!!\nמזל טוב להגיעך ל ${personAge}! עד 120 שנה :)`,
            ]
        },
        "family": {
            "זכר": [
                `🎼היום יום הולדת\nהיום יום הולדת\nהיום יום הולדת ל${personName}🎊🎉חג לו שמח וזר לו פורח היום יומולדת ל${personName}!\nמזלללל טובבבב🥳`,
                `מזל טוב ל${personName}!🥳🥳\nהיום הוא בן ${personAge}!!`,
                `כשצוחקים זה נחמד, כשמחייכים זה מיוחד!😁\nכשנותנים ברכה זה מקרב, וכשאומרים מזל טוב ליום הולדת זה מחמם את הלב!🤗\n*מזל טוב ${personName}!🥰 יומולדת ${personAge} שנה שמח!🥳*`,
                `קולולולולו!!!🎊🎉\n *${personName} חוגג יומולדת  ${personAge} היום!!*\nהמון מזל טוב!!🥳`,
                `מזל טוב ${personName} ליום הולדתך!🥳\n\nיבואו על ראשך ברכות וטובות\nשבתורה מובאות וכתובות\nועוד שנים נעימות ורבות\nממני - הבוט🤖`
            ],
            "נקבה": [
                `🎼היום יום הולדת\nהיום יום הולדת\nהיום יום הולדת ל${personName}🎊🎉חג לה שמח וזר לה פורח היום יומולדת ל${personName}!\nמזלללל טובבבב🥳`,
                `מזל טוב ל${personName}!🥳🥳\nהיום היא בת ${personAge}!!`,
                `כשצוחקים זה נחמד, כשמחייכים זה מיוחד!😁\nכשנותנים ברכה זה מקרב, וכשאומרים מזל טוב ליום הולדת זה מחמם את הלב!🤗\n*מזל טוב ${personName}!🥰 יומולדת ${personAge} שנה שמח!🥳*`,
                `קולולולולו!!!🎊🎉\n *${personName} חוגגת יומולדת  ${personAge} היום!!*\nהמון מזל טוב!!🥳`,
                `מזל טוב ${personName} ליום הולדתך!🥳\n\nיבואו על ראשך ברכות וטובות\nשבתורה מובאות וכתובות\nועוד שנים נעימות ורבות\nממני - הבוט🤖`
            ]
        },
        "idf": {
            "זכר": [
                `מזל טוב ${personName} להגיעך ל${personAge}\nמחלקה 1 במיל' מצדיעה לך על שירותך המסור, אוהבים אותך ומעריכים מאוד`,
                `🎼היום יום הולדת\nהיום יום הולדת\nהיום יום הולדת ל${personName}🎊🎉\nמזלללל טובבבב🥳\nמה תאחלו לו?`,
                `מזל טוב ל${personName} שהזדקן בעוד שנה👻\nמאחלים לך את כל הטוב שבעולם🎊🥳`,
                `מזל טוב ל${personName} ליום הולדתו ה-${personAge}🥳\nמאחלים לך הצלחה בכל, תמיד מאחוריך מחלקה 1!`,
                `הכלניות אדומות\nהורדים ורודים\nלמי יש יום הולדת\nל${personName} המדהים🎉🎊\n\nמזל טוב!🥳`,
                `הידעת?\nהיום לפני ${personAge} שנים ${personName} נולד!🎊🥳 \nמה תאחלו לו?`,
                `אחשלנו היקר ${personName} אוהבים אותך מאוד, גם אם לא באת מהפלחוד,מאחלים לך מזל טוב ענק לרגל יום הולדתך ה${personAge}, שתהיה לך שנה מאושרת ושמחה,\nבריאות, עושר, וצמיחה.\nשאת כל משאלותיך תגשים ותזכור לא לשים על אנשים.\nתישאר כמו שאתה יא כוכב\nכל אחד מאיתנו בך מאוהב\nאוהבים מחלקה 1 במילואים!`,
                `מזל טוב ${personName} נשמה שכמוך שתהיה לך שנה מטורפת, של הגשמה, מימוש עצמי, סיפוק, בשמחה בריאות עושר וכושר,\nתשמח תשיר ותרקוד,\nותמשיך בדרכך לצעוד,\nאוהבים מחלקה 1 במילואים!`,
                `תחזיקו חזק כי היום המזל טוב הולך ישר ל${personName} !!! כן כן,\nלא ידעתם לא סיפרנו אבל היום ${personAge} הוא חוגג \nולעשות מסיבה אצלו בגג כל שנה הוא נוהג\nשתהיה לך שנה מלאה בטוב,\nשתדע להנות לשמוח ולאהוב \nוהכי חשוב תפסיק להיות צהוב\nאוהבים מחלקה 1 במילואים!`
            ],
            "נקבה": [
                `מזל טוב ${personName} להגיעך ל${personAge}\nמחלקה 1 במיל' מצדיעה לך על שירותך המסור, אוהבים אותך ומעריכים מאוד`,
            ]
        }
    }
    try {
        var randomInt = Math.floor(Math.random() * sentencelist[GroupType.toLowerCase()][personSex].length);
        return sentencelist[GroupType.toLowerCase()][personSex][randomInt];
    } catch (error) {
        console.log(error)

        if (personSex === "זכר" || personSex === "נקבה") {
            var randomInt = Math.floor(Math.random() * sentencelist.genery[personSex].length);
            return sentencelist.genery[randomInt];
        }

        var randomInt = Math.floor(Math.random() * sentencelist.genery["זכר"].length);
        return sentencelist.genery[randomInt];
    }

}



function birthday_massege(ssid) {
    birthdayList[ssid] = [];
    let url1 = `${url}${ssid}${q1}&${q2}`;

    fetch(url1)
        .then(res => res.text())
        .then(data => {
            var json = JSON.parse(data.substr(47).slice(0, -2));
            rows = json.table.rows;

            dateNow = getIsraelTime();
            dateHeb = new Hebcal.HDate(dateNow);

            // For testing - custom date
            //dateHeb = new Hebcal.HDate(9, "Sh'vat", 5790)
            //dateNow = new Date("2020-08-06")
            //dateHeb = new Hebcal.HDate(new Date("May 19 2022 23:33:47"))

            // ### => move manualy to next day after sunset (module not working)
            dateHeb = fixHebDate(dateHeb);

            console.log(`${dateNow}\nHebTime: ${dateHeb}\n-----`);


            // loop on all the rows (for each person)
            rows.forEach(element => {
                var person = readRowsFromGoogleSheet(element);
                //console.log(person)

                if (!person.currectHebDate && person.datePrefer == 'עברי') {
                    client.sendMessage(birthdayProcesses[ssid].userDebug,
                        `ל${person.name} יש בעיה בתאריך העברי (חוגג יומולדת עברי)`);
                }

                if (!person.currectEnDate && person.datePrefer == 'לועזי') {
                    client.sendMessage(birthdayProcesses[ssid].userDebug,
                        `ל${person.name} יש בעיה בתאריך הלועזי (חוגג יומולדת לועזי)`);
                }

                age = comperDate(dateNow, person.LoaziDate, dateHeb, person.HebDate, person.datePrefer)
                if (age > 0) {
                    birthdayList[ssid].push({ "name": person.name, "age": age, "sex": person.sex, "phone": person.phone })
                }
            });
        })
        .then(() => {
            console.log("birthdayList contain " + birthdayList[ssid].length + " objects")
            if (birthdayList[ssid].length == 0) {

            } else {
                birthdayList[ssid].forEach(person => {
                    timeDiffrence = dateHeb.getZemanim().tzeit - dateNow

                    // if Shabat - send after Shabat
                    if (dateHeb.getDay() !== 6) { //not shabat
                        client.sendMessage(birthdayProcesses[ssid].group, randomSentence(person.name, person.age, birthdayProcesses[ssid].GroupType, person.sex));
                    } else {
                        sendAfterShabat(timeDiffrence, birthdayProcesses[ssid].group, person.name, person.age, birthdayProcesses[ssid].GroupType, person.sex)
                    }

                    //send benAishHi_beracha
                    if ("benAishHi" in birthdayProcesses[ssid]) {
                        if (birthdayProcesses[ssid].benAishHi &&
                            person.sex === "זכר" &&
                            person.phone !== "") {

                            var brit_date = new Date(dateHeb.greg().valueOf());
                            brit_date.setDate(date.getDate() + 8);

                            //no massege in shabat
                            var sendTime = 8 * 24 * 60 * 60 * 1000;
                            if (dateHeb.getDay() === 5) {
                                sendTime = 7 * 24 * 60 * 60 * 1000;
                            }
                            benAishHi_beracha(sendTime, person.phone, brit_date)
                        }
                    } else {
                        birthdayProcesses[ssid].benAishHi = false;
                        write_BirthdayProcesses()
                    }

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
            console.log(`--------\nTime: ${todayHour}, --> Start to check birthdays at ${birthdayProcesses[ssid].name}...`)
            client.sendMessage(birthdayProcesses[ssid].userDebug, `השעה: ${todayHour}, --> בודק ימי הולדת ב${birthdayProcesses[ssid].name}...`);
            birthday_massege(ssid)
        }

        /*  1000*60         is a minute 
            1000*60*60      is a hour
            1000*60*60*24   is a day     */
        await sleep(1000 * 60 * 60);

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

    for (ssid in birthdayProcesses) {
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

    /*#########################
            get time
     ##########################*/
    else if (msg.body.startsWith('!get-time')) {
        d = getIsraelTime();
        h = fixHebDate(new Hebcal.HDate(d))
        msg.reply(`${d.getHours()}:${d.getMinutes()}\n${h.getDate()} ${h.getMonthName("h")}\n${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
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
            write_BirthdayProcesses();
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
                        write_BirthdayProcesses();
                        msg.reply(`Birthday process ${value.name} has disable`);
                    } else {
                        msg.reply("You don't have the permission for that");
                    }

                }
            }
        }
    }
    /*###############################
               get list
     ################################*/
    // admin get all, user got what he own
    else if (msg.body === '!birthday-list') {
        var author = msg.author
        if (author == undefined) {
            author = msg.from
        }

        if (BOT_ADMINS.includes(author)) {
            msg.reply("All the birthday processes:\n" + JSON.stringify(birthdayProcesses));
        } else {
            temp = {}
            for (const [key, value] of Object.entries(birthdayProcesses)) {
                if (value.userDebug == author) {
                    temp[key] = value
                }
            }
            msg.reply("All the birthday processes:\n" + JSON.stringify(temp));
        }
    }

    /*###############################################
     start process - !birthday-start ssid name type
     ################################################*/

    // !birthday-start-json {jsonformat}
    else if (msg.body.startsWith('!birthday-start-json')) {
        str = msg.body.slice(20);
        try {
            var str_obj = JSON.parse(str);

            // check all the input
            var isBirthdayProcesse = true;
            for (k in str_obj) {
                if (!("name" in str_obj[k])) { isBirthdayProcesse = false }
                if (!("GroupType" in str_obj[k])) { isBirthdayProcesse = false }
                if (!("group" in str_obj[k])) { isBirthdayProcesse = false }
                if (!("userDebug" in str_obj[k])) { isBirthdayProcesse = false }
                if (!("checkBirthdayHour" in str_obj[k])) { isBirthdayProcesse = false }
            }

            if (isBirthdayProcesse) {
                sharedProcesses = Object.keys(birthdayProcesses).filter({}.hasOwnProperty.bind(str_obj));
                console.log(sharedProcesses)

                for (index in sharedProcesses) {
                    msg.reply(`The processe *${str_obj[sharedProcesses[index]].name}* already exist as *${birthdayProcesses[sharedProcesses[index]].name}*`);
                    delete str_obj[sharedProcesses[index]];
                }

                for (ssid in str_obj) {
                    let url2 = `${url}${ssid}${q1}&${q2}`;
                    fetch(url2)
                        .then(res => res.text())
                        .then(data => {
                            try {
                                // is it data table?
                                var json = JSON.parse(data.substr(47).slice(0, -2));

                                birthdayProcesses[ssid] = str_obj[ssid];
                                write_BirthdayProcesses();

                                // start the process
                                msg.reply('Starting ' + str_obj[ssid].name + " processe");
                                check_birthday(ssid);

                            } catch (e) {
                                msg.reply('Not valid input: wrong ssid\n' + url2)
                                console.log(e)
                            }
                        })
                }

            } else {
                msg.reply('Not valid input: not a Birthday Processe');
            }

        } catch (e) {
            msg.reply('Not valid input: not a json format');
        }
    }


    // !birthday-start {ssid} {name} {type} 
    else if (msg.body.startsWith('!birthday-start')) {
        var words = msg.body.split(' ');

        if (noDoubleWhitespace(msg.body) == false) {
            msg.reply('Please Enter again without double whitespace')
        } else if (words.length < 3) {
            // error while setting
            msg.reply('Not enough arguments\nplease enter in this order:\n!birthday-start {ssid} {name} {type}');
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
                                "checkBirthdayHour": 10,
                                "benAishHi": false
                            }
                            write_BirthdayProcesses();

                            // start the process
                            msg.reply('Starting ' + words[2]);
                            check_birthday(words[1]);

                        } else {
                            msg.reply(`This table used in ${birthdayProcesses[words[1]].name} processe`);
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
                num = msg.body.replace(/^\D+/g, "");
                ADD_HOUR_TO_UTC = num;
                msg.reply('UTC has change to +' + num);
            }
        } else {
            msg.reply("You don't have the permission for that");
        }
    }

    // set checkBirthdayHour (admins and author)
    // !birthday-sethour {name} {hour}
    else if (msg.body.startsWith('!birthday-sethour')) {
        var words = msg.body.split(' ');
        var customHour = parseInt(words[2])

        var author = msg.author
        if (author == undefined) { author = msg.from }

        if (noDoubleWhitespace(msg.body) == false) {
            msg.reply('Please Enter again without double whitespace')
        } else if (words.length < 3) {
            // error while setting
            msg.reply('Not enough arguments\nplease enter in this order:\n!birthday-sethour {name} {hour}');
        } else if (Number.isInteger(customHour)) {
            msg.reply('Please Enter vaild time');
        } else {
            for (const [key, value] of Object.entries(birthdayProcesses)) {
                if (value.name == words[1]) {
                    if (BOT_ADMINS.includes(author) || author == value.userDebug) {
                        birthdayProcesses[key].checkBirthdayHour = customHour
                        write_BirthdayProcesses();
                        msg.reply(`Birthday process ${value.name} hour has changed to ${customHour}`);
                    } else {
                        msg.reply("You don't have the permission for that");
                    }

                }
            }
        }
    }
    else if (msg.body === '!birthday-help') {
        msg.reply("Visit https://github.com/ZeANi-SHILIX/WhatsAppBirthdayBot");
    }
    else if (msg.body === '!info') {
        msg.reply("*This bot developed by Shilo Babila*\nVersion: " + BIRTHDAY_BOT_VERSION);
    }

    /*#########################
             admins
     ##########################*/
    else if (msg.body === '!get-admins') {
        author = (await msg.getContact()).id._serialized
        //console.log(author)
        if (BOT_ADMINS.length === 0) {
            msg.reply("There isn't admin for this bot");
        }
        else if (BOT_ADMINS.includes(author)) {
            msg.reply("Admins list:\n" + JSON.stringify(BOT_ADMINS));
        }
        else {
            msg.reply("You don't have the permission for that");
        }
    }
    // !set-admins {mentions}/{QuotedMsg}
    else if (msg.body.startsWith('!set-admins')) {
        author = (await msg.getContact()).id._serialized;

        if (BOT_ADMINS.includes(author) || BOT_ADMINS.length === 0) {
            mentions = msg.mentionedIds
            if (mentions.length != 0) {
                for (index in mentions) {
                    addAdmin(mentions[index], msg);
                }
            }

            if (msg.hasQuotedMsg) {
                quoted_msg = await msg.getQuotedMessage();
                quoted_id = (await quoted_msg.getContact()).id._serialized;
                if (!mentions.includes(quoted_id)) {
                    addAdmin(quoted_id, msg);
                }
            }

        } else {
            msg.reply("You don't have the permission for that");
        }
    }
    // !unset-admins {mentions}/{QuotedMsg}
    else if (msg.body.startsWith('!unset-admins')) {
        author = (await msg.getContact()).id._serialized;

        if (BOT_ADMINS.length === 0) {
            msg.reply("The admins list is empty");
        }
        else if (BOT_ADMINS.includes(author)) {
            mentions = msg.mentionedIds
            if (mentions.length != 0) {
                for (index in mentions) {
                    removeAdmin(mentions[index], msg);
                }
            }

            if (msg.hasQuotedMsg) {
                quoted_msg = await msg.getQuotedMessage();
                quoted_id = (await quoted_msg.getContact()).id._serialized;
                if (!mentions.includes(quoted_id)) {
                    removeAdmin(quoted_id, msg);
                }
            }

        } else {
            msg.reply("You don't have the permission for that");
        }
    }
});



/*######################################################
                  other functions
########################################################*/

function addAdmin(id, msg) {
    if (!BOT_ADMINS.includes(id)) {
        BOT_ADMINS.push(id) // add
        console.log(id + " Added to Admins")
        msg.reply(id + " Added to admins");
    } else {
        console.log(id + " Already Admin")
        msg.reply(id + " Already Admin");
    }
    write_AdminsFile()
}

function removeAdmin(id, msg) {
    if (BOT_ADMINS.includes(id)) {
        BOT_ADMINS = removeItemOnce(BOT_ADMINS, id); // remove
        console.log(id + " Removed from Admins")
        msg.reply(id + "  Removed from admins");
    } else {
        console.log(id + " Isn't Admin")
        msg.reply(id + " Isn't Admin");
    }
    write_AdminsFile()
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// wait {timeout} before sending
function sendAfterShabat(timeout, groupID, name, age, GroupType, sex) {
    setTimeout(function () {
        client.sendMessage(groupID, randomSentence(name, age, GroupType, sex));
    }, timeout)
}

// shorturl.at/htLY5
// TODO: date in english - change to hebrew
function benAishHi_beracha(timeout, phoneNum, date_brit) {
    setTimeout(function () {
        let beracha =
            `רבונו של עולם גלוי וידוע לפניך כי בהיום הזה שהוא יום ${date_brit.getDate()} לחודש ${date_brit.getMonthName("h")} שהוא היה יום שמיני ללידתי,
         נכנסתי בבריתו של אברהם אבינו עליו השלום בשנה הראשונה שנולדתי בה, 
         וקיים בי עבדך אבי מצות מילה ופריעה כאשר צוית אותנו בתורתך הקדושה ונתגלה הכלי השלישי של היסוד האמיתי נקרא קודש קודשים ויצא אורו, 
         ונתבטלה אחיזת החיצונים ונתחברו שמונה ושבעים אורות החסדים, 
         עם שמונה ושבעים אורות הגבורות ונתמתקו אורות הגבורות באורות החסדים: 
         אנא ה' למען שמך הגדול ולמען רחמיך וחסדיך תעזריני ותסייעני לשמור אות ברית קודש אשר חתמת בבשרנו, 
         ותצילני מכל חטא ומכל הרהורים רעים ומחשבות פגומות ותצילני מכל פגם הברית 
         הן במחשבה הן בדבור הן במעשה הן בחוש הריאות הן בחוש השמיעה הן בשאר חושים ובכולם אהיה טהור בקדושת הברית בלי שום פגם והרהור רע כלל, 
         ותזכני שאתגבר על יצר הרע, ותהיה מחשבתי קשורה ודבוקה בקדושת תמיד, 
         כי ברחמיך הרבים בחרת בנו מכל האומות ורוממתנו מכל הלשונות, 
         והבדלת אותנו מכל טומאותיהם ותועבותיהם, ככתוב בתורתך (ויקרא י, כו) ואבדיל אתכם מן העמים להיות לי, 
         נודה לך ה' אלהינו ואלהי אבותינו על שהוצאתנו מארץ מצרים, ופדיתנו מבית עבדים ועל בריתך שחתמת בבשרינו, 
         ועל תורתך שלמדתנו, ועל חוקי רצונך שהודעתנו, ועל חיים ומזון שאתה זן ומפרנס אותנו, 
         אנא ה' לב טהור ברא לי אלהים ורוח נכון חדש בקרבי, 
         ותמשוך עלי מחשבו קדושות וטהורות זכות ונכונות, ויהיה לי לב שמח בעבודתך תמיד, ותעזרני על דבר כבוד שמך מעתה ועד עולם אמן כן יהי רצון`

         try {
             client.sendMessage(phoneNum + "@c.us", beracha);
         } catch (error) {
             console.log(error)
         }
    }, timeout)
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
    //console.log(char + " is " + ascii)
    if (ascii > 1487 && ascii < 1498) return ascii - 1487           // א-י
    if (ascii == 1498) return (ascii - 1496) * 10                   // ך
    if (ascii > 1498 && ascii < 1501) return (ascii - 1497) * 10    // כ-ל
    if (ascii == 1501) return (ascii - 1497) * 10                   // ם
    if (ascii == 1502) return (ascii - 1498) * 10                   // מ
    if (ascii == 1503) return (ascii - 1498) * 10                   // ן
    if (ascii > 1503 && ascii < 1507) return (ascii - 1499) * 10    // נ-ע
    if (ascii == 1507) return (ascii - 1499) * 10                   // ף
    if (ascii == 1508) return (ascii - 1500) * 10                   // פ
    if (ascii == 1509) return (ascii - 1500) * 10                   // ץ
    if (ascii == 1510) return (ascii - 1501) * 10                   // צ
    if (ascii > 1510 && ascii < 1515) return (ascii - 1510) * 100   // ק-ת
    return 0
}

function readRowsFromGoogleSheet(element) {
    /*
    c - cell
    v - value
    f - format
    */

    var PersonName = "Error";
    var datePrefer = "";
    var got_error = false;

    try {
        PersonName = element.c[1].v;
        datePrefer = element.c[2].v;
    } catch (error) {
        got_error = true;
    }

    // loazi date
    var birthdayLoazi = "";
    var currectEnDate = true;
    try {
        birthdayLoazi = element.c[3].f;
    } catch (error) {
        currectEnDate = false;
        got_error = true;
    }

    // hebrew date
    var currectHebDate = true;
    var day_he = "", month_he = "", year_he = "";
    try {
        day_he = element.c[4].v.trim();
        month_he = element.c[5].v;
        year_he = element.c[6].v.trim();
    } catch (error) {
        currectHebDate = false
        got_error = true
    }

    // phone
    var phoneNum = "";
    try {
        phoneNum = element.c[7].v;
    } catch (error) {
        console.log(PersonName + "didn't enter phone number")
        //got_error = true
    }

    // email
    var emailAdress = "";
    try {
        emailAdress = element.c[8].v;
    } catch (error) {
        //got_error = true
    }

    // sex of person
    var personSex = "זכר";
    try {
        personSex = element.c[9].v;
    } catch (error) {
        got_error = true;
    }

    // if error - print the object
    if (got_error) { console.log(element.c) }



    // make HDate
    if (year_he[0] == 'ה') { year_he = year_he.slice(1) }
    year_he_num = 5000 + convertToNumber(year_he)

    day_he_num = convertToNumber(day_he)
    var birthdayHeb = new Hebcal.HDate(day_he_num, month_he, year_he_num);

    // fix Loazi Date
    if (birthdayLoazi.includes("/")) {
        var birthday_array = birthdayLoazi.split("/");
    } else if (birthdayLoazi.includes("-")) {
        var birthday_array = birthdayLoazi.split("-");
    } else {
        console.log(PersonName + ' has unknown Loazi date format: ' + birthdayLoazi)
        var birthday_array = ["", "", ""];
    }
    birthdayLoazi = new Date(
        birthday_array[2],
        birthday_array[1] - 1,  //month start from 0 
        birthday_array[0]);

    //console.log(`${PersonName}\n${datePrefer}\n${birthdayLoazi}\n${birthdayHeb}\n--------`)
    // + "\n" + day_he + " " + month_he + " " + year_he + "\n" +phoneNum + "\n" + emailAdress

    return {
        "name": PersonName,
        "datePrefer": datePrefer,
        "LoaziDate": birthdayLoazi,
        "HebDate": birthdayHeb,
        "phone": phoneNum,
        "email": emailAdress,
        "sex": personSex,
        "currectHebDate": currectHebDate,
        "currectEnDate": currectEnDate
    }
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

// if founded two - return false, if not (no double) return true
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

// fix server time
function getIsraelTime() {
    var d = new Date();
    return new Date(new Date(d).setHours(d.getUTCHours() + ADD_HOUR_TO_UTC));
}

function read_AdminsFile() {
    try {
        const text = fs.readFileSync('saved_files/admins.json', 'utf8');
        var text_json = JSON.parse(text);
        console.log(text_json);
        return text_json;
    } catch (err) {
        console.log(err)
    }
    return [];
}

function read_BirthdayProcesses() {
    try {
        const text = fs.readFileSync('saved_files/birthdayProcesses.json', 'utf8');
        var text_json = JSON.parse(text);
        console.log(text_json);
        return text_json;
    } catch (err) {
        console.log(err)
    }
    return {};
}

function write_BirthdayProcesses() {
    try {
        if (!fs.existsSync('saved_files')) {
            fs.mkdirSync('saved_files');
        }
        fs.writeFileSync('saved_files/birthdayProcesses.json', JSON.stringify(birthdayProcesses));
    } catch (err) {
        console.error(err);
    }
}

function write_AdminsFile() {
    try {
        if (!fs.existsSync('saved_files')) {
            fs.mkdirSync('saved_files');
        }
        fs.writeFileSync('saved_files/admins.json', JSON.stringify(BOT_ADMINS));
    } catch (err) {
        console.error(err);
    }
}

function fixHebDate(dateHeb) {
    dateHeb.setCity('Jerusalem');
    tempDate = getIsraelTime();
    console.log("tzeit (zmanim): " + dateHeb.getZemanim().tzeit);
    if (dateHeb.getZemanim().tzeit < tempDate) {
        tempDate.setDate(tempDate.getDate() + 1)
    }
    newdateHeb = new Hebcal.HDate(tempDate);
    newdateHeb.setCity('Jerusalem');
    return newdateHeb;
}