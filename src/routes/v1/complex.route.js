const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { complexValidation } = require('../../validations');
const { complexController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 *
 * /complexes/:
 *   post:
 *     tags:
 *      - Complex
 *     description: Create a complex
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: complex description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  address:
 *                    type: string
 *                  owner:
 *                    type: string
 *     responses:
 *       200:
 *         description: Complex
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Complex'
 *
 *   get:
 *     tags:
 *      - Complex
 *     description: Get list of complexes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of complexes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Complex'
 */
router
  .route('/')
  .post(auth('manageComplexes'), validate(complexValidation.createComplex), complexController.createComplex)
  .get(auth('getComplexes'), validate(complexValidation.getComplexes), complexController.getComplexes);

/**
 * @swagger
 *
 * /complexes/{complexId}:
 *   get:
 *     tags:
 *      - Complex
 *     description: Get complex by id
 *     security:
 *     - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: complexId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the complex to get
 *     responses:
 *       200:
 *         description: List of complexes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Complex'
 *
 *   patch:
 *     tags:
 *      - Complex
 *     description: Update complex
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: complexId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the complex to update
 *     requestBody:
 *         description: complex description.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  address:
 *                    type: string
 *                  owner:
 *                    type: string
 *     responses:
 *       200:
 *         description: Complex
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Complex'
 *
 *   delete:
 *     tags:
 *      - Complex
 *     description: Delete complex by id
 *     parameters:
 *       - in: path
 *         name: complexId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the complex to get
 *     responses:
 *       204:
 *         description: Empty response.
 */
router
  .route('/:complexId')
  .get(auth('getComplexes', '$owner'), validate(complexValidation.getComplex), complexController.getComplex)
  .patch(auth('manageComplexes'), validate(complexValidation.updateComplex), complexController.updateComplex)
  .delete(auth('manageComplexes'), validate(complexValidation.deleteComplex), complexController.deleteComplex);

module.exports = router;
