# quave:testing

`quave:testing` is a Meteor package that allows you to test your Meteor app easily.
  
## Why
We want to hide the complexity of Meteor internals and other details that sometime is necessary to implement to be able to test properly.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).
  
## Installation

```sh
meteor add quave:testing
```

### Usage

#### mockMethodCall

- Mocked Meteor Method call so you can include context as `this`. The context should be your last argument in the call. See a few examples below.

```javascript
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

import { mockMethodCall } from "meteor/quave:testing";

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        TasksCollection.remove({});
        taskId = TasksCollection.insert({
          text: 'Test Task',
          createdAt: new Date(),
          userId,
        });
      });

      it(`can't delete task without an user authenticated`, () => {
        const fn = () => mockMethodCall('tasks.remove', taskId);
        assert.throw(fn, /Not authorized/);
        assert.equal(TasksCollection.find().count(), 1);
      });

      it('can delete owned task', () => {
        mockMethodCall('tasks.remove', taskId, { context: { userId } });

        assert.equal(TasksCollection.find().count(), 0);
      });

      it(`can't delete task from another owner`, () => {
        const fn = () =>
          mockMethodCall('tasks.remove', taskId, {
            context: { userId: 'somebody-else-id' },
          });
        assert.throw(fn, /Access denied/);
        assert.equal(TasksCollection.find().count(), 1);
      });

      it('can change the status of a task', () => {
        const originalTask = TasksCollection.findOne(taskId);
        mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
          context: { userId },
        });

        const updatedTask = TasksCollection.findOne(taskId);
        assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
      });

      it('can insert new tasks', () => {
        const text = 'New Task';
        mockMethodCall('tasks.insert', text, {
          context: { userId },
        });

        const tasks = TasksCollection.find({}).fetch();
        assert.equal(tasks.length, 2);
        assert.isTrue(tasks.some(task => task.text === text));
      });
    });
  });
}
```

### License

MIT
