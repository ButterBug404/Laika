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

export async function userExists(id){
	let conn;
	try{
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT * FROM laika_users WHERE id = ?", [id]);
		return rows;
	}catch(err){
		throw err;
	}finally{
		if (conn) conn.end();
	}
}

export async function retrieveUser(email) {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT * FROM laika_users WHERE email = ?", [email]);
		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}

export async function insertUser(user){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO laika_users (name, pat_name, mat_name, email, password_hash, phone, state, municipality) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		const res = await conn.query(query, [user.name, user.pat_name, user.mat_name, user.email, user.password_hash, user.phone, user.state, user.municipality]);
		if (res && res.insertId) {
			return res.insertId;
		}
		return undefined;
	}catch(err){
		console.log("Error at inesrtUser, ", err)
	}finally{
		if(conn) conn.release();
	}
}

export async function insertAdopter(adopter){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO adopters (user_id, bio, experience_with_pets) VALUES (?, ?, ?)";
		const rows = await conn.query(query, [adopter.user_id, adopter.bio, adopter.experience_with_pets]);
	}catch(err){
		console.log("Error at insertAdopter, ", err);
	}finally{
		if(conn) conn.release();
	}
}

export async function insertPet(pet){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO pets (user_id, name, species, breed, color, age, sex, size, markings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		const rows = await conn.query(query, [pet.user_id, pet.name, pet.species, pet.breed, pet.color, pet.age, pet.sex, pet.size, pet.markings]);
	}catch(err){
		console.log("Error at insertAdopter, ", err);
	}finally{
		if(conn) conn.release();
	}
}

export async function insertMissingAlert(alert){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO missing_alerts (user_id, pet_id, time, location, circumstances) VALUES (?, ?, ?, ?, ?)";
		const rows = await conn.query(query, [alert.user_id, alert.pet_id, alert.time, alert.location, alert.circumstances]);
	}catch(err){
		console.log("Error at insertMissingAlert, ", err);
	}finally{
		if(conn) conn.release();
	}
}

export async function retrieveUserById(id) {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT id, name, pat_name, mat_name, email, phone, state, municipality, created_at FROM laika_users WHERE id = ?", [id]);
		return rows[0];
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}
