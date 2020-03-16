const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const complexRoute = require('./complex.route');
const moduleRoute = require('./module.route');
const wsRoute = require('./ws.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/complexes', complexRoute);
router.use('/modules', moduleRoute);

// websocket routes [ change `/EMS` to `/ws` in the future ]
router.use('/EMS', wsRoute);

module.exports = router;

/**
 * @swagger
 * components:
 *    schemas:
 *      UserTransformed:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          username:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          role:
 *            type: string
 *
 *      Complex:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          address:
 *            type: string
 *          owner:
 *            type: string
 *
 *      Module:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          code:
 *            type: string
 *          complex:
 *            type: string
 *          district:
 *            type: string
 *          serialNumber:
 *            type: string
 *          lanMacAddress:
 *            type: string
 *          wifiMacAddress:
 *            type: string
 *          isSetup:
 *            type: boolean
 *          floorNames:
 *            type: array
 *            items:
 *              type: string
 *          elevators:
 *            type: array
 *            items:
 *              type: string
 *          lastSeenAt:
 *            type: string
 *          owner:
 *            type: string
 *
 *      Token:
 *        type: object
 *        properties:
 *          token:
 *            type: string
 *          expires:
 *            type: string
 *
 *    parameters:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    requestBodies:
 *    responses:
 *    headers:
 *    examples:
 *    links:
 *    callbacks:
 * security:
 * - bearerAuth: []
 * tags:
 * - name: Authentication
 *   description: login, register, password recovery, etc.
 * - name: Complex
 *   description: Complex model CRUD API.
 * - name: User
 *   description: User model CRUD API.
 * - name: Module
 *   description: Module model CRUD API.
 */
