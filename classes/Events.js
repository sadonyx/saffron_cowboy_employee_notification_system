"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("./Event"));
class Events {
    upcomingEvents;
    length;
    constructor(rows) {
        this.upcomingEvents = [];
        this.getEvents(rows);
        this.length = this.upcomingEvents.length;
    }
    getEvents(rows) {
        rows.forEach((row) => {
            if (row.get('When').toLowerCase() !== 'tbd') {
                this.upcomingEvents.push(new Event_1.default(row));
            }
        });
    }
}
exports.default = Events;
