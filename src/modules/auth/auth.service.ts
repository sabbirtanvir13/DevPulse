


import jwt from "jsonwebtoken";
import { pool } from "../../db";
import bcrypt from "bcrypt";
import config from "../../config";
import type { IUser } from "../../types/user.types";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // 1. check user exists
  const userData = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = userData.rows[0];

  // 2. compare password
  const matchPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  // 3. generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(
    jwtPayload,
  config.secret as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at,updated_at
    `,
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

export const authService = {
  loginUserIntoDB,
  createUserIntoDB
};