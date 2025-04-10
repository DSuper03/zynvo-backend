import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";
import prisma from "../db/db";
import { ClubSchema } from "../types/formtypes";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.use(AuthMiddleware)

router.post("/club", async (req:Request, res:Response) => {
//include pfp later
const { name , collegeName, description} = req.body
const parsedData = ClubSchema.safeParse(req.body)

if(!parsedData.success) {
  res.json({
    msg : "wrong format for creating a club"
  })
}
    try {
        // they can still bypass this by changing the casing of characters, Validate the names of club in lowerCase
        //cannot make changes in database for this 
        const findClub = await prisma.clubs.findFirst({
          where : {
            collegeName : collegeName as string
          },
          select : {
            name : true
          }
        })

        if(findClub?.name == name) {
          res.json({
            msg : "the club of this name already exists in your college, delete that or create a new club"
          })
        }

        const response = await prisma.clubs.create({
          data : {
            name : parsedData.data?.name as string,
            collegeName : parsedData.data?.collegeName as string,
            description : parsedData.data?.description as string || ""
          }
        })

        if(!response) {
          res.json({
            msg  : "error in forming a club, please try again later"
          })
        }

        res.status(200).json({
          msg : "club formed!",
          clubId : response.id
        })

    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "error creating club"
        })
    }
})

//query korbo, params na , tahole id , name , collegeName diye o khoja jabe 
router.get("/club", async (req:Request, res:Response) => {
  const id = req.query.id
  const name = req.query.name
  const collegeName = req.query.collegeName
  try {
    if(id) {
      const response = await prisma.clubs.findFirst({
        where : {
          id : id as string
        } , 
        select : {
          id : true, 
          name : true, 
          collegeName : true, 
          description : true,
          // add profile pic later
        }
      })

      if(!response) {
        res.json({
          msg : "no such club"
        })
      }

      res.status(200).json({
        msg : "club found", 
        response
      })


    }  else if(name) {

      const response = await prisma.clubs.findMany({
        where : {
         name : name as string
        } , 
        select : {
          id : true, 
          name : true, 
          collegeName : true, 
          description : true,
          // add profile pic later
        }
      })

      if(!response) {
        res.json({
          msg : "no such club"
        })
      }

      res.status(200).json({
        msg : "clubs found, add college filter to sort out", 
        response
      })
    } else if (name && collegeName) {
      const response = await prisma.clubs.findFirst({
        where : {
         name : name as string,
         collegeName : collegeName as string
        } , 
        select : {
          id : true, 
          name : true, 
          collegeName : true, 
          description : true,
          // add profile pic later
        }
      })

      if(!response) {
        res.json({
          msg : "no such club"
        })
      }

      res.status(200).json({
        msg : "clubs found", 
        response
      })
    }    
  } catch (error) {
    logger.error(error);
  }
})
export const clubRouter = router;