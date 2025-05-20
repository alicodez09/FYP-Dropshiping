import { Router } from "express";
import { Create, Get, Update, Delete } from "../controllers/newsfeedController.js";

const router = Router();

router.post("/create", Create);
router.get("/get", Get);
router.put("/update/:id", Update);
router.delete("/delete/:id", Delete);

export default router;
