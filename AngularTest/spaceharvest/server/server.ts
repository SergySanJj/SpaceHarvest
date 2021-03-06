const distFolder = require('./constants').distFolder;
const port = require('./constants').port;
const api = require('./routing/api');
const Logger = require('./servermisc/logger').Logger;

const express = require('express');
const path = require('path');
const fs = require('fs');

const sysLog = new Logger(path.join(__dirname, 'logs'), 'system');

sysLog.record('Creating Express app');
const app = express();
// Allow any method from any host and log requests
app.use(require('./servermisc/cors').cors);
// Handle POST requests that come in formatted as JSON
app.use(express.json());
// App routes and API calls
app.use(api);


app.listen(port, 'localhost', () => {
  sysLog.logp(`Server running on port ${port}`);
});


