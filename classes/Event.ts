import { GoogleSpreadsheetRow } from "google-spreadsheet";

interface Contacts {
  [key: string]: string;
}

const EMPLOYEE_CONTACT: Contacts = {
  'Ada': 'adariane1221@gmail.com',
  'Gulet': 'gulet.isse@gmail.com',
  'Nikki': 'nikkijavadi@gmail.com',
  'Hannah': 'hannah@saffroncowboy.com',
}

function getDayName(dateObj: Date): string {
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' });        
}

type Row = GoogleSpreadsheetRow<Record<string, any>>;

type DateObj = {
  string?: string,
  dateObj?: Date,
}

type LocationObj = {
  name?: string,
  address?: string,
}

type employeeObj = {
  name: string,
  email: string
}

type employeeArr = Array<employeeObj>;

export default class Event {
  date: DateObj;
  startTime: string;
  endTime: string;
  eventName: string;
  location: LocationObj;
  employees: employeeArr;
  services: string;

  constructor(row: Row) {
    this.date = {};
    this.location = {};
    this.startTime = '';
    this.endTime = '';
    this.eventName = '';
    this.employees = [];
    this.services = '';

    this.init(row);
  }

  init = (row: Row) => {
    this.getDate(row);
    this.getTimes(row);
    this.getLocation(row);
    this.getServices(row);
    this.getEventName(row);
    this.getEmployeeInfo(row);
  }

  getDate = (row: Row): void => {
    let currentYear: string = '2024'

    let dateString: string = row.get('When').trim();
    let eventDate: Date = new Date(`${dateString}/${currentYear}`);

    let month: number = eventDate.getUTCMonth() + 1;
    let dayNumber: number = eventDate.getUTCDate();
    let dayName: string = getDayName(eventDate);

    this.date = {
      string: `${dayName}, ${month}-${dayNumber}-${currentYear}`,
      dateObj: eventDate,
    };
  }

  getTimes = (row: Row): void => {
    // regex that splits the string into 4 matches => startTime, AM|PM, endTime, AM|PM
    // NOTE : when initializing a new RegExp object, we have to also escape slashes!
    let regex: RegExp = new RegExp('((^\\d{1,2}:\\d{2})|(^\\d{1,2}))|(am(?=\\s)|pm(?=\\s))|(am|pm)|((\\d{1,2}:\\d{2})|(\\d{1,2}))', 'gm');

    let timeString: string = row.get('Time')?.trim();

    if (timeString) {
      let timeArr: RegExpMatchArray | null = timeString.match(regex);

      if (timeArr) {
        this.startTime = `${timeArr[0]} ${timeArr[1]}` // ie. 11 am
        this.endTime = `${timeArr[2]} ${timeArr[3]}`
      }
    }
  }

  getLocation = (row: Row): void => {
    let locationNameString: string = row.get('Where')?.trim();
    let addressString: string = row.get('Address')?.trim();

    this.location = {
      name: locationNameString,
      address: addressString,
    };
  }

  getServices = (row: Row): void => {
    let servicesString = row.get('What')?.trim();

    this.services = servicesString;
  }

  getEventName = (row: Row): void => {
    let eventString: string = row.get('Who + What')?.trim();

    this.eventName = eventString;
  }

  getEmployeeInfo = (row: Row): void => {
    let employeeNameString: string = row.get('Who')?.trim();

    // if there are multiple names (separated by a plus sign), split them and process them individually
    if (/[\+]*/.test(employeeNameString)) {
      let splitNames = employeeNameString.split('+');
      splitNames.forEach((name, i) => {
        let trimmedName: string = name.trim() 
        let employeeObj: employeeObj = { name: trimmedName, email: EMPLOYEE_CONTACT[trimmedName]}
        this.employees.push(employeeObj);
      });
      // process the singular name
    } else {
      let employeeObj: employeeObj = { name: employeeNameString, email: EMPLOYEE_CONTACT[employeeNameString]}
      this.employees.push(employeeObj);
    }
  }

  eventToObject = () => {
    return {
      date: this.date,
      starTime: this.startTime,
      endTime: this.endTime,
      address: this.location,
      services: this.services
    }
  }
}