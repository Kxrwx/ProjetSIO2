import express from "express"
import createSignalement from "../controllers/signalement/creationSignalement"
import getSignalement from "../controllers/signalement/consultSignalement"

const route = express.Router()

route.post("", createSignalement)

route.post("/consult", getSignalement)

export default route

