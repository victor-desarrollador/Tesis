import exprees from "express";
import { registerUser } from "../controllers/authController.js";

const router = exprees.Router();

//login route

// register route

router.post("/register", registerUser);


//router.get("/login", (req, res) => {
//    res.send("Login is working");
//});


export default router;