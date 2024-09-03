import { ObjectId } from "mongodb";
import crypto from "crypto";

type ValidationError = {
  [key: string]: string;
};

const minFirstNameLength = 2;
const minPasswordLength = 7;

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

const isEmailValid = (email: string): boolean => {
  const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

export const Validate = (c: CreateUserParams): ValidationError => {
  const errors: ValidationError = {};

  if (c.name.length < minFirstNameLength) {
    errors.name = `Name should be at least ${minFirstNameLength} characters`;
  }
  if (c.password.length < minPasswordLength) {
    errors.password = `Password should be at least ${minPasswordLength} characters`;
  }
  if (!isEmailValid(c.email)) {
    errors.email = `Email ${c.email} is invalid`;
  }

  return errors;
};

export interface User {
  id: ObjectId;
  name: string;
  email: string;
  encryptedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  IsAdmin: boolean;
}

const hashPassword = (password: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

export const NewUserFromParameaters = (user: CreateUserParams): User => {
  const hashedPassword = hashPassword(user.password);
  return {
    id: new ObjectId(),
    name: user.name,
    email: user.email,
    encryptedPassword: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    IsAdmin: false,
  };
};

export const IsValidPassword = (
  password: string,
  encryptedPassword: string
): boolean => {
  return hashPassword(password) === encryptedPassword;
};
