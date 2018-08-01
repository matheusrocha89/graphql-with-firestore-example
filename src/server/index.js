import { GraphQLServer, PubSub } from 'graphql-yoga';
import Admin from 'firebase-admin';

import Mutation from './resolvers/Mutation';
import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';
// Import here your firestore credentials
// import credential from './firestore-credentials.json';

Admin.initializeApp({ credential: Admin.credential.cert(credential) });
const db = Admin.firestore();
db.settings({ timestampsInSnapshots: true });

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: './src/server/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db,
    pubsub,
  }),
});

server.start(() => console.log('server running on port 4000'));
