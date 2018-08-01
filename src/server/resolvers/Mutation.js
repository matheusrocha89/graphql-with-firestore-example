import omitBy from 'lodash/omitBy';

const createPost = async (parent, { authorId, title, content }, { db, pubsub }) => {
  try {
    const postToSave = {
      authorId,
      title,
      content,
    };

    const postRef = db.collection('posts').doc();
    await postRef.set(postToSave);
    const post = {
      id: postRef.id,
      ...postToSave,
    };

    pubsub.publish('postAdded', { postAdded: { ...post } });

    return post;
  } catch (e) {
    throw new Error(e.message);
  }
};

const updatePost = async (parent, { id, title = null, content = null }, { db }) => {
  try {
    const newPostValues = omitBy({ title, content }, value => !value);
    const docRef = db.collection('posts').doc(id);
    await docRef.update(newPostValues);
    const updatedPost = await db.collection('posts').doc(id).get();
    return {
      id,
      ...updatedPost.data(),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const deletePost = async (parent, { id }, { db }) => {
  try {
    const deletedPost = await db.collection('posts').doc(id).get();
    await db.collection('posts').doc(id).delete();
    return {
      id,
      ...deletedPost.data(),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const createAuthor = async (parent, { name }, { db }) => {
  try {
    const authorRef = db.collection('authors').doc();
    await authorRef.set({ name });
    return {
      id: authorRef.id,
      name,
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateAuthor = async (parent, { id, name }, { db }) => {
  try {
    const authorRef = db.collection('author').doc(id);
    await authorRef.update({ name });
    const updatedAuthor = db.collection('authors').doc(id).get();
    return {
      id,
      ...updatedAuthor.data(),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteAuthor = async (parent, { id }, { db }) => {
  try {
    await db.collection('authors').doc(id).delete();
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  createPost,
  updatePost,
  deletePost,

  createAuthor,
  updateAuthor,
  deleteAuthor,
};
