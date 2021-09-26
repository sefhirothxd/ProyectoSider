const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/error');
const routes = require('./src/routes');
const pkg = require('./package.json');

const { port, dbUrl, secret } = config;

const app = express();

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((db) => console.info(db.connections))
  .catch((error) => console.info(error));

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
