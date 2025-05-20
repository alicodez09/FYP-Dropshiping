import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createFaqController,
  deleteFaqController,
  faqsController,
  singleFaqController,
  updateFaqController,
} from "../controllers/faqsController.js";

const router = express.Router();

// Routes
router.post("/create-faq", createFaqController);
router.put("/update-faq/:slug", updateFaqController);
router.get("/get-faq", faqsController);
router.get("/single-faq/:slug", singleFaqController);
router.delete("/delete-faq/:id", deleteFaqController);

export default router;
