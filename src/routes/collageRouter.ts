import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";

const router = Router();

router.post("college-register", async (req:Request, res:Response) => {
   
})

router.get("/collegs", async (req:Request, res:Response) => {
  try {
    
  } catch (error) {
    logger.error(error);
  }
})
export const collageRouter = router;