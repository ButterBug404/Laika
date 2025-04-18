START TRANSACTION;

-- Users
INSERT INTO `laika_users` (`username`, `password_hash`, `email`) VALUES
('user1', 'hash1', 'user1@example.com'),
('user2', 'hash2', 'user2@example.com'),
('user3', 'hash3', 'user3@example.com'),
('user4', 'hash4', 'user4@example.com'),
('user5', 'hash5', 'user5@example.com'),
('user6', 'hash6', 'user6@example.com'),
('user7', 'hash7', 'user7@example.com'),
('user8', 'hash8', 'user8@example.com'),
('user9', 'hash9', 'user9@example.com'),
('user10', 'hash10', 'user10@example.com'),
('user11', 'hash11', 'user11@example.com'),
('user12', 'hash12', 'user12@example.com'),
('user13', 'hash13', 'user13@example.com'),
('user14', 'hash14', 'user14@example.com'),
('user15', 'hash15', 'user15@example.com');

-- Pets
INSERT INTO `pets` (`user_id`, `name`, `species`, `breed`, `color`, `age`, `sex`, `size`, `markings`) VALUES
(1, 'Buddy', 'DOG', 'Beagle', 'Tricolor', 4, 'MALE', 'MEDIUM', 'White paw'),
(2, 'Whiskers', 'CAT', 'Persian', 'White', 3, 'FEMALE', 'SMALL', 'Fluffy tail'),
(3, 'Max', 'DOG', 'Labrador', 'Black', 5, 'MALE', 'LARGE', 'Scar on nose'),
(4, 'Luna', 'CAT', 'Siamese', 'Cream', 2, 'FEMALE', 'SMALL', 'Blue eyes'),
(5, 'Charlie', 'DOG', 'Poodle', 'White', 6, 'MALE', 'MEDIUM', 'Curly fur'),
(6, 'Bella', 'CAT', 'Maine Coon', 'Brown Tabby', 3, 'FEMALE', 'LARGE', 'Big fluffy tail'),
(7, 'Rocky', 'DOG', 'Boxer', 'Fawn', 4, 'MALE', 'LARGE', 'Black snout'),
(8, 'Milo', 'CAT', 'British Shorthair', 'Gray', 1, 'MALE', 'MEDIUM', 'Round face'),
(9, 'Coco', 'DOG', 'Chihuahua', 'Tan', 2, 'FEMALE', 'SMALL', 'Tiny paws'),
(10, 'Oliver', 'CAT', 'Abyssinian', 'Ruddy', 3, 'MALE', 'MEDIUM', 'Bright eyes'),
(11, 'Daisy', 'DOG', 'Golden Retriever', 'Golden', 5, 'FEMALE', 'LARGE', 'Gentle eyes'),
(12, 'Simba', 'CAT', 'Ragdoll', 'Seal Point', 2, 'MALE', 'LARGE', 'Blue eyes'),
(13, 'Toby', 'DOG', 'Shih Tzu', 'White & Brown', 4, 'MALE', 'SMALL', 'Snub nose'),
(14, 'Chloe', 'CAT', 'Bengal', 'Spotted', 3, 'FEMALE', 'MEDIUM', 'Wild coat'),
(15, 'Rex', 'DOG', 'Doberman', 'Black & Tan', 5, 'MALE', 'LARGE', 'Docked tail'),
(1, 'Lily', 'CAT', 'Sphynx', 'Pink', 2, 'FEMALE', 'SMALL', 'Hairless'),
(2, 'Oscar', 'DOG', 'Dachshund', 'Brown', 6, 'MALE', 'SMALL', 'Long body'),
(3, 'Nala', 'CAT', 'Oriental', 'Ebony', 1, 'FEMALE', 'SMALL', 'Big ears'),
(4, 'Jack', 'DOG', 'Husky', 'Gray & White', 3, 'MALE', 'LARGE', 'Blue eyes'),
(5, 'Misty', 'CAT', 'Russian Blue', 'Gray', 4, 'FEMALE', 'MEDIUM', 'Bright green eyes');

-- Missing Alerts (for pets 1–10)
INSERT INTO `missing_alerts` (`user_id`, `pet_id`, `time`, `location`, `circumstancias`) VALUES
(1, 1, '2025-04-01 08:00:00', ST_GeomFromText('POINT(40.7128 -74.0060)'), 'Escaped from backyard'),
(2, 2, '2025-04-02 09:00:00', ST_GeomFromText('POINT(34.0522 -118.2437)'), 'Left window open'),
(3, 3, '2025-04-03 10:00:00', ST_GeomFromText('POINT(37.7749 -122.4194)'), 'Ran off during walk'),
(4, 4, '2025-04-04 11:00:00', ST_GeomFromText('POINT(41.8781 -87.6298)'), 'Jumped fence'),
(5, 5, '2025-04-05 12:00:00', ST_GeomFromText('POINT(29.7604 -95.3698)'), 'Ran after squirrel'),
(6, 6, '2025-04-06 13:00:00', ST_GeomFromText('POINT(39.7392 -104.9903)'), 'Door left open'),
(7, 7, '2025-04-07 14:00:00', ST_GeomFromText('POINT(32.7767 -96.7970)'), 'Bolted during fireworks'),
(8, 8, '2025-04-08 15:00:00', ST_GeomFromText('POINT(33.4484 -112.0740)'), 'Window cracked'),
(9, 9, '2025-04-09 16:00:00', ST_GeomFromText('POINT(47.6062 -122.3321)'), 'Ran off leash'),
(10, 10, '2025-04-10 17:00:00', ST_GeomFromText('POINT(42.3601 -71.0589)'), 'Snuck out the door');

-- Adoptions (pets 11–15)
INSERT INTO `adoptions` (`pet_id`, `listed_by_user_id`, `description`) VALUES
(11, 11, 'Golden Retriever looking for forever home'),
(12, 12, 'Beautiful Ragdoll cat, very affectionate'),
(13, 13, 'Shih Tzu, great for apartments'),
(14, 14, 'Energetic Bengal cat, needs space'),
(15, 15, 'Protective Doberman, great for security');

-- Adopters (users 1–5)
INSERT INTO `adopters` (`user_id`, `bio`, `experience_with_pets`) VALUES
(1, 'Love animals', 'Owned cats and dogs for years'),
(2, 'Big backyard', 'Grew up with a Labrador'),
(3, 'Pet sitter', 'Takes care of neighbor pets regularly'),
(4, 'Quiet lifestyle', 'Had a senior cat for 10 years'),
(5, 'Active', 'Goes hiking, wants a dog companion');

-- Adoption Interest
INSERT INTO `adoption_interest` (`adopter_id`, `adoption_id`, `message`) VALUES
(1, 1, 'Perfect for my home and lifestyle'),
(2, 2, 'Love Ragdolls!'),
(3, 3, 'Great size for my apartment'),
(4, 4, 'I’ve always wanted a Bengal'),
(5, 5, 'Need a guard dog for my rural home');

COMMIT;

