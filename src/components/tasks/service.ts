import { ObjectId } from 'mongodb';
import { IBackTaskData, ITaskInterface } from '../../helper/task/interface';
import { repo } from './repository';

export class Task implements ITaskInterface {
  public readonly call: string;
  public readonly status: boolean;

  constructor(call: string, status?: boolean) {
    this.call = call;
    this.status = status ? status : false;
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
  public static async done(idTask: string): Promise<void> {
    try {
      await Task.existingTask(idTask);
      await repo.doneTask(new ObjectId(idTask));
    } catch (err) {
      throw new Error(err);
    }
  }
  public static async get(idTask: string): Promise<IBackTaskData | null> {
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
  private static async existingTask(idTask: string): Promise<void> {
    try {
      const taskExisting: IBackTaskData | null = await repo.getTask(
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
