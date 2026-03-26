import express from "express"
import createSignalement from "../controllers/signalement/creationSignalement"
import getSignalement from "../controllers/signalement/consultSignalement"
import createMessageNoAdmin from "../controllers/signalement/createMessage"
import multer from "multer";
import getFileNoAdmin from "../controllers/admin/file/getFile"

const upload = multer({ storage: multer.memoryStorage() });

const route = express.Router()

route.post("", upload.array('fichiers', 5),createSignalement)

route.post("/consult", getSignalement)
route.post("/createMessage", createMessageNoAdmin)

route.post("/file", getFileNoAdmin)

export default route

