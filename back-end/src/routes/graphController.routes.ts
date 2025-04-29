// routes/graphRoutes.js

const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

/**
 * @route GET /api/graphs
 * @desc Obtém dados para três gráficos distintos
 * @access Public
 */
router.get('/', graphController.getGraphData.bind(graphController));

/**
 * @route POST /api/graphs
 * @desc Atualiza dados para três gráficos distintos
 * @access Public
 * @body {
 *   value1: number,
 *   value2: number,
 *   value3: number
 * }
 */
router.post('/', graphController.updateGraphData.bind(graphController));

export default router;