"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageHTML = (event, employeeName) => {
    return `<p>Hello ${employeeName},</p>
<p>You have an event this upcoming <strong>${event.date.string}</strong> between the times of <strong>${event.startTime}</strong> - <strong>${event.endTime}</strong>. 
</p>
<p>The event will take place at <u><strong>${event.location.address}</strong></u>.</p>
<p>You are tasked with providing the following services: ${event.services}.</p>
<p>If there is any confusion with this scheduling, please refer to the <a href="https://docs.google.com/spreadsheets/d/1CKfXMTBxTNdYGzFKP1Cr7PZMydAIyKz1B0Cjm3Nt9G8/edit#gid=2094436605">Master Dates</a> document, or contact Hannah.</p>
<p style="font-size: 9pt;">*<em>This is an automated message. If you are having technical issues with this message, please email <a href="mailto:adnan@ashihabi.me">Adnan</em>.*</p>`;
};
exports.default = messageHTML;
