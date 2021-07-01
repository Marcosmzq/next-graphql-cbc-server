const { UserInputError, AuthenticationError } = require("apollo-server");
const MultipleChoice = require("../../models/MultipleChoice");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Mutation: {
    async addAnswerJustification(
      _,
      { ansJustHeader, ansJusStatus, exerciseId },
      context
    ) {
      try {
        const user = checkAuth(context);
        const errors = {};
        if (user.role === "admin") {
          if (ansJustHeader.trim() === "" || ansJusStatus === undefined) {
            errors.fields = "The form fields must not be empty.";
            throw new UserInputError("Errors", { errors });
          }
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          await exercise.answerJustifications.push({
            header: ansJustHeader,
            status: ansJusStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          await exercise.save();
          return exercise;
        } else {
          errors.authentication = "Only admins can create new exercises";
          throw new AuthenticationError("Authentication error", { errors });
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async editAnswerJustification(
      _,
      { newAnsJustHeader, newAnsJusStatus, exerciseId, answerJustificationId },
      context
    ) {
      const user = checkAuth(context);
      const errors = {};
      try {
        if (user.role === "admin") {
          if (newAnsJustHeader === undefined && newAnsJusStatus == undefined) {
            errors.fields = "The form fields must not be empty.";
            throw new UserInputError("Errors", { errors });
          }
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          const answerJustificationsIndex =
            exercise.answerJustifications.findIndex(
              (a) => a.id === answerJustificationId
            );
          if (answerJustificationsIndex === -1) {
            errors.general = "Answer justifications not found.";
            throw new UserInputError("Answer justifications not found.", {
              errors,
            });
          }
          let previousAnsJusHeader =
            exercise.answerJustifications[answerJustificationsIndex].header;
          let previousAnsJustStatus =
            exercise.answerJustifications[answerJustificationsIndex].status;
          if (
            newAnsJustHeader !== undefined &&
            newAnsJustHeader.trim() !== "" &&
            newAnsJustHeader !== previousAnsJusHeader
          ) {
            previousAnsJusHeader = newAnsJustHeader;
            exercise.updatedAt = new Date().toISOString();
            await exercise.save();
          }
          if (
            newAnsJusStatus !== undefined &&
            newAnsJusStatus !== previousAnsJustStatus
          ) {
            previousAnsJustStatus = newAnsJusStatus;
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
    async deleteAnswerJustification(
      _,
      { exerciseId, answerJustificationId },
      context
    ) {
      const user = checkAuth(context);
      const errors = {};
      try {
        if (user.role === "admin") {
          const exercise = await MultipleChoice.findById(exerciseId);
          if (!exercise) {
            errors.general = "Exercise not found.";
            throw new UserInputError("Exercise not found.", { errors });
          }
          const answerJustificationsIndex =
            exercise.answerJustifications.findIndex(
              (a) => a.id === answerJustificationId
            );
          if (answerJustificationsIndex === -1) {
            errors.general = "Answer justification not found.";
            throw new UserInputError("Answer justification not found.", {
              errors,
            });
          }
          exercise.answerJustifications.splice(answerJustificationsIndex, 1);
          await exercise.save();
          return "Answer justifications deleted succesfuly";
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
