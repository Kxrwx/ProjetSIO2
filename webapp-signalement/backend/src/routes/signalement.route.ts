import express from "express"
import createSignalement from "../controllers/signalement/creationSignalement"
import getSignalement from "../controllers/signalement/consultSignalement"
import createMessageNoAdmin from "../controllers/signalement/createMessage"

const route = express.Router()

route.post("", createSignalement)

route.post("/consult", getSignalement)
route.post("/createSignalement", createMessageNoAdmin)

export default route

