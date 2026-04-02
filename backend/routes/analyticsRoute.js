import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import adminAuth from "../middleware/adminAuth.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/", adminAuth, getAnalytics);

export default analyticsRouter;
