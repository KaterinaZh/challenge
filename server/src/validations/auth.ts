import { check } from 'express-validator';
import { CodewarsApi } from '../utils/codewars-api';

const cwApi = new CodewarsApi();

export const adminLoginValidation = [
  check('username')
    .trim()
    .exists()
    .notEmpty()
    .withMessage('Correct username is required'),
  check('password')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Password is required'),
];

export const userRegisterValidation = [
  check('firstName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Firstname is required field'),
  check('lastName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Lastname is required field'),
  check('telescope_link')
    .trim()
    .notEmpty()
    .withMessage('Telescope link is required field')
    .isURL()
    .withMessage('Telescope link should have URL Format'),
  check('codewars_username')
    .trim()
    .notEmpty()
    .withMessage('CodeWars username is required field')
    .custom(cwApi.ValidateUsernameIsExistInCodeWars),
];
