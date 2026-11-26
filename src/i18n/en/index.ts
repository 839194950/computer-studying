import ui from './ui.json';
import hardware from './hardware-tracks.json';
import hardwareDetails from './hardware-details.json';
import language from './language-tracks.json';
import languageDetails from './language-details.json';
import os from './os-tracks.json';
import osDetails from './os-details.json';
import security from './security-tracks.json';
import securityDetails from './security-details.json';
import database from './database-tracks.json';
import databaseDetails from './database-details.json';

export default {
  ...ui,
  ...hardware, ...hardwareDetails,
  ...language, ...languageDetails,
  ...os, ...osDetails,
  ...security, ...securityDetails,
  ...database, ...databaseDetails,
} satisfies Record<string, string>;
