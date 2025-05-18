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
router.post("/create-faq", requireSignIn, isAdmin, createFaqController);
router.put("/update-faq/:slug", requireSignIn, isAdmin, updateFaqController);
router.get("/get-faqs", faqsController);
router.get("/single-faq/:slug", singleFaqController);
router.delete("/delete-faq/:id", requireSignIn, isAdmin, deleteFaqController);

export default router;
