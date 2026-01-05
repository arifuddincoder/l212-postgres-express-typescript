import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		if (!token) {
			return res.status(500).json({ message: "You are not allowed!!" });
		}

		const decoded = jwt.verify(token, config.jwtSecret as string);
		console.log({ auth_token: decoded });
		next();
	};
};

export default auth;
