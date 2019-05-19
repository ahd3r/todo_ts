import { Collection, MongoClient, ObjectId } from 'mongodb';
import { db } from '../../helper/mongodb/db';
import { IBackTaskData, ITask } from '../../helper/task/interface';

class Repository {
  private readonly client: Promise<MongoClient>;
  private readonly collection: Promise<Collection>;

  constructor() {
    this.client = db;
    this.collection = this.getCollection();
  }

  private async getCollection(): Promise<Collection> {
    try {
      const client: MongoClient = await this.client;
      let collection: Collection;
      if (process.env.NODE_ENV === 'test') {
        collection = client.db('todo_test').collection('task');
      } else {
        collection = client.db('todo').collection('task');
      }
      return collection;
    } catch (err) {
      throw new Error(err);
    }
  }
  private async getCountTasks(
    options: { idUser: ObjectId } | {} = {}
  ): Promise<number> {
    const collection: Collection = await this.collection;
    return await collection.find(options).count();
  }

  public async createTask(data: ITask): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.insertOne({ data });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async updateTask(
    data: { call: string },
    idTask: ObjectId
  ): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.updateOne({ _id: idTask }, { $set: data.call });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async doneTask(idTask: ObjectId): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      const task: ITask | null = await collection.findOne({ _id: idTask });
      if (task && task.status === false) {
        await collection.updateOne({ _id: idTask }, { $set: { status: true } });
      } else if (task && task.status === true) {
        await collection.updateOne(
          { _id: idTask },
          { $set: { status: false } }
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteTask(idTask: ObjectId): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.deleteOne({ _id: idTask });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async deleteTaskForUser(idUser: ObjectId): Promise<void> {
    try {
      const collection: Collection = await this.collection;
      await collection.deleteMany({ idUser });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getTask(idTask: ObjectId): Promise<ITask | null> {
    try {
      const collection: Collection = await this.collection;
      return await collection.findOne({ _id: idTask });
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getTasks(page: number, amount: number): Promise<IBackTaskData> {
    try {
      const collection: Collection = await this.collection;
      const tasks: ITask[] = await collection
        .find()
        .skip((page - 1) * amount)
        .limit(amount)
        .toArray();
      const total: number = await this.getCountTasks();
      return { tasks, total };
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getUserTasks(
    page: number,
    amount: number,
    idUser: ObjectId
  ): Promise<IBackTaskData> {
    try {
      const collection: Collection = await this.collection;
      const tasks: ITask[] = await collection
        .find({ idUser })
        .skip((page - 1) * amount)
        .limit(amount)
        .toArray();
      const total: number = await this.getCountTasks({ idUser });
      return { tasks, total };
    } catch (err) {
      throw new Error(err);
    }
  }
}

export const repo: Repository = new Repository();
