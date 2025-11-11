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
		const rows = await conn.query("SELECT id, name, pat_name, mat_name, email, phone, state, municipality, created_at, expo_push_token FROM laika_users WHERE id = ?", [id]);
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
        const query = "UPDATE pets SET name = ?, age = ?, age_unit = ?, breed = ?, vaccinated = ?, color = ?, size = ?, sex = ?, description = ?, skin_condition = ? WHERE id = ?";
        
        const vaccinated = pet.vaccinated === 'true' || pet.vaccinated === true ? 1 : 0;
        const skin_condition = pet.skin_condition === 'true' || pet.skin_condition === true ? 1 : 0;

        const res = await conn.query(query, [
            pet.name,
            pet.age,
            pet.age_unit,
            pet.breed,
            vaccinated,
            pet.color,
            pet.size,
            pet.sex,
            pet.description,
            skin_condition,
            id
        ]);
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

export async function deleteAdoption(petId) {
	let conn;
	try {
		conn = await pool.getConnection();
		const query = "DELETE FROM adoptions WHERE pet_id = ?";
		const res = await conn.query(query, [petId]);
		return res;
	} catch (err) {
		console.log("Error at deleteAdoption, ", err);
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

export async function retrieveMissingPetsNearLocation(location, radius = 10000) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT p.*, pa.id as alert_id, pa.last_seen_location
            FROM pets p
            JOIN pet_alerts pa ON p.id = pa.pet_id
            WHERE pa.status = 'MISSING'
            AND ST_DISTANCE_SPHERE(pa.last_seen_location, ST_GeomFromText(?)) <= ?;
        `;
        const rows = await conn.query(query, [location, radius]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
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

export async function retrievePetMatchesByUserId(userId) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT
                pm.id AS match_id,
                pm.confidence_level,
                pm.created_at AS match_created_at,
                mpa.id AS missing_pet_alert_id,
                mpa.time AS missing_pet_alert_time,
                ST_AsText(mpa.last_seen_location) AS missing_pet_last_seen_location,
                mp.id AS missing_pet_id,
                mp.name AS missing_pet_name,
                fpa.id AS found_pet_alert_id,
                fpa.time AS found_pet_alert_time,
                ST_AsText(fpa.last_seen_location) AS found_pet_last_seen_location,
                fpa.contact_info AS found_pet_contact_info,
                fpa.contact_method AS found_pet_contact_method,
                fp.id AS found_pet_id,
                fp.name AS found_pet_name,
                fp.description AS found_pet_description
            FROM
                pet_matches pm
            JOIN
                pet_alerts mpa ON pm.missing_pet_alert_id = mpa.id
            JOIN
                pets mp ON mpa.pet_id = mp.id
            JOIN
                pet_alerts fpa ON pm.found_pet_alert_id = fpa.id
            JOIN
                pets fp ON fpa.pet_id = fp.id
            WHERE
                mp.user_id = ?;
        `;
        const rows = await conn.query(query, [userId]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

export async function insertPetMatch(match) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "INSERT INTO pet_matches (missing_pet_alert_id, found_pet_alert_id, confidence_level) VALUES (?, ?, ?)";
        const res = await conn.query(query, [...match]);
        return res;
    } catch (err) {
        console.log("Error at insertPetMatch, ", err);
    } finally {
        if (conn) conn.release();
    }
}

export async function getUsersByMunicipality(municipality) {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT id, name, email, municipality, expo_push_token FROM laika_users WHERE municipality = ?", [municipality]);
		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.end();
	}
}

export async function updateUserPushToken(userId, token) {
	let conn;
	try {
		conn = await pool.getConnection();
		const query = "UPDATE laika_users SET expo_push_token = ? WHERE id = ?";
		const res = await conn.query(query, [token, userId]);
		return res;
	} catch (err) {
		console.log("Error at updateUserPushToken, ", err);
	} finally {
		if (conn) conn.release();
	}
}

export async function retrieveAdoptionPets() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT
                p.*,
                a.id AS adoption_id,
                a.description AS adoption_description,
                a.contact_info,
                a.contact_method,
                u.name AS owner_name,
                u.email AS owner_email,
                u.phone AS owner_phone
            FROM
                pets p
            JOIN
                adoptions a ON p.id = a.pet_id
            JOIN
                laika_users u ON a.listed_by_user_id = u.id;
        `;
        const rows = await conn.query(query);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

export async function updateAdoptionByPetId(petId, adoption) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "UPDATE adoptions SET description = ?, contact_info = ?, contact_method = ? WHERE pet_id = ?";
        const res = await conn.query(query, [
            adoption.description,
            adoption.contact_info,
            adoption.contact_method,
            petId
        ]);
        return res;
    } catch (err) {
        console.log("Error at updateAdoptionByPetId, ", err);
    } finally {
        if (conn) conn.release();
    }
}

export async function retrieveAdoptionByPetId(petId) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM adoptions WHERE pet_id = ?", [petId]);
        return rows[0];
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}
