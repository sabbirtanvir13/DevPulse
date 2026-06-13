import { pool } from "../../db";
import bcrypt from "bcrypt";
const createUserIntoDB = async (paylood) => {
    const { name, email, password, role } = paylood;
    const hashPassword = await bcrypt.hash(password, 20);
    const result = await pool.query(`
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING *
      `, [name, email, hashPassword, role]);
    delete result.rows[0].password;
    return result;
};
const getAllUsersFromDB = async () => {
    const result = await pool.query(`
      SELECT * FROM users  
        `);
    return result;
};
const getSingleUserFromDB = async (id) => {
    const result = await pool.query(`
         SELECT * FROM users WHERE id =$1
        `, [id]);
    return result;
};
export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB
};
//# sourceMappingURL=user.service.js.map