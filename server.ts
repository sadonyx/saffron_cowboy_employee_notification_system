import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { mailOptions, transporter, Info } from './mailer/mailer'
import config from "./config/config"

import Events from './classes/Events';
import Event from './classes/Event';

import messageHTML from './mailer/messageHTML'
import { SentMessageInfo } from 'nodemailer';

const sheetTitle: string = 'Master Dates';
const milliToDay: number = 86400000; // <- milliseconds in a day
const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface offsetLimit {
  offset: number;
  limit: number;
}

// configure json web token
const serviceAccountAuth = new JWT ({
  email: config.email,
  key: config.key,
  scopes: config.scopes,
});

let currentDate: Date = new Date(Date.now()); // Date object with current date (of the server)

// authenticate connection to spreadsheet
const doc = new GoogleSpreadsheet(config.id, serviceAccountAuth);

// server is set to trigger once every day
setInterval(triggerEvents, milliToDay);

// load sheet info
async function triggerEvents() {
  currentDate = new Date(Date.now()); // update current date
  console.log("Server reset. Current date:", currentDate); // display confirmation of server reset each day
  doc.resetLocalCache(); // reset cached info of previous loadInfo call
  await doc.loadInfo(); // get all info of the spreadsheet
  let sheet = doc.sheetsByTitle[sheetTitle];
  await sheet.loadCells(`A1:A${sheet.rowCount}`);
  await sheet.getRows(getOffsetLimit(sheet))
             .then((rows) => {
               let events: Events = new Events(rows);
               checkEvents(events);
             });
};

// check which events are coming up, and send an email notification at the appropriate time
function checkEvents(events: Events) {
  // If there exists and Events object, iterate through the upcoming events of the current month 
  if (events !== undefined) {
    events['upcomingEvents'].forEach((event: Event) => {
      // if the upcoming event date is within the configured time period
      if (timeToSendNotif(currentDate, event.date.dateObj)) {
        console.log(event);
        sendNotification(event);
      }
    })
  } else {
    console.log("No events loaded");
  }
}

// returns true if the two Dates' difference (in days) is equal to 2
function timeToSendNotif(currentDate: Date, targetDate: Date | undefined): boolean {
  if (typeof targetDate !== 'undefined') {
    // find the difference (in days) between the two dates
    let difference: number = Math.ceil((targetDate.getTime() - currentDate.getTime()) / milliToDay);
    return difference === 2;
  } else {
    return false;
  }
}

function sendNotification(event: Event) {
  // configure array of mail options ([{recipient, sender, subject, html body}, ...])
  let mailOptionsArr: Array<mailOptions> = buildMailOptions(event);

  // Send the email(s)
  mailOptionsArr.forEach((mailOptions) => {
    transporter.sendMail(mailOptions, function(error: Error | null, info: SentMessageInfo):void {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  })
}

// configure mailOptions using Event properties; we use an array incase there are multiple recipients
function buildMailOptions(event: Event): Array<mailOptions> {
  let mailOptionsArr: Array<mailOptions> = [];
  event.employees.forEach((employee) => {
    mailOptionsArr.push({
      from: 'notifications@saffroncowboy.com',
      to: employee.email,
      subject: generateSubjectLine(event),
      html: messageHTML(event, employee.name),
    })
  })
  return mailOptionsArr;
}

// generate subject line using Event date property.
function generateSubjectLine(event: Event): string {
  return `Upcoming Saffron Cowboy Event for ${event.date.string}`
}

// Find the rowNumbers of the current and next months in the spreadsheet
// The offset will be the next row below the current month cell
// The limit will be the difference between the rowNumbers of the current and next month cells
function getOffsetLimit(sheet: GoogleSpreadsheetWorksheet): offsetLimit {
  let offset: number = 0;
  let nextMonthIndex: number = 0;
  let limit: number = 0;
  let currentMonth: string = months[currentDate.getMonth()]; // string of current month
  let nextMonth: string = months[currentDate.getMonth() + 1]; // string of next month

  // console.log(currentMonth, nextMonth)

  // Iterate through the rows from the bottom of the sheet (will reach latest months faster)
  // 'i' is the rowNumber
  for (let i = sheet.rowCount - 1; i >= 0; i -= 1) {
    // Get string value of the first cell of the current row -> we are looking for "month name" strings
    let cellAiValue: string | undefined = sheet.getCell(i, 0).stringValue?.trim();
    // If the current month string is matched, set the offSet number to the row below
    if (cellAiValue !== undefined && cellAiValue === currentMonth) {
      console.log(cellAiValue, i);
      offset = i;
      break;
    // if the next month string is matched, store the value for calculating the limit
    } else if (cellAiValue !== undefined && cellAiValue === nextMonth) {
      console.log(cellAiValue, i);
      nextMonthIndex = i;
    }
  }

  limit = nextMonthIndex - offset - 1; // -1 since the limit is counted from the first cell
  return {offset: offset, limit: limit};
}