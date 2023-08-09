const router = require('express').Router();
const { User, Thought } = require('../models');

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
 
      return res.json(users);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// create a new user
router.post('/users', async (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    thoughts: req.body.thoughts,
    friends: req.body.friends,
  })
    .then((user) => res.json(user))
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
})

// update an user by id
router.put('/users/:userId', async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        thoughts: req.body.thoughts,
        friends: req.body.friends,
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
router.delete('/users/:userId', async (req, res) => {
  User.findOneAndRemove({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No such user exists' })
        : Thought.deleteMany(
          { userId: req.params.userId }
        )
    )
    .then((thought) =>
      !thought.deletedCount
        ? res.status(200).json({
          message: 'User deleted with no thought found',
        })
        : res.json({ message: 'User successfully deleted' })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

// Add a friend to a user
router.post('/users/:userId/friends/:friendId', async (req, res) => {
  console.log('You are adding a friend');
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $addToSet: {
        friends: req.params.friendId
      }
    },
    { runValidators: true, new: true }
  )
    .then((friend) =>
      !friend
        ? res
          .status(404)
          .json({ message: 'No friend found with that ID :(' })
        : res.json(friend)
    )
    .catch((err) => res.status(500).json(err));
})


// Delete a friend to a user
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
  console.log('You are adding a friend');
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $pull: {
        friends: req.params.friendId
      }
    },
    { runValidators: true, new: true }
  )
    .then((friend) =>
      !friend
        ? res
          .status(404)
          .json({ message: 'No friend found with that ID :(' })
        : res.json(friend)
    )
    .catch((err) => res.status(500).json(err));
})

module.exports = router;