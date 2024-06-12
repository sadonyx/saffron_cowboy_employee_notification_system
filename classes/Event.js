"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMPLOYEE_CONTACT = {
    'Ada': 'adariane1221@gmail.com',
    'Gulet': 'gulet.isse@gmail.com',
    'Nikki': 'nikkijavadi@gmail.com',
    'Hannah': 'hannah@saffroncowboy.com',
};
function getDayName(dateObj) {
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
}
class Event {
    date;
    startTime;
    endTime;
    eventName;
    location;
    employees;
    services;
    constructor(row) {
        this.date = {};
        this.location = {};
        this.startTime = '';
        this.endTime = '';
        this.eventName = '';
        this.employees = [];
        this.services = '';
        this.init(row);
    }
    init = (row) => {
        this.getDate(row);
        this.getTimes(row);
        this.getLocation(row);
        this.getServices(row);
        this.getEventName(row);
        this.getEmployeeInfo(row);
    };
    getDate = (row) => {
        let currentYear = '2024';
        let dateString = row.get('When').trim();
        let eventDate = new Date(`${dateString}/${currentYear}`);
        let month = eventDate.getUTCMonth() + 1;
        let dayNumber = eventDate.getUTCDate();
        let dayName = getDayName(eventDate);
        this.date = {
            string: `${dayName}, ${month}-${dayNumber}-${currentYear}`,
            dateObj: eventDate,
        };
    };
    getTimes = (row) => {
        // regex that splits the string into 4 matches => startTime, AM|PM, endTime, AM|PM
        // NOTE : when initializing a new RegExp object, we have to also escape slashes!
        let regex = new RegExp('((^\\d{1,2}:\\d{2})|(^\\d{1,2}))|(am(?=\\s)|pm(?=\\s))|(am|pm)|((\\d{1,2}:\\d{2})|(\\d{1,2}))', 'gm');
        let timeString = row.get('Time')?.trim();
        if (timeString) {
            let timeArr = timeString.match(regex);
            if (timeArr) {
                this.startTime = `${timeArr[0]} ${timeArr[1]}`; // ie. 11 am
                this.endTime = `${timeArr[2]} ${timeArr[3]}`;
            }
        }
    };
    getLocation = (row) => {
        let locationNameString = row.get('Where')?.trim();
        let addressString = row.get('Address')?.trim();
        this.location = {
            name: locationNameString,
            address: addressString,
        };
    };
    getServices = (row) => {
        let servicesString = row.get('What')?.trim();
        this.services = servicesString;
    };
    getEventName = (row) => {
        let eventString = row.get('Who + What')?.trim();
        this.eventName = eventString;
    };
    getEmployeeInfo = (row) => {
        let employeeNameString = row.get('Who')?.trim();
        // if there are multiple names (separated by a plus sign), split them and process them individually
        if (/[\+]*/.test(employeeNameString)) {
            let splitNames = employeeNameString.split('+');
            splitNames.forEach((name, i) => {
                let trimmedName = name.trim();
                let employeeObj = { name: trimmedName, email: EMPLOYEE_CONTACT[trimmedName] };
                this.employees.push(employeeObj);
            });
            // process the singular name
        }
        else {
            let employeeObj = { name: employeeNameString, email: EMPLOYEE_CONTACT[employeeNameString] };
            this.employees.push(employeeObj);
        }
    };
    eventToObject = () => {
        return {
            date: this.date,
            starTime: this.startTime,
            endTime: this.endTime,
            address: this.location,
            services: this.services
        };
    };
}
exports.default = Event;
