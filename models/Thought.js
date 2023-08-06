const { Schema, model, Types} = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

reactionSchema.virtual('formattedTime').get(function(){
  return dayjs(this.createdAt).format('DDDD MM, YYYY')
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength:1,
      maxlength:280,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'reaction'
      }
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual('formattedTime').get(function(){
  return dayjs(this.createdAt).format('DDDD MM, YYYY')
});

thoughtSchema.virtual('reactionCount').get(function(){
  return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
