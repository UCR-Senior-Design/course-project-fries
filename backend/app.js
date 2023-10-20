const express = require('express');
const bodyParser = require('body-parser');

const patientsRoutes = require('./routes/patients-routes');

const app = express();

app.use('/api/patients', patientsRoutes);

app.listen(5000);