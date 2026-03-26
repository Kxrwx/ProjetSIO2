import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import getUser from "../controllers/admin/user";
import allSignalement  from "../controllers/admin/allSignalement"
import detailSignalement from "../controllers/admin/detailSignalement";
import isAuth from "../controllers/admin/isAuth";
import updateSignalement from "../controllers/admin/updateSignalement";
import createMessageAdmin from "../controllers/admin/createMessage";
import getMessageAdmin from "../controllers/admin/getMessage";
import getFileAdmin from "../controllers/admin/file/getFile";
import getLogController from "../controllers/admin/log/getLog";
import createLogFile from "../controllers/admin/log/createLogFile";

const route = express.Router();

route.get("/user", authenticate, getUser);

//signalement
route.get("/signalement", authenticate, allSignalement)
route.post("/signalement/detail", authenticate, detailSignalement)
route.post("/signalement/update", authenticate, updateSignalement)


//Message
route.post("/signalement/createMesssage", authenticate, createMessageAdmin)
route.post("/signalement/getMessage", authenticate, getMessageAdmin)

//s3
route.post("/signalement/file", authenticate, getFileAdmin)

//log
route.get("/log", authenticate, getLogController)
route.get("/createLog", authenticate, createLogFile)

route.get("", authenticate, isAuth)

export default route;