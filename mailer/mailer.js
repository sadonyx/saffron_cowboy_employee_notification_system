"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
// Create a transporter object
exports.transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: config_1.default.senderEmail,
        pass: config_1.default.senderPass,
    }
});
