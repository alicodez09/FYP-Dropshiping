import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  create,
  deletejob,
  update,
  get,

} from "../controllers/jobController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create",
  // requireSignIn,
  // isAdmin,
  create
);

//update category
router.put(
  "/update/:id",
  // requireSignIn,
  // isAdmin,
  update
);

//getALl category
router.get("/get", get);

//single category

//delete category
router.delete(
  "/delete/:id",
  // requireSignIn,
  // isAdmin,
  deletejob
);

export default router;
