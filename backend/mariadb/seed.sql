-- SEED DATA FOR laika DATABASE

-- Insert users
INSERT INTO `laika_users` (`username`, `password_hash`, `email`, `created_at`) VALUES
('user1', 'hash1', 'user1@example.com', NOW()),
('user2', 'hash2', 'user2@example.com', NOW()),
('user3', 'hash3', 'user3@example.com', NOW()),
('user4', 'hash4', 'user4@example.com', NOW()),
('user5', 'hash5', 'user5@example.com', NOW()),
('user6', 'hash6', 'user6@example.com', NOW()),
('user7', 'hash7', 'user7@example.com', NOW()),
('user8', 'hash8', 'user8@example.com', NOW()),
('user9', 'hash9', 'user9@example.com', NOW()),
('user10', 'hash10', 'user10@example.com', NOW()),
('user11', 'hash11', 'user11@example.com', NOW()),
('user12', 'hash12', 'user12@example.com', NOW()),
('user13', 'hash13', 'user13@example.com', NOW()),
('user14', 'hash14', 'user14@example.com', NOW()),
('user15', 'hash15', 'user15@example.com', NOW());

-- Insert pets (dogs and cats)
INSERT INTO `pets` (`user_id`, `name`, `species`, `breed`, `color`, `age`, `sex`, `size`, `markings`) VALUES
(1, 'Buddy', 'DOG', 'Labrador', 'Black', 3, 'MALE', 'LARGE', 'White patch on chest'),
(2, 'Milo', 'CAT', 'Siamese', 'Cream', 2, 'MALE', 'MEDIUM', 'Blue eyes'),
(3, 'Bella', 'DOG', 'Poodle', 'White', 5, 'FEMALE', 'MEDIUM', 'Curly fur'),
(4, 'Luna', 'CAT', 'Persian', 'Grey', 4, 'FEMALE', 'MEDIUM', 'Flat face'),
(5, 'Max', 'DOG', 'Bulldog', 'Brown', 2, 'MALE', 'MEDIUM', 'Wrinkled face'),
(6, 'Chloe', 'CAT', 'Maine Coon', 'Brown Tabby', 3, 'FEMALE', 'LARGE', 'Bushy tail'),
(7, 'Rocky', 'DOG', 'German Shepherd', 'Tan/Black', 3, 'MALE', 'LARGE', 'Pointy ears'),
(8, 'Daisy', 'DOG', 'Chihuahua', 'Tan', 5, 'FEMALE', 'SMALL', 'Big ears'),
(9, 'Oscar', 'CAT', 'Bengal', 'Spotted', 2, 'MALE', 'MEDIUM', 'Leopard-like coat'),
(10, 'Lucy', 'DOG', 'Terrier', 'Grey', 1, 'FEMALE', 'SMALL', 'Spotted legs'),
(11, 'Tiger', 'CAT', 'Tabby', 'Orange', 4, 'MALE', 'MEDIUM', 'Striped fur'),
(12, 'Duke', 'DOG', 'Husky', 'Grey/White', 4, 'MALE', 'LARGE', 'Blue eyes'),
(13, 'Nala', 'CAT', 'Ragdoll', 'White/Brown', 3, 'FEMALE', 'MEDIUM', 'Fluffy tail'),
(14, 'Sadie', 'DOG', 'Golden Retriever', 'Golden', 3, 'FEMALE', 'LARGE', 'Friendly face'),
(15, 'Zoe', 'DOG', 'Cocker Spaniel', 'Black', 4, 'FEMALE', 'MEDIUM', 'Long ears'),
(1, 'Simba', 'CAT', 'British Shorthair', 'Grey', 5, 'MALE', 'MEDIUM', 'Round face'),
(2, 'Toby', 'DOG', 'Dalmatian', 'White/Black', 4, 'MALE', 'LARGE', 'Spotted coat'),
(3, 'Maggie', 'DOG', 'Yorkie', 'Brown/Black', 3, 'FEMALE', 'SMALL', 'Silky coat'),
(4, 'Cleo', 'CAT', 'Sphynx', 'Pinkish', 2, 'FEMALE', 'SMALL', 'Hairless'),
(5, 'Buster', 'DOG', 'Pug', 'Fawn', 6, 'MALE', 'SMALL', 'Curly tail');

-- Insert missing alerts
INSERT INTO `missing_alerts` (`user_id`, `pet_id`, `time`, `location`, `circumstancias`) VALUES
(1, 1, NOW(), ST_PointFromText('POINT(40.7128 -74.0060)'), 'Ran out of the backyard'),
(3, 5, NOW(), ST_PointFromText('POINT(34.0522 -118.2437)'), 'Lost during a walk in the park'),
(7, 7, NOW(), ST_PointFromText('POINT(37.7749 -122.4194)'), 'Escaped through an open door');

