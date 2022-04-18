const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contractsRouter = require('./routes/contracts')
const jobsRouter = require('./routes/jobs')
const depositRouter = require('./routes/balances')
const adminRouter = require('./routes/admin')

app.use("/contracts", contractsRouter)
app.use("/jobs", jobsRouter)
app.use("/balances", depositRouter)
app.use("/admin", adminRouter)

module.exports = app;
