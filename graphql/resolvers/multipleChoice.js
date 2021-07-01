const { UserInputError, AuthenticationError } = require("apollo-server");
const MultipleChoice = require("../../models/MultipleChoice");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    async getMultipleChoiceBySubject(_, { subject }) {
      try {
        const multipleChoiceExercises = await MultipleChoice.find({
          subject,
        });
        return multipleChoiceExercises;
      } catch (err) {
        console.error(err);
      }
    },
    async getMultipleChoiceBySubjectAndExam(_, { subject, exam }) {
      try {
        const multipleChoiceExercises = await MultipleChoice.find({
          subject,
          exam,
        }).sort({
          createdAt: -1,
        });
        return multipleChoiceExercises;
      } catch (err) {
        console.error(err);
      }
    },
    async getAllMultipleChoiceExercises() {
      try {
        const multipleChoiceExercises = await MultipleChoice.find().sort({
          createdAt: -1,
        });
        return multipleChoiceExercises;
      } catch (err) {
        console.error(err);
      }
    },
    async getMultipleChoice(_, { id }) {
      try {
        const multipleChoiceExercise = await MultipleChoice.findById(id);
        return multipleChoiceExercise;
      } catch (err) {
        console.error(err);
      }
    },
  },
  Mutation: {
    async createMultipleChoiceExercise(_, { header, exam, subject }, context) {
      try {
        const user = checkAuth(context);
        const errors = {};
        if (
          header.trim() === "" ||
          exam == undefined ||
          subject.trim() === ""
        ) {
          errors.fields = "The form fields must not be empty.";
          throw new UserInputError("Errors", { errors });
        }
        const newMultipleChoiceExercise = new MultipleChoice({
          header,
          exam,
          subject,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (user.role === "admin") {
          const res = await newMultipleChoiceExercise.save();
          return res;
        } else {
          errors.authentication = "Only admins can create new exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async deleteMultipleChoiceExercise(_, { exerciseId }, context) {
      try {
        const user = checkAuth(context);
        const errors = {};
        if (user.role === "admin") {
          //Check if the exercise exists
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          await exercise.delete();
          return "The exercise was deleted succesfuly";
        } else {
          errors.authentication = "Only admins can delete exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        console.error(err);
      }
    },
    async editMultipleChoiceExercise(
      _,
      { header, exam, exerciseId, subject },
      context
    ) {
      try {
        const user = checkAuth(context);
        const errors = {};
        if (user.role === "admin") {
          if (
            header === undefined &&
            exam === undefined &&
            subject === undefined
          ) {
            errors.fields = "The form fields must not be empty.";
            throw new UserInputError("Errors", { errors });
          }
          //Check if the exercise exists
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          if (
            header !== undefined &&
            header.trim() !== "" &&
            header !== exercise.header
          ) {
            exercise.header = header;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          if (
            subject !== undefined &&
            subject.trim() !== "" &&
            subject !== exercise.subject
          ) {
            exercise.subject = subject;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          if (exam !== undefined && exam !== exercise.exam) {
            exercise.exam = exam;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          return exercise;
        } else {
          errors.authentication = "Only admins can create new exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
