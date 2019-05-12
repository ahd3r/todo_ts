import * as express from 'express';
import { body, param } from 'express-validator/check';

import { checkError } from '../../helper/middleware/check_error';
import { Controller } from './controller';

class Route {
  public readonly routes: express.Router;

  constructor() {
    this.routes = express.Router();

    this.addGetTasksRoute();
    this.addGetTaskRoute();
    this.addPostTaskRoute();
    this.addPutTaskRoute();
    this.addDelTaskRoute();
    this.addDoneTaskRoute();
  }

  private addGetTasksRoute(): void {
    this.routes.get(
      '/page=:page&amount=:amount',
      [
        param('page')
          .isInt()
          .withMessage('Page must be number'),
        param('amount')
          .isInt()
          .withMessage('Amount must be number')
      ],
      checkError,
      Controller.getAll
    );
  }
  private addGetTaskRoute(): void {
    this.routes.get(
      '/:idTask',
      [
        param('idTask')
          .isString()
          .isLength({ min: 24, max: 24 })
          .withMessage('idTask must be a number')
      ],
      checkError,
      Controller.get
    );
  }
  private addPostTaskRoute(): void {
    this.routes.post(
      '/',
      [
        body('call')
          .isLength({ min: 2, max: 100 })
          .isString()
          .withMessage('Wrong call')
      ],
      checkError,
      Controller.create
    );
  }
  private addPutTaskRoute(): void {
    this.routes.put(
      '/:idTask',
      [
        param('idTask')
          .isString()
          .isLength({ min: 24, max: 24 })
          .withMessage('idTask must be a number'),
        body('call')
          .isLength({ min: 2, max: 100 })
          .isString()
          .withMessage('Wrong call')
      ],
      checkError,
      Controller.edit
    );
  }
  private addDelTaskRoute(): void {
    this.routes.delete(
      '/:idTask',
      [
        param('idTask')
          .isString()
          .isLength({ min: 24, max: 24 })
          .withMessage('idTask must be a number')
      ],
      checkError,
      Controller.delete
    );
  }
  private addDoneTaskRoute(): void {
    this.routes.patch(
      '/:idTask',
      [
        param('idTask')
          .isString()
          .isLength({ min: 24, max: 24 })
          .withMessage('idTask must be a number')
      ],
      checkError,
      Controller.done
    );
  }
}

export const routes: express.Router = new Route().routes;
