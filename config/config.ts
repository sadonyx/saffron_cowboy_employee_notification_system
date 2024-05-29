import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

const SCOPES: Array<string> = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const spreadsheetId: string = "1CKfXMTBxTNdYGzFKP1Cr7PZMydAIyKz1B0Cjm3Nt9G8";

interface ENV {
  email: string | undefined;
  key: string | undefined;
  scopes: Array<string> | undefined;
  id: string;
  senderEmail: string | undefined;
  senderPass: string | undefined;
}

interface Config {
  email: string;
  key: string;
  scopes: Array<string>;
  id: string;
  senderEmail: string;
  senderPass: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n') :
      undefined,
    scopes: SCOPES,
    id: spreadsheetId,
    senderEmail: process.env.SENDER_EMAIL,
    senderPass: process.env.SENDER_PASS,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
