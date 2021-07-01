const usersResolvers = require("./users");
const multipleChoiceResolvers = require("./multipleChoice");
const choicesResolvers = require("./choices");
const answerJustificationsResolver = require("./answerJustifactions");

module.exports = {
  Query: {
    sayHi: () => "Hi world from GraphQL!",
    ...usersResolvers.Query,
    ...multipleChoiceResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...multipleChoiceResolvers.Mutation,
    ...choicesResolvers.Mutation,
    ...answerJustificationsResolver.Mutation,
  },
};
