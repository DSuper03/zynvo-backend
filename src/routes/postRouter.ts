import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";

const router = Router();


router.post("/create", async (req:Request, res:Response) => {
    const { title, body } = req.body;
    try {
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error creating post"
        })
        
    }

})

router.put("/edit/:id", async (req:Request, res:Response) => {

      try {
        
      } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error editing post"
        })
        
      }
})

router.get("/all", async (req:Request, res:Response) => {
    try {
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error getting posts"
        })
        
    }

})
router.get("/get/:id", async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error getting post"
        })
        
    }

})
router.delete("/delete/:id", async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error deleting post"
        })
    }
})

//create
//delete 
// edt (put)
//get all
// get with Id

export const postRouter = router;