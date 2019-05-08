import { app } from './app';
import * as mongo from 'mongodb';

app.listen(3000, async () => {
  try {
    await mongo.connect(
      'mongodb+srv://ander:rootr00t!@todo-zjf0l.mongodb.net/test?retryWrites=true',
      { useNewUrlParser: true }
    );
    console.log('Runing on 3000...');
  } catch (err) {
    console.error(err);
  }
});
