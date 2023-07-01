import sql from "mssql";
import config from "../db/config.js";

export const Register = async (req, res) => {
    const { customer_name, email, phone, password} = req.body;
   // const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      let pool = await sql.connect(config.sql);
      const result = await pool
        .request()
        .input("phone", sql.VarChar, phone)
        .input("email", sql.VarChar, email)
        .query(
          "SELECT * FROM users WHERE phone = @phone OR email = @email"
        );
      const user = result.recordset[0];
      if (user) {
        res.status(409).json({ error: "User already exists" });
      } else {
        await pool
          .request()
          .input("customer_name", sql.VarChar, customer_name)
          .input("email", sql.VarChar, email)
          .input("phone", sql.VarChar, phone)
          .input('password', sql.VarChar, password)
          .query(
            "INSERT INTO Users (customer_name, email, phone, password) VALUES (@customer_name, @email, @phone, @password)"
          );
        res.status(200).send({ message: "Customer created successfully" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the Customer" });
    } finally {
      sql.close();
    }
  };

  export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let pool = await sql.connect(config.sql);
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Users WHERE email = @email");
      const user = result.recordset[0];
      if (!user) {
        return res.status(401).json({ error: "Invalid email" });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while logging in" });
    } finally {
      sql.close();
    }
  };

  export const getCustomers = async (req, res) => {
    try {
      let pool = await sql.connect(config.sql);
      const result = await pool.request().query('SELECT * FROM Customers');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error while fetching Customers:', error);
      res.status(500).json({ error: 'Unable to fetch Customers' });
    } finally {
      sql.close();
    }
  };