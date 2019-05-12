export interface ITaskInterface {
  readonly call: string;
  readonly status: boolean;
}

export interface IBackTaskData {
  readonly tasks: ITaskInterface[] | ITaskInterface;
  readonly total?: number;
}
