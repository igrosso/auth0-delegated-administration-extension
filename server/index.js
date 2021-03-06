import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import { configProvider } from 'auth0-extension-tools';

import api from './routes/api';
import hooks from './routes/hooks';
import meta from './routes/meta';
import htmlRoute from './routes/html';

import config from './lib/config';
import logger from './lib/logger';
import * as middlewares from './lib/middlewares';

module.exports = (cfg) => {
  config.setProvider(cfg);

  const app = new Express();
  app.use((req, res, next) => {
    if (req.webtaskContext) {
      config.setProvider(configProvider.fromWebtaskContext(req.webtaskContext));
    }

    next();
  });
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use('/api', api());
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/meta', meta());
  app.use('/.extensions', hooks());

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(middlewares.errorHandler);
  return app;
};
