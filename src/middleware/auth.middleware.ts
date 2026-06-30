

import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!!",
      });
    }

    let jwtToken = token;
    if (token.startsWith("Bearer ")) {
      jwtToken = token.split(" ")[1];
    }

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





      const userData = await pool.query(
        `SELECT * FROM users WHERE id=$1`,
        [decoded.id]
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