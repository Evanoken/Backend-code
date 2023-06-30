import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
 // const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query(
        "SELECT * FROM users WHERE username = @username OR email = @email"
      );
    const user = result.recordset[0];
    if (user) {
      res.status(409).json({ error: "User already exists" });
    } else {
      await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input('password', sql.VarChar, password)
        .input("role", sql.VarChar, role)
        .query(
          "INSERT INTO Users (username, email, password, role) VALUES (@username, @email, @password, @role)"
        );
      res.status(200).send({ message: "User created successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  } finally {
    sql.close();
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM users WHERE username = @username");
    const user = result.recordset[0];
    if (!user) {
      res
        .status(401)
        .json({ error: "Authentication failed. Wrong credentials." });
    } else {
      if (!bcrypt.compareSync(password, user.password)) {
        res
          .status(401)
          .json({ error: "Authentication failed. Wrong credentials." });
      } else {
        const token = jwt.sign(
          { username: user.username, email: user.email },
          config.jwt_secret
        );
        res
          .status(200)
          .json({
            email: user.email,
            username: user.username,
            user_id: user.user_id,
            token: token,
          });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging in" });
  } finally {
    sql.close();
  }
};

export const getUsers = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM Users");
    const users = result.recordset;
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving users" });
  } finally {
    sql.close();
  }
};
