import express from 'express';
import {
  getAllFoodsByRestaurant,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getAllFoodsByRestaurant);
router.get('/:foodId', getFoodItem);
router.post('/', createFoodItem);
router.put('/:foodId', updateFoodItem);
router.delete('/:foodId', deleteFoodItem);

export default router;
