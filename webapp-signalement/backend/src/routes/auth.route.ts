import express from "express"
import signin from "../controllers/auth/signin"
import logout  from "../controllers/auth/logout";
import { authenticate } from "../middleware/auth.middleware";

const route = express.Router()

route.post("/signin", signin)

route.post("/logout", authenticate, logout)

export default route