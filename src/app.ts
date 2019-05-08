// import * as express from 'express';
import express = require('express');
import * as bodyParser from 'body-parser';

import { taskRoute } from './components/tasks/routes';

class Todo {
  app: express.Express;

  constructor() {
    this.app = express();
    this.bodyParser();
    this.bindTaskRoutes();
    this.errorHandling();
  }

  private bodyParser() {
    this.app.use('/', bodyParser.json());
  }
  private errorHandling() {
    this.app.use(
      '/',
      (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction
      ) => {
        resp.send({ err: 'Not found: 404' });
      }
    );
  }
  private bindTaskRoutes() {
    this.app.use('/task/', taskRoute);
  }
}

export const app: express.Express = new Todo().app;
