-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb
-- Tiempo de generación: 18-04-2025 a las 17:50:16
-- Versión del servidor: 11.7.2-MariaDB-ubu2404
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `laika`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `laika_users`
--

CREATE TABLE `laika_users` (
  `id` int(11) NOT NULL,
  `username` varchar(150) NOT NULL,
  `password_hash` char(60) NOT NULL,
  `email` varchar(254) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `missing_alerts`
--

CREATE TABLE `missing_alerts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `location` point NOT NULL,
  `circumstancias` varchar(280) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `species` enum('DOG','CAT') NOT NULL,
  `breed` varchar(80) DEFAULT NULL,
  `color` varchar(60) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` enum('MALE','FEMALE') NOT NULL,
  `size` enum('SMALL','MEDIUM','LARGE') NOT NULL,
  `markings` varchar(280) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `laika_users`
--
ALTER TABLE `laika_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_missing_alerts_user_id` (`user_id`),
  ADD KEY `fk_missing_alerts_pet_id` (`pet_id`);

--
-- Indices de la tabla `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pets_user_id` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `laika_users`
--
ALTER TABLE `laika_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  ADD CONSTRAINT `fk_missing_alerts_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `fk_missing_alerts_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`);

--
-- Filtros para la tabla `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `fk_pets_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
