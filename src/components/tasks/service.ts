import { ObjectId } from 'mongodb';
import { IBackTaskData, ITask } from '../../helper/task/interface';
import { repo } from './repository';

export class Task implements ITask {
  public readonly call: string;
  public readonly status: boolean;
  public readonly idUser: ObjectId;

  constructor(call: string, idUser?: string) {
    this.call = call;
    this.status = false;
    this.idUser = new ObjectId(idUser);
  }

  public async save(): Promise<void> {
    try {
      await repo.createTask(this);
    } catch (err) {
      throw new Error(err);
    }
  }
  public async edit(idTask: string): Promise<void> {
    try {
      await Task.existingTask(idTask);
      await repo.updateTask(this, new ObjectId(idTask));
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async delete(idTask: string): Promise<void> {
    try {
      await Task.existingTask(idTask);
      await repo.deleteTask(new ObjectId(idTask));
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async deleteForUser(idUser: ObjectId | string): Promise<void> {
    try {
      await repo.deleteTaskForUser(
        typeof idUser === 'string' ? new ObjectId(idUser) : idUser
      );
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async done(idTask: string): Promise<void> {
    try {
      await Task.existingTask(idTask);
      await repo.doneTask(new ObjectId(idTask));
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async get(idTask: string): Promise<ITask | null> {
    try {
      return await repo.getTask(new ObjectId(idTask));
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async getAll(
    page: number,
    amount: number
  ): Promise<IBackTaskData> {
    try {
      return await repo.getTasks(page, amount);
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async getUserTasks(
    page: number,
    amount: number,
    idUser: string
  ): Promise<IBackTaskData> {
    try {
      return await repo.getUserTasks(page, amount, new ObjectId(idUser));
    } catch (err) {
      throw new Error(err);
    }
  }
  private static async existingTask(idTask: string): Promise<void> {
    try {
      const taskExisting: ITask | null = await repo.getTask(
        new ObjectId(idTask)
      );
      if (!taskExisting) {
        throw new Error('This task does not exist');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
