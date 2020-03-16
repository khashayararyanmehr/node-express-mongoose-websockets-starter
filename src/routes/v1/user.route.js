const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 *
 * /users/:
 *   post:
 *     tags:
 *      - User
 *     description: Create a user
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: user description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  name:
 *                    type: string
 *                  email:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  password:
 *                    type: string
 *                  complex:
 *                    type: string
 *                  role:
 *                    type: string
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTransformed'
 *
 *   get:
 *     tags:
 *      - User
 *     description: Get list of users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserTransformed'
 */
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     tags:
 *      - User
 *     description: Get user by id
 *     security:
 *     - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user to get
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTransformed'
 *
 *   patch:
 *     tags:
 *      - User
 *     description: Update user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user to update
 *     requestBody:
 *         description: user description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  name:
 *                    type: string
 *                  email:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  password:
 *                    type: string
 *                  complex:
 *                    type: string
 *                  role:
 *                    type: string
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTransformed'
 *
 *   delete:
 *     tags:
 *      - User
 *     description: Delete user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the user to get
 *     responses:
 *       204:
 *         description: Empty response.
 */
router
  .route('/:userId')
  .get(auth('getUsers', '$owner'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
