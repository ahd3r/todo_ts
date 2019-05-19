import { NextFunction, Request, Response } from 'express';
import { ITask } from '../../helper/task/interface';
import { Task } from './service';

export class Controller {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await new Task(req.body.call, req.headers.authorization).save();
      res.send({ msg: 'Task created' });
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async edit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await new Task(req.body.call).edit(req.params.idTask);
      res.send({ msg: 'Task edited' });
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await Task.delete(req.params.idTask);
      res.send({ msg: 'Task deleted' });
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async done(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await Task.done(req.params.idTask);
      res.send({ msg: 'Task status changed' });
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task: ITask | null = await Task.get(req.params.idTask);
      if (task) {
        res.send(task);
      } else {
        res.send({ err: 'This task does not exist' });
      }
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.send(
        await Task.getAll(
          parseInt(req.params.page),
          parseInt(req.params.amount)
        )
      );
    } catch (err) {
      res.send({ err: err.message });
    }
  }
  public static async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.send(
        await Task.getUserTasks(
          parseInt(req.params.page),
          parseInt(req.params.amount),
          req.headers.authorization ? req.headers.authorization : ''
        )
      );
    } catch (err) {
      res.send({ err: err.message });
    }
  }
}
