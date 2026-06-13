import jwt, {} from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
const auth = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
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
            const decoded = jwt.verify(jwtToken, config.secret);
            // const userData = await pool.query(
            //   `SELECT * FROM users WHERE email=$1`,
            //   [decoded.email]
            // );
            const userData = await pool.query(`SELECT * FROM users WHERE id=$1`, [decoded.id]);
            if (userData.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }
            req.user = userData.rows[0];
            console.log("USER SET:", req.user);
            next();
        }
        catch (error) {
            console.log("JWT ERROR:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    };
};
export default auth;
//# sourceMappingURL=auth.middleware.js.map