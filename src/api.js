const  { config } = require('dotenv');
const { join } = require('path');
const configPath = join(__dirname, '../.env');
config({ path: configPath });
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const routes = require('./routes');
const executaRotinaDeEstornos = require('./service/estornoService');

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

cron.schedule('*/1 * * * *', () => { executaRotinaDeEstornos() });

app.listen(3333, () => {
  console.log('tá rodando! :D')
});
