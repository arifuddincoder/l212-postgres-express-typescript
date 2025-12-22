import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express();
const port = 5500;

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // optional

const pool = new Pool({
	connectionString: `${process.env.NEON_CONNECTION}`,
});

const initDB = async () => {
	await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
	await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.post("/users", async (req: Request, res: Response) => {
	const { name, email } = req.body;
	try {
		const result = await pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]);

		res.status(201).json({
			success: true,
			message: "Data inserted successfully",
			data: result.rows[0],
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
});

app.get("/users", async (req: Request, res: Response) => {
	try {
		const result = await pool.query("SELECT * FROM users");

		return res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			data: result.rows,
		});
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			message: err?.message || "Internal Server Error",
		});
	}
});

app.get("/users/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User retrieved successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

app.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
		path: req.originalUrl,
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
