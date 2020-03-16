const express = require('express');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Register a user
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
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTransformed'
 */
router.post('/register', validate(authValidation.register), authController.register);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Login a user
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: login credentials.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserTransformed'
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       $ref: '#/components/schemas/Token'
 *                     refresh:
 *                       $ref: '#/components/schemas/Token'
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 *
 * /auth/refresh-tokens:
 *   post:
 *     tags:
 *      - Authentication
 *     description: Refresh JWT token
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: login credentials.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  refreshToken:
 *                    type: string
 *     responses:
 *       200:
 *         description: Tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   $ref: '#/components/schemas/Token'
 *                 refresh:
 *                   $ref: '#/components/schemas/Token'
 */
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

/**
 * @swagger
 *
 * /auth/forgot-password:
 *   post:
 *     tags:
 *      - Authentication
 *     description: send reset-password link to users email.
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: email address of the user.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *     responses:
 *       204:
 *         description: no content
 */
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);

/**
 * @swagger
 *
 * /auth/reset-password:
 *   post:
 *     tags:
 *      - Authentication
 *     description: reset password link.
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: new password.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  password:
 *                    type: string
 *     responses:
 *       204:
 *         description: no content
 */
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
