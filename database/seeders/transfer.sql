-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for sgbcmms
CREATE DATABASE IF NOT EXISTS `sgbcmms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sgbcmms`;

-- Dumping structure for table sgbcmms.facilities
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên cơ sở',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ cụ thể cơ sở ',
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện cơ sở',
  `active` smallint NOT NULL DEFAULT '1' COMMENT 'Cơ sở có đang hoạt động không: 1 - có| 2 - không',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24021016293165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='table dùng để lưu trữ các cơ sở làm việc';

-- Dumping data for table sgbcmms.facilities: ~2 rows (approximately)
DELETE FROM `facilities`;
INSERT INTO `facilities` (`id`, `name`, `address`, `logo`, `active`, `created_at`, `updated_at`) VALUES
	(24021008224354, 'Cơ sở 1', 'Số 71, Phạm Tuấn Tài', NULL, 1, '2024-04-06 20:35:51', '2024-04-06 20:35:51'),
	(24021008224642, 'Cơ sở 2', 'Số 52, Cầu Giấy', NULL, 1, '2024-04-06 20:35:51', '2024-04-06 20:35:51'),
	(24021016293164, 'Cơ sở 3', 'Số 8, Hồ Đắc Di', NULL, 1, '2024-04-06 20:35:51', '2024-04-06 20:35:51');

-- Dumping structure for table sgbcmms.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sgbcmms.failed_jobs: ~0 rows (approximately)
DELETE FROM `failed_jobs`;

-- Dumping structure for table sgbcmms.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sgbcmms.migrations: ~0 rows (approximately)
DELETE FROM `migrations`;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_100000_create_password_reset_tokens_table', 1),
	(2, '2019_08_19_000000_create_failed_jobs_table', 1),
	(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(4, '2024_04_03_140250_facilities', 1),
	(5, '2024_04_03_140257_specialties', 1),
	(6, '2024_04_03_140358_users', 1);

-- Dumping structure for table sgbcmms.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sgbcmms.password_reset_tokens: ~0 rows (approximately)
DELETE FROM `password_reset_tokens`;

-- Dumping structure for table sgbcmms.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sgbcmms.personal_access_tokens: ~0 rows (approximately)
DELETE FROM `personal_access_tokens`;

-- Dumping structure for table sgbcmms.specialties
CREATE TABLE IF NOT EXISTS `specialties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chuyên ngành',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả về chuyên ngành',
  `active` smallint NOT NULL DEFAULT '1' COMMENT 'chuyên ngành có đang hoạt động không: 1 - có| 0 - không',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24021016322363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='table dùng để lưu trữ các chuyên ngành';

-- Dumping data for table sgbcmms.specialties: ~0 rows (approximately)
DELETE FROM `specialties`;
INSERT INTO `specialties` (`id`, `name`, `description`, `active`, `created_at`, `updated_at`) VALUES
	(24021016322362, 'Spa', '<p><strong>Spa </strong>Dịch vụ chăm sóc sức khỏe</p>', 1, '2024-04-06 20:35:51', '2024-04-06 20:35:51');

-- Dumping structure for table sgbcmms.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên nhân sự',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email nhân sự ( dùng để đăng nhập)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password nhân sự',
  `birth` timestamp NOT NULL COMMENT 'Ngày sinh nhân sự',
  `avatar` text COLLATE utf8mb4_unicode_ci COMMENT 'Avatar của nhân sự',
  `gender` smallint NOT NULL DEFAULT '1' COMMENT 'Giới tính: 1 - Nam | 2 - nữ',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SĐT Nhân viên',
  `address` text COLLATE utf8mb4_unicode_ci COMMENT 'Địa chỉ nơi ở nhân viên',
  `permission` smallint DEFAULT NULL COMMENT 'Phân quyền trong Admin',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả về nhân viên',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_deleted` smallint NOT NULL DEFAULT '0' COMMENT '0 - chưa xóa | 1 - đã xóa',
  `facility_id` bigint unsigned DEFAULT NULL COMMENT 'Cơ sở làm việc',
  `specialties_id` bigint unsigned DEFAULT NULL COMMENT 'Chuyên ngành làm việc',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_facility_id_foreign` (`facility_id`),
  KEY `users_specialties_id_foreign` (`specialties_id`),
  CONSTRAINT `users_facility_id_foreign` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_specialties_id_foreign` FOREIGN KEY (`specialties_id`) REFERENCES `specialties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2404070953457297 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='table dùng để lưu trữ nhân sự';

-- Dumping data for table sgbcmms.users: ~0 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `birth`, `avatar`, `gender`, `phone`, `address`, `permission`, `description`, `created_at`, `updated_at`, `is_deleted`, `facility_id`, `specialties_id`, `remember_token`) VALUES
	(15042000, 'Bùi Huy Anh', 'bujhuyanh150400@gmail.com', '$2y$12$5KSMF9XNoPwC7DbAs3YfH.jfbWp9rAWdssvPn3WGqmAK8obj6uQCq', '2000-04-14 17:00:00', NULL, 1, '0917095494', 'Hà Nội', 16, '<p>Huy Anh đẹp trai</p>', '2024-04-06 20:35:51', '2024-04-06 20:35:51', 0, 24021008224354, 24021016322362, NULL),
	(24040709342179, 'ngạc nhiên chưa', 'bujhuyanh1@gmail.com', '$2y$12$6imw8RQWRY4IdX.H/Ks0Vu7CiGci29WwMzZANBfNdHmNdIPVY5WQe', '2000-04-14 17:00:00', 'ZmlsZV9zdG9yYWdlL2FkbWluLzI0MDQwNzA5MzQyMTc5L2F2YXRhcl8yNDA0MDcwOTM0MjE3OS5qcGc=', 1, '0917095494', 'qdwqdqwdqwdqwdqwd', 16, '<p>hehehehehehehdwqdqdq</p>', '2024-04-07 02:34:21', '2024-04-07 02:34:21', 0, 24021008224354, 24021016322362, NULL),
	(2404070934468670, 'ngạc nhiên chưa', 'bujhuyanh2@gmail.com', '$2y$12$gvnzxCS8AAqbqid00vPPbuBobzSO7TpLvD3IPoAKMXuK.6nV7CU3O', '2000-04-14 17:00:00', 'ZmlsZV9zdG9yYWdlL2FkbWluLzI0MDQwNzA5MzQ0Njg2NzAvYXZhdGFyXzI0MDQwNzA5MzQ0Njg2NzAuanBn', 1, '0917095494', 'qdwqdqwdqwdqwdqwd', 16, '<p>hehehehehehehdwqdqdq</p>', '2024-04-07 02:34:46', '2024-04-07 02:34:46', 0, 24021008224354, 24021016322362, NULL),
	(2404070936444662, 'qưdqdwqdqdwqd', 'bujhuyanh3@gmail.com', '$2y$12$giILCr1vxN8NYY2xU42CReNBRIazmOkHQykZxC4wAQRv1pbUc6KzS', '2024-04-06 17:00:00', NULL, 1, '0917095494', 'dwqdqwdqwdqwd', 18, '<p>ưqdqwdqwdqwd</p>', '2024-04-07 02:36:45', '2024-04-07 02:36:45', 0, 24021008224642, 24021016322362, NULL),
	(2404070938295904, 'hahahahahaa', 'hahahahahaa@gmail.com', '$2y$12$Ys7gQjn95FwaUZgs7zPQ5ucr22iW2P614tIGejx3EH0cXO/H.5ELS', '2024-04-06 17:00:00', NULL, 1, '0917095494', 'hahahahahaa@gmail.com', 18, NULL, '2024-04-07 02:38:30', '2024-04-07 02:38:30', 0, 24021008224354, 24021016322362, NULL),
	(2404070938527984, 'hahahahahaa', 'hahahahahaaqd@gmail.com', '$2y$12$2RC34AC05tdYRwSU8JjcKuczlQXLxS6UdF/71CLPqWJUFMUQd0qT6', '2024-04-06 17:00:00', NULL, 1, '0917095494', 'hahahahahaa@gmail.com', 18, NULL, '2024-04-07 02:38:52', '2024-04-07 02:38:52', 0, 24021008224354, 24021016322362, NULL),
	(2404070942469112, 'hahahahahaa', 'hahahahahaaqd2@gmail.com', '$2y$12$qb/iylL59e3s3HqGsctPT.Ulk8JCUT5Efrv8HrzeYyLA8w5YlkW0y', '2024-04-06 17:00:00', NULL, 1, '0917095494', 'hahahahahaa@gmail.com', 18, NULL, '2024-04-07 02:42:46', '2024-04-07 02:42:46', 0, 24021008224354, 24021016322362, NULL),
	(2404070953457296, 'bujhuyanh150400@gmail.com', 'bujhuyanh1504aqdqwdqwdqwd00@gmail.com', '$2y$12$jXlpK6ndjOiaCDoHQf3PIeu/zLWP4s0sU55zdYE4aWE77dtCCVzLa', '2024-04-15 17:00:00', NULL, 1, '09170959494', 'dwqdwqdqdqwdwqdqwdw', 18, '<p>hehehehehehe</p>', '2024-04-07 02:53:45', '2024-04-07 02:53:45', 0, 24021008224354, 24021016322362, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
