import express from "express"
import createSignalement from "../controllers/signalement/creationSignalement"
import getSignalement from "../controllers/signalement/consultSignalement"
import createMessageNoAdmin from "../controllers/signalement/createMessage"
import getMessageNoAdmin from "../controllers/signalement/getMessage"
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const route = express.Router()

route.post("", createSignalement)

route.post("/consult", getSignalement)
route.post("/createSignalement", upload.array('fichiers', 5), createMessageNoAdmin)
route.post("/getMessage", getMessageNoAdmin)

export default route

