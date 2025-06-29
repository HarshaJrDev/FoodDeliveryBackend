const express = require('express');
const {
  getAllFoodsByRestaurant,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodcontroller');

const router = express.Router({ mergeParams: true });

router.get('/', getAllFoodsByRestaurant);
router.get('/:foodId', getFoodItem);
router.post('/', createFoodItem);
router.put('/:foodId', updateFoodItem);
router.delete('/:foodId', deleteFoodItem);

module.exports = router;
