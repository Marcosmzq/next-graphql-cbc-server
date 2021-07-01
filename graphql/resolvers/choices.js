const { UserInputError, AuthenticationError } = require("apollo-server");
const MultipleChoice = require("../../models/MultipleChoice");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Mutation: {
    async addChoice(_, { choiceHeader, choiceStatus, exerciseId }, context) {
      try {
        const user = checkAuth(context);
        const errors = {};
        if (user.role === "admin") {
          if (choiceHeader.trim() === "" || choiceStatus === undefined) {
            errors.fields = "The form fields must not be empty.";
            throw new UserInputError("Errors", { errors });
          }
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          await exercise.choices.push({
            header: choiceHeader,
            status: choiceStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          const res = await exercise.save();
          return res;
        } else {
          errors.authentication = "Only admins can create new exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async editChoice(
      _,
      { newChoiceHeader, newChoiceStatus, exerciseId, choiceId },
      context
    ) {
      const user = checkAuth(context);
      const errors = {};
      try {
        if (user.role === "admin") {
          if (newChoiceHeader === undefined && newChoiceStatus == undefined) {
            errors.fields = "The form fields must not be empty.";
            throw new UserInputError("Errors", { errors });
          }
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          const choiceIndex = exercise.choices.findIndex(
            (c) => c.id === choiceId
          );
          if (choiceIndex === -1) {
            errors.general = "Choice not found.";
            throw new UserInputError("Choice not found.", { errors });
          }
          let previousHeader = exercise.choices[choiceIndex].header;
          let previousStatus = exercise.choices[choiceIndex].status;
          if (
            newChoiceHeader !== undefined &&
            newChoiceHeader.trim() !== "" &&
            newChoiceHeader !== previousHeader
          ) {
            previousHeader = newChoiceHeader;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          if (
            newChoiceStatus !== undefined &&
            newChoiceStatus !== previousStatus
          ) {
            previousStatus = newChoiceStatus;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          return exercise;
        } else {
          errors.authentication = "Only admins can edit exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteChoice(_, { exerciseId, choiceId }, context) {
      const user = checkAuth(context);
      const errors = {};
      try {
        if (user.role === "admin") {
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          const choiceIndex = exercise.choices.findIndex(
            (c) => c.id === choiceId
          );
          if (choiceIndex === -1) {
            errors.general = "Choice not found.";
            throw new UserInputError("Choice not found.", {
              errors,
            });
          }
          exercise.choices.splice(choiceIndex, 1);
          await exercise.save();
          return "Choice deleted succesfuly";
        } else {
          errors.authentication = "Only admins can delete exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
