import mariadb from 'mariadb';
import 'dotenv/config';

const pool = mariadb.createPool({
	host: 'localhost',
	port: process.env.MARIADB_PORT,
	user: process.env.MARIADB_USER,
	password: process.env.MARIADB_PASSWORD,
	database: process.env.MARIADB_DATABASE,
	connectionLimit: 5
});

export async function retrieveUser(email, password) {
	let conn;
	try {
		conn = await pool.getConnection();
		//TODO: add password when hash works
		const rows = await conn.query("SELECT * FROM laika_users WHERE email = ?", [email]);
		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}
