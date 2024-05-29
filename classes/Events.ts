import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import Event from './Event'

type Rows = GoogleSpreadsheetRow<Record<string, any>>[];
type Row = GoogleSpreadsheetRow<Record<string, any>>;

export default class Events {
  upcomingEvents: Array<Event>;

  constructor(rows: Rows) {
    this.upcomingEvents = [];

    this.getEvents(rows);
    // console.log(this.events);
  }

  getEvents(rows: Rows): void {
    rows.forEach((row: Row) => {
      if (row.get('When').toLowerCase() !== 'tbd') {
        this.upcomingEvents.push(new Event(row));
      }
    })
  }
}