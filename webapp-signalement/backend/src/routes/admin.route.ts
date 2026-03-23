import express, { Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import getUser from "../controllers/admin/user";
import allSignalement  from "../controllers/admin/AllSignalement"

const route = express.Router();

route.get("/user", authenticate, getUser);
route.get("/signalement", authenticate, allSignalement)
route.post("/signalement/detail", authenticate)

export default route;