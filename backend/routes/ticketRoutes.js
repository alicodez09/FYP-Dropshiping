import express from "express";
import {
  create,
  deletejob,
  update,
  get,
  getTickets,
  updateeTickets

} from "../controllers/jobController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create",

  create
);

//update category
router.put(
  "/update/:id",

  update
);
router.get("/get-ticketes", getTickets);
router.put("/update-ticket/:id", updateeTickets);




//getALl category
router.get("/get", get);

//single category

//delete category
router.delete(
  "/delete/:id",

  deletejob
);

export default router;
