import * as db from 'mongodb';

class Repository {
  async createTask() {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }
  async updateTask() {}
  async deleteTask() {}
  async getTask() {}
  async getTasks() {}
}

export const repo = new Repository();
