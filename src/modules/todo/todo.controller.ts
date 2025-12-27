import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
	const { user_id, title } = req.body;
	try {
		const result = await todoServices.createTodo(req.body);

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
};

const getTodos = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.getTodos();

		return res.status(200).json({
			success: true,
			message: "Todos retrieved successfully",
			data: result.rows,
		});
	} catch (err: any) {
		return res.status(500).json({
			success: false,
			message: err?.message || "Internal Server Error",
		});
	}
};

const getTodo = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.getTodo(req.params.id as string);

		if (result.rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Todo retrieved successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const updateTodo = async (req: Request, res: Response) => {
	const { user_id, title, description } = req.body;
	try {
		const result = await todoServices.updateTodo(user_id, title, description, req.params.id as string);

		if (result.rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		} else {
			return res.status(200).json({
				success: true,
				message: "Todo updated successfully",
				data: result.rows[0],
			});
		}
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const deleteTodo = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.deleteTodo(req.params.id as string);

		if (result.rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Todo deleted successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const todoControllers = {
	createTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
};
