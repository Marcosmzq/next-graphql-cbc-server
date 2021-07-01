const { gql } = require("apollo-server");

module.exports = gql`
  type answerJustifications {
    id: ID!
    header: String!
    status: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Choice {
    id: ID!
    header: String!
    status: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type MultipleChoice {
    id: ID!
    exam: Int!
    subject: String!
    header: String!
    choices: [Choice]!
    answerJustifications: [answerJustifications]!
    updatedAt: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
    role: String!
  }
  type Query {
    sayHi: String!
    getAllMultipleChoiceExercises: [MultipleChoice]!
    getMultipleChoice(id: ID!): MultipleChoice!
    getMultipleChoiceBySubject(subject: String!): [MultipleChoice]!
    getMultipleChoiceBySubjectAndExam(
      exam: Int!
      subject: String!
    ): [MultipleChoice]!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createMultipleChoiceExercise(
      header: String!
      exam: Int!
      subject: String!
    ): MultipleChoice!
    addAnswerJustification(
      exerciseId: ID!
      ansJustHeader: String!
      ansJusStatus: Boolean!
    ): MultipleChoice!
    addChoice(
      exerciseId: ID!
      choiceHeader: String!
      choiceStatus: Boolean!
    ): MultipleChoice!
    editMultipleChoiceExercise(
      exerciseId: ID!
      header: String
      exam: Int
      subject: String
    ): MultipleChoice!
    editChoice(
      exerciseId: ID!
      choiceId: ID!
      newChoiceHeader: String
      newChoiceStatus: Boolean
    ): MultipleChoice!
    editAnswerJustification(
      exerciseId: ID!
      answerJustificationId: ID!
      newAnsJustHeader: String
      newAnsJusStatus: Boolean
    ): MultipleChoice!
    deleteMultipleChoiceExercise(exerciseId: ID!): String!
    deleteChoice(exerciseId: ID!, choiceId: ID!): String!
    deleteAnswerJustification(
      exerciseId: ID!
      answerJustificationId: ID!
    ): String!
  }
`;
