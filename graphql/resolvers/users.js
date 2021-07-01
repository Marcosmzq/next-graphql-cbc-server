const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
const generateToken = require("../../utils/generateToken");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //Format the username
      username = username.toLowerCase();
      //Check if the username exists.
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found.", { errors });
      }
      //Check if the password is correct.
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        errors.general = "Wrong crendetials.";
        throw new UserInputError("Wrong crendetials.", { errors });
      }
      //Generate token with the user data.
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user.id,
        username: user.username,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //Check that the data is valid.
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //Check that the email entered does not exist.
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new UserInputError("The email is taken.", {
          errors: {
            email: "The email is taken.",
          },
        });
      }
      //Check that the username entered does not exist.
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("The username is taken.", {
          errors: {
            username: "The username is taken.",
          },
        });
      }
      //Format the username
      username = username.toLowerCase();
      //Encrypt the password
      password = await bcrypt.hash(password, 12);
      //Save the user dates in a constant.
      const newUser = new User({
        email,
        username,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      //Save the user in the DB.
      const res = await newUser.save();
      //Generate a token with the user.
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res.id,
        username: res.username,
        token,
      };
    },
  },
};
