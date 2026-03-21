require('dotenv').config();
const express = require('express');
require('./db/migrate');

const companyRoutes = require('./routes/company.routes');

const app = express();
app.use(express.json());

app.use('/companies', companyRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;