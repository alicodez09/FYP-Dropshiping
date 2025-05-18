import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createFeatureController,
  deleteFeatureCOntroller,
  featureController,
  singleFeatureController,
  updateFeatureController,
} from "../controllers/featuresController.js";

const router = express.Router();

//routes
// create category
router.post("/create-feature", requireSignIn, isAdmin, createFeatureController);

//update category
router.put(
  "/update-feature/:id",
  requireSignIn,
  isAdmin,
  updateFeatureController
);

//getALl category
router.get("/get-features", featureController);

//single category
router.get("/single-feature/:slug", singleFeatureController);

//delete category
router.delete(
  "/delete-feature/:id",
  requireSignIn,
  isAdmin,
  deleteFeatureCOntroller
);

export default router;
