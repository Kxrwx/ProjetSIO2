import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import getUser from "../controllers/admin/user";
import allSignalement  from "../controllers/admin/allSignalement"
import detailSignalement from "../controllers/admin/detailSignalement";
import isAuth from "../controllers/admin/isAuth";
import updateSignalement from "../controllers/admin/updateSignalement";

const route = express.Router();

route.get("/user", authenticate, getUser);
route.get("/signalement", authenticate, allSignalement)
route.post("/signalement/detail", authenticate, detailSignalement)
route.post("/signalement/update", authenticate, updateSignalement)
route.post("/signalement/createMesssage", authenticate, )




route.get("", authenticate, isAuth)

export default route;