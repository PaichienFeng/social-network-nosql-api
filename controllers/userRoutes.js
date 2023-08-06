const { User, Thought } = require('../models');
const router = require('express').Router();

// Get a single user
router.get('/users/:userId', async (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('thoughts')
    .populate('friends')
    .then(async (user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json({
          user,
        })
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// Get all users
router.get('/users', async (req, res) => {
  User.find()
    .then(async (users) => {
      const userObj = {
        users,
      };
      return res.json(userObj);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// create a new user
router.post('/users', async (req, res) => {
  User.create({
    username,
    email,
  })
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
})

// update an user by id
router.put('/users/:userId', async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
      }
    },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
})

// Delete a user and remove them from the thought
router.put('/users/:userId', async (req, res) => {
  User.findOneAndRemove({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No such user exists' })
        : Thought.findOneAndUpdate(
          { username: req.params.userId },
          { $pull: { username: req.params.userId } },
          { new: true }
        )
    )
    .then((thought) =>
      !thought
        ? res.status(404).json({
          message: 'User deleted, but no thought found',
        })
        : res.json({ message: 'User successfully deleted' })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}),








//   // Add an assignment to a student
//   addAssignment(req, res) {
//   console.log('You are adding an assignment');
//   console.log(req.body);
//   Student.findOneAndUpdate(
//     { _id: req.params.studentId },
//     { $addToSet: { assignments: req.body } },
//     { runValidators: true, new: true }
//   )
//     .then((student) =>
//       !student
//         ? res
//           .status(404)
//           .json({ message: 'No student found with that ID :(' })
//         : res.json(student)
//     )
//     .catch((err) => res.status(500).json(err));
// },
// // Remove assignment from a student
// removeAssignment(req, res) {
//   Student.findOneAndUpdate(
//     { _id: req.params.studentId },
//     { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
//     { runValidators: true, new: true }
//   )
//     .then((student) =>
//       !student
//         ? res
//           .status(404)
//           .json({ message: 'No student found with that ID :(' })
//         : res.json(student)
//     )
//     .catch((err) => res.status(500).json(err));
// }

