import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";

const router = Router();

router.post("/club", async (req:Request, res:Response) => {
//    need tocreate a club 
    try {
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error creating club"
        })
    }
})

//query korbo, params na , tahole id , name , duto diye e khoja jabe 
router.get("/club/:id", async (req:Request, res:Response) => {
  try {
    
  } catch (error) {
    logger.error(error);
  }
})
export const clubRouter = router;