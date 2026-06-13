import { pool } from "../../db";
import { userService } from "./user.service";
const createUser = async (req, res) => {
    //   const { name, email, password, role } = req.body;
    try {
        const result = await userService.createUserIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: "User Created successfully!",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getAllUser = async (req, res) => {
    try {
        const result = await userService.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: "Users retrived successfully!",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await userService.getSingleUserFromDB(id);
        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "User Not Found!",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrived successfully!",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
};
export const userController = {
    createUser,
    getAllUser,
    getSingleUser
};
//# sourceMappingURL=user.controller.js.map