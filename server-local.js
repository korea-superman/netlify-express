'use strict';

const app = require('./express/server');

app.listen(80, () => console.log('Local app listening on port 80!'));