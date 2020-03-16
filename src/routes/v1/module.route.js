const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { moduleValidation } = require('../../validations');
const { moduleController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 *
 * /modules/:
 *   post:
 *     tags:
 *      - Module
 *     description: Create a module
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: module description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: string
 *                  complex:
 *                    type: string
 *                  district:
 *                    type: string
 *                  serialNumber:
 *                    type: string
 *                  lanMacAddress:
 *                    type: string
 *                  wifiMacAddress:
 *                    type: string
 *                  floorNames:
 *                    type: array
 *                    items:
 *                      type: string
 *                  owner:
 *                    type: string
 *
 *     responses:
 *       200:
 *         description: Module
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *
 *   get:
 *     tags:
 *      - Module
 *     description: Get list of modules
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
router
  .route('/')
  .post(auth('manageModules'), validate(moduleValidation.createModule), moduleController.createModule)
  .get(auth('getModules'), validate(moduleValidation.getModules), moduleController.getModules);

/**
 * @swagger
 *
 * /modules/{moduleId}:
 *   get:
 *     tags:
 *      - Module
 *     description: Get module by id
 *     security:
 *     - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the module to get
 *     responses:
 *       200:
 *         description: List of modules
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *
 *   patch:
 *     tags:
 *      - Module
 *     description: Update module
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the module to update
 *     requestBody:
 *         description: module description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: string
 *                  complex:
 *                    type: string
 *                  district:
 *                    type: string
 *                  serialNumber:
 *                    type: string
 *                  lanMacAddress:
 *                    type: string
 *                  wifiMacAddress:
 *                    type: string
 *                  floorNames:
 *                    type: array
 *                    items:
 *                      type: string
 *                  owner:
 *                    type: string
 *     responses:
 *       200:
 *         description: Module
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *
 *   delete:
 *     tags:
 *      - Module
 *     description: Delete module by id
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the module to get
 *     responses:
 *       204:
 *         description: Empty response.
 */
router
  .route('/:moduleId')
  .get(auth('getModules', '$owner'), validate(moduleValidation.getModule), moduleController.getModule)
  .patch(auth('manageModules'), validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(auth('manageModules'), validate(moduleValidation.deleteModule), moduleController.deleteModule);

module.exports = router;
