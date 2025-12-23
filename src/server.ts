import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
const app = express();

const port = config.port;

app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // optional

initDB();

app.get("/", logger, (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use("/users", userRoutes);

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
