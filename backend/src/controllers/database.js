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
		const res = await conn.query(query, [...user]);
		return res;
	}catch(err){
		console.log("Error at insertUser, ", err)
	}finally{
		if(conn) conn.release();
	}
}

export async function insertAdopter(adopter){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO adopters (user_id, bio, experience_with_pets) VALUES (?, ?, ?)";
		const res = await conn.query(query, [...adopter]);
		return res;
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
		const query = "INSERT INTO pets (user_id, name, species, breed, color, age, age_unit, sex, size, vaccinated, description, skin_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		const res = await conn.query(query, [...pet]);
		return res;
	}catch(err){
		console.log("Error at insertPet, ", err);
	}finally{
		if(conn) conn.release();
	}
}

export async function insertPetAlert(alert){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO pet_alerts (user_id, pet_id, status, time, last_seen_location, description, contact_info, contact_method, has_reward, reward_description, reward_amount) VALUES (?, ?, ?, ?, ST_GeomFromText(?), ?, ?, ?, ?, ?, ?)";
		console.log("ALE");
		console.log(alert);
		const res = await conn.query(query, [...alert]);
		return res;
	}catch(err){
		console.log("Error at insertPetAlert, ", err);
	}finally{
		if(conn) conn.release();
	}
}

export async function insertAdoption(adoption){
	let conn;
	try{
		conn = await pool.getConnection();
		const query = "INSERT INTO adoptions (pet_id, listed_by_user_id, description, contact_info, contact_method) VALUES (?, ?, ?, ?, ?)";
		const res = await conn.query(query, [...adoption]);
		return res;
	}catch(err){
		console.log("Error at insertAdoption, ", err);
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

export async function retrievePasswordById(id) {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT password_hash FROM laika_users WHERE id = ?", [id]);
		return rows[0];
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}

export async function retrievePets(id) {
	let conn;
	try {
		conn = await pool.getConnection();
		const query = `
            SELECT
                p.*,
                pa.status AS alert_status,
                pa.id AS alert_id,
                a.id AS adoption_id
            FROM
                pets p
            LEFT JOIN
                pet_alerts pa ON p.id = pa.pet_id
            LEFT JOIN
                adoptions a ON p.id = a.pet_id
            WHERE
                p.user_id = ?;
        `;
		const rows = await conn.query(query, [id]);
		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}

export async function retrievePet(id) {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT * from pets WHERE id = ?", [id]);
		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}

export async function updatePet(id, pet) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "UPDATE pets SET name = ?, species = ?, breed = ?, color = ?, age = ?, age_unit = ?, sex = ?, size = ?, vaccinated = ?, description = ?, skin_condition = ? WHERE id = ?";
        const res = await conn.query(query, [...Object.values(pet), id]);
        return res;
    } catch (err) {
        console.log("Error at updatePet, ", err);
    } finally {
        if (conn) conn.release();
    }
}

export async function deletePet(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "DELETE FROM pets WHERE id = ?";
        const res = await conn.query(query, [id]);
        return res;
    } catch (err) {
        console.log("Error at deletePet, ", err);
    } finally {
        if (conn) conn.release();
    }
}

export async function deletePetAlert(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "DELETE FROM pet_alerts WHERE pet_id = ?";
        const res = await conn.query(query, [id]);
        return res;
    } catch (err) {
        console.log("Error at deletePetAlert, ", err);
    } finally {
        if (conn) conn.release();
    }
}

export async function updateUser(id, user) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "UPDATE laika_users SET name = ?, pat_name = ?, mat_name = ?, email = ?, phone = ? WHERE id = ?";
        const res = await conn.query(query, [user.name, user.pat_name, user.mat_name, user.email, user.phone, id]);
        return res;
    } catch (err) {
        console.log("Error at updateUser, ", err);
    } finally {
        if (conn) conn.release();
    }
}
export async function updatePassword(id, password_hash) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "UPDATE laika_users SET password_hash = ? WHERE id = ?";
        const res = await conn.query(query, [password_hash, id]);
        return res;
    } catch (err) {
        console.log("Error at updateUser, ", err);
    } finally {
        if (conn) conn.release();
    }
}
