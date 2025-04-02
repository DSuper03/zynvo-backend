// add authentication middleware here 

import { NextFunction } from "express";

//import better types if required
export default function Auth( req: any, res: any , next: NextFunction) {
    //code here
    try {
        // auth here
        next()
    } catch (error) {
        console.log(error);
        res.json({
            msg : "error occured"
        })
    }
} 