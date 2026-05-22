// // import type { NextFunction, Request, Response } from "express"
// // import jwt, { type JwtPayload } from "jsonwebtoken";
// // import config from "../config";
// // import { pool } from "../db";
// // const auth=()=>{
// //     return async (req:Request ,res:Response,next:NextFunction)=>{


// //   const token = req.headers.authorization;

// //       // console.log(token);
// //       if (!token) {
// //         res.status(401).json({
// //           success: false,
// //           message: "Unauthorized access!!",
// //         });
// //       }
   



// //        const decoded = jwt.verify(
// //         token as string,
// //         config.secret as string,
// //       ) as JwtPayload;

// //       const userData = await pool.query(
// //         `
// //      SELECT * FROM users WHERE email=$1   
// //         `,
// //         [decoded.email],
// //       );

// //       // console.log(userData);

// //       const user = userData.rows[0];

// // // console.log('this is protect route')
// // console.log(req)
// // next()
// // }
// // }

// // export default auth


// import type { NextFunction, Request, Response } from "express";
// import jwt, { type JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import { pool } from "../db";

// const auth = () => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;
//      console.log("AUTH OK");
     
//     //  must return here
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access!!",
//       });
//     }

//     // ✅ extract Bearer token
//     const jwtToken = token.split(" ")[1];

//     if (!jwtToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Token missing",
//       });
//     }

//     try {
//       const decoded = jwt.verify(
//         jwtToken,
//         config.secret as string
//       ) as JwtPayload;

//       const userData = await pool.query(
//         `SELECT * FROM users WHERE email=$1`,
//         [decoded.email]
//       );

//       if (userData.rows.length === 0) {
//         return res.status(401).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       (req as any).user = userData.rows[0];

//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }
//   };
// };

// export default auth;


import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    console.log("AUTH MIDDLEWARE HIT");
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!!",
      });
    }

    const jwtToken = token.split(" ")[1];

    if (!jwtToken) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decoded = jwt.verify(
        jwtToken,
        config.secret as string
      ) as JwtPayload;

      console.log("DECODED:", decoded);

      const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [decoded.email]
      );

      if (userData.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      (req as any).user = userData.rows[0];

      console.log("USER SET:", (req as any).user);

      next();
    } catch (error) {
      console.log("JWT ERROR:", error);

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};

export default auth;