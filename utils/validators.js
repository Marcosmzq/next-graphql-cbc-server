const validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "The username must not be empty.";
  }
  if (email.trim() === "") {
    errors.email = "The email must not be empty.";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = "The email is not valid.";
    }
  }

  if (password === "") {
    errors.password = "The password must not be empty.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "The passwords must be match.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "The username must not be empty.";
  }
  if (password.trim() === "") {
    errors.password = "The email must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
