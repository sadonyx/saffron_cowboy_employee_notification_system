import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { mailOptions, transporter, Info } from './mailer'
import config from "./config/config"

import Events from './classes/Events';
import Event from './classes/Event';

import messageHTML from './messageHTML'
import { SentMessageInfo } from 'nodemailer';

const sheetTitle: string = 'Master Dates';
const milliToDay: number = 86400000; // <- milliseconds in a day

const serviceAccountAuth = new JWT ({
  email: config.email,
  key: config.key,
  scopes: config.scopes,
});

let currentDate = new Date(Date.now());

// authenticate connection to spreadsheet
const doc = new GoogleSpreadsheet(config.id, serviceAccountAuth);

setInterval(triggerEvents, milliToDay);

// load sheet info
async function triggerEvents() {
  await doc.loadInfo();
  await doc.sheetsByTitle[sheetTitle].getRows({offset: 75, limit: 8})
                                     .then((rows) => {
                                        let events: Events = new Events(rows);
                                        checkEvents(events);
                                      });
};

function checkEvents(events: Events) {
  if (events !== undefined) {
    events['upcomingEvents'].forEach((event: Event) => {
      if (timeToSendNotif(currentDate, event.date.dateObj)) {
        console.log(event);
        sendNotification(event);
      }
    })
  } else {
    console.log("No events loaded");
  }
}

function timeToSendNotif(currentDate: Date, targetDate: Date | undefined): boolean {
  if (typeof targetDate !== 'undefined') {
    let difference: number = Math.floor((targetDate.getTime() - currentDate.getTime()) / milliToDay);
    return difference === 2;
  } else {
    return false;
  }
}

function sendNotification(event: Event) {
  let mailOptions: mailOptions = buildMailOptions(event);

  // Send the email
  transporter.sendMail(mailOptions, function(error: Error | null, info: SentMessageInfo):void {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

function buildMailOptions(event: Event): mailOptions {
  return {
    from: 'notifications@saffroncowboy.com',
    to: event.employeeEmail,
    subject: generateSubjectLine(event),
    html: messageHTML(event),
  }
}

function generateSubjectLine(event: Event): string {
  return `Upcoming Saffron Cowboy Event for ${event.date.string}`
}