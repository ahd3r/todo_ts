import { ObjectId } from 'mongodb';

export interface ITask {
  readonly call: string;
  readonly status: boolean;
  readonly idUser: ObjectId;
}

export interface IBackTaskData {
  readonly tasks: ITask[];
  readonly total: number;
}
