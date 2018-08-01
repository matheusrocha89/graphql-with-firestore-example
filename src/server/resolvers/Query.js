const post = async (parent, { id }, { db }) => {
  try {
    const docPost = await db.collection('posts').doc(id).get();
    return {
      id,
      ...docPost.data(),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const feed = async (parent, args, { db }) => {
  try {
    const snapshot = await db.collection('posts').get();
    const allPosts = [];
    snapshot.forEach(doc => allPosts.push({ id: doc.id, ...doc.data() }));
    return allPosts;
  } catch (e) {
    throw new Error(e.message);
  }
};

const author = async (parent, { id }, { db }) => {
  try {
    const docAuthor = await db.collection('authors').doc(id).get();
    const docPosts = await db.collection('posts').where('postedId', '==', id).get();
    const authorPosts = [];

    docPosts.forEach(doc => authorPosts.push({ id: doc.id, ...doc.data() }));

    return { id, ...docAuthor.data(), authorPosts };
  } catch (e) {
    throw new Error(e.message);
  }
};

const authors = async (parent, args, { db }) => {
  try {
    const snapshot = await db.collection('authors').get();
    const allAuthors = [];
    await Promise.all(snapshot.docs.map(async (doc) => {
      const postsSnapshot = await db.collection('posts').where('authorId', '==', doc.id).get();
      const allPosts = [];
      postsSnapshot.forEach(postDoc => allPosts.push(({ id: postDoc.id, ...postDoc.data() })));

      allAuthors.push({ id: doc.id, ...doc.data(), posts: allPosts });
    }));

    return allAuthors;
  } catch (e) {
    throw new Error(e.message);
  }
};

const postsFromAuthor = async (parent, { authorId }, { db }) => {
  try {
    const docPosts = await db.collection('posts').where('authorId', '==', authorId).get();
    const posts = docPosts.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  post,
  feed,
  author,
  authors,
  postsFromAuthor,
};
