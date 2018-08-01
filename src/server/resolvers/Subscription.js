const postAddedSubscribe = (parent, args, { pubsub }) => pubsub.asyncIterator('postAdded');

const postAdded = {
  subscribe: postAddedSubscribe,
};

export default {
  postAdded,
};
