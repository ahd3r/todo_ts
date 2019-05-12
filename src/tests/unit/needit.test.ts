import { Task } from '../../components/tasks/service';

test('try to get nothing', async (done: Function) => {
  expect(await Task.getAll(1, 5)).toBe([]);
  done();
});
