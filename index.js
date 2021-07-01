const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });
  await mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB is connected!");
  const PORT = process.env.PORT || 6000;
  await server.listen(PORT);
  console.log(`Server is listening on port ${PORT}`);
};

main().catch((err) => {
  console.error(err);
});
