const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const itensRoutes = require('./routes/itens');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));


app.use('/', itensRoutes);
app.get('/', (_, res) => res.send('API Monster Collection OK'));


app.listen(3000, '0.0.0.0', () =>
  console.log('Servidor rodando em http://0.0.0.0:3000')
);
