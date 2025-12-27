import { pool } from "../../config/db";

const createTodo = async (payload: Record<string, unknown>) => {
	const { user_id, title } = payload;

	const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);

	return result;
};

const getTodos = async () => {
	const result = await pool.query("SELECT * FROM todos");
	return result;
};

const getTodo = async (id: string) => {
	const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);

	return result;
};

const updateTodo = async (user_id: string, title: string, description: string, id: string) => {
	const result = await pool.query(
		"UPDATE todos SET user_id = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
		[user_id, title, description, id]
	);

	return result;
};

const deleteTodo = async (id: string) => {
	const result = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);

	return result;
};

export const todoServices = {
	createTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
};
