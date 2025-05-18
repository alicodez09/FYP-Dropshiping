import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

import {
  createIntegrationController,
  deleteIntegrationCOntroller,
  integrationController,
  singleIntegrationController,
  updateIntegrationController,
} from "../controllers/integrationsController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-integration",
  requireSignIn,
  isAdmin,
  createIntegrationController
);

//update category
router.put(
  "/update-integration/:id",
  requireSignIn,
  isAdmin,
  updateIntegrationController
);

//getALl category
router.get("/get-integrations", integrationController);

//single category
router.get("/single-integration/:slug", singleIntegrationController);

//delete category
router.delete(
  "/delete-integration/:id",
  requireSignIn,
  isAdmin,
  deleteIntegrationCOntroller
);

export default router;
