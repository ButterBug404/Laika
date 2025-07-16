import * as argon2 from 'argon2';

export async function hashPassword(password){
	try{
		const hash = await argon2.hash(password);
		return hash;
	} catch(err){
		throw err;
	}
}

export async function verifyPassword(plaintext_password, hash){
	try{
		if(await argon2.verify(hash, plaintext_password)){
			return true;
		}else{
			return false;
		}
	}catch(err){
		throw err;
	}
}
