//tested
import { Request, Response, Router } from "express";
import { logger } from "../utils/logger";
import prisma from "../db/db";
import { ClubSchema } from "../types/formtypes";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const router = Router();
const Verification = (req:Request, res:Response) => {
  if(!req.isVerified) {
    res.status(400).json({
      msg : "please verify yourself first"
    })
  }
}

//router.use(Verification)
router.use(AuthMiddleware)


router.post("/club", async (req:Request, res:Response) => {
  //include pfp later
  const { name , collegeName, description, type, FounderEmail, clubContact, requirements, facultyEmail} = req.body
  const parsedData = ClubSchema.safeParse(req.body)
  const userId = req.id
  if(!parsedData.success) {
    res.json({
      msg : "wrong format for creating a club"
    })
  }
  
      try {
        const college = await prisma.user.findFirst({
          where :{
            id : userId
          }, select :{
            collegeName : true
          }
        })

        const founder = await prisma.user.findUnique({
          where : {
            email : FounderEmail
          }
        })

        if(!founder) {
          res.status(402).json({
            msg : "founder not found , ask him to register"
          })
        }

        if(college?.collegeName.toLowerCase() !== collegeName.toLowerCase() ) {
          res.status(404).json({msg : "you are not associated with this college"})
          return
        }
          // they can still bypass this by changing the casing of characters, Validate the names of club in lowerCase
          //cannot make changes in database for this 
          const findClub = await prisma.clubs.findFirst({
            where : {
              collegeName : collegeName as string,
              name : name
            }
          })

          if(findClub) {
            res.json({
              msg : "the club of this name already exists in your college, delete that or create a new club"
            })
            return
          }
  
          // if(findClub?.name == name) {
          //   res.json({
          //     msg : "the club of this name already exists in your college, delete that or create a new club"
          //   })
          //   return
          // }
  

          const response = await prisma.clubs.create({
            data : {
              name : parsedData.data?.name as string,
              collegeName : parsedData.data?.collegeName as string,
              description : parsedData.data?.description as string || "",
              type : type, 
              founderEmail : FounderEmail,
              clubContact : clubContact,
              requirements : requirements,
              facultyEmail : facultyEmail
            }
          })
  
          if(!response) {
            res.json({
              msg  : "error in forming a club, please try again later"
            })
            return
          }
  
          res.status(200).json({
            msg : "club formed!",
            clubId : response.id
          })
          return
  
      } catch (error) {
          logger.error(error);
          res.status(500).json({
              msg: "error creating club"
          })
      }
  })
  

//query korbo, params na , tahole id , name , collegeName diye o khoja jabe 
router.get("/getClub", async (req:Request, res:Response) => {
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