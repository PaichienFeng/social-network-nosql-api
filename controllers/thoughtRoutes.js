const router = require('express').Router();
const { User, Thought } = require('../models');
const { ObjectId } = require('mongoose').Types;


// Get all thoughts
router.get('/thoughts', async (req, res) => {
  Thought.find()
    .then(async (thoughts) => {
      const thoughtObj = {
        thoughts,
      };
      return res.json(thoughtObj);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// Get a single thought
router.get('/thoughts/:thoughtId', async (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate('username')
    .populate('reactions')
    .then(async (thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json({
          thought,
        })
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// Create a thought
router.post('/thoughts', async (req, res) => {
  console.log('nono');

  Thought.create({
    thoughtText: req.body.thoughtText,
    username: req.body.username,
    userId: ObjectId(req.body.userId),
    reactions: req.body.reactions,
  })
    .then((thought) => {
      console.log('haah');
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      )
        .then((user) => res.json({ thought, user }))
        .catch((err) => res.status(500).json(err));
    })

    .catch((err) => res.status(500).json(err));
})


// update a thought by id
router.put('/thoughts/:thoughtId', async (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    {
      $set: {
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.body.userId,
        reactions: req.body.reactions,
      }
    },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
})



// Delete a thought
router.delete('/thoughts/:thoughtId', async (req, res) => {
  Thought.findOneAndRemove({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No such thought exists' })
        : User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
          message: 'Thought deleted, but no user found',
        })
        : res.json({ message: 'Thought successfully deleted' })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

// Add an reaction to a thought
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  console.log('You are adding a reaction');
  console.log(req.body);
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    {
      $addToSet: {
        reactions: {
          reactionBody: req.body.reactionBody,
          username: req.body.username,
        }
      }
    },
    { runValidators: true, new: true }
  )
    .then((reaction) =>
      !reaction
        ? res
          .status(404)
          .json({ message: 'No reaction found with that ID :(' })
        : res.json(reaction)
    )
    .catch((err) => res.status(500).json(err));
})


  // Delete a reaction to a thought
  router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    console.log('You are adding a reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { 
        reactions: {
          reactionId: req.params.reactionId
        } 
       } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res
            .status(404)
            .json({ message: 'No reaction found with that ID :(' })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  })

  
module.exports = router;