-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 13, 2023 at 05:38 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `primeguageIBS`
--

-- --------------------------------------------------------

--
-- Table structure for table `Administrative_users`
--

CREATE TABLE `Administrative_users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL,
  `dashboard_access` enum('view','full') NOT NULL,
  `analytics_access` enum('view','full') NOT NULL,
  `mda_access` enum('view','full') NOT NULL,
  `reports_access` enum('view','full') NOT NULL,
  `tax_payer_access` enum('view','full') NOT NULL,
  `users_access` enum('view','full') NOT NULL,
  `cms_access` enum('view','full') NOT NULL,
  `support` enum('view','full') NOT NULL,
  `img` longtext NOT NULL,
  `verification_status` longtext NOT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Administrative_users`
--

INSERT INTO `Administrative_users` (`id`, `fullname`, `email`, `phone`, `password`, `dashboard_access`, `analytics_access`, `mda_access`, `reports_access`, `tax_payer_access`, `users_access`, `cms_access`, `support`, `img`, `verification_status`, `time_in`) VALUES
(1, 'PrimeGuage', 'primeguage@gmail.com', '08135719391', '12345', 'full', 'full', 'full', 'full', 'full', 'full', 'full', 'full', '', '', '2023-02-03 06:08:18'),
(5, 'Aliyu kamilu', 'aliyukamilu005@gmail.com', '08033238733', '12345', '', '', '', 'view', 'view', 'view', 'view', '', '', 'c0U0RVRrVlptQ1A3MTZRWDdHcWE5WjRoTTBsdDc1bmswUSt2a3BZQTRaTT0=', '2023-02-03 10:39:14'),
(6, 'Aliyu kamilu', 'aliyukamilu000@gmail.com', '098988999', '12345', '', '', 'view', 'view', 'view', 'view', 'view', '', '', 'ZldEenpjNzFhTld5Mm16L0MwcWM3UWNxSno4WlZ0UitYNGR1eU9wS3pPST0=', '2023-02-03 10:44:06'),
(8, 'Aliyu kamilu', 'aliyukamilu002@gmail.com', '08135719391', '', '', '', 'view', 'view', '', 'view', 'view', 'view', '', '1', '2023-02-20 11:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `applicable_taxes`
--

CREATE TABLE `applicable_taxes` (
  `id` int(11) NOT NULL,
  `revenue_head_id` bigint(20) NOT NULL,
  `user_payer_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `applicable_taxes`
--

INSERT INTO `applicable_taxes` (`id`, `revenue_head_id`, `user_payer_id`, `created_at`) VALUES
(1, 1, 12, '2023-03-14 16:02:31');


-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `body` varchar(400) NOT NULL,
  `description` varchar(400) NOT NULL,
  `description_2` varchar(400) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `image`, `body`, `description`, `description_2`, `created_at`) VALUES
(1, 'https://media.publit.io/file/slide1-z.png', 'Pay your tax today!', 'Let s build Akwaibom together ', 'All payment in Akwaibom has been made easy, convenient, and secure way to pay all taxes or bills owed to the Akwaibom state government.', '2023-02-23 13:28:20'),
(3, 'https://media.publit.io/file/slide2-8.png', 'Are you an individual or corporate\nbody in Akwaibom', '', 'Tax payments and all remittances to the Akwaibom government has been made easy…\n\n', '2023-02-23 13:28:20');

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `id` int(11) NOT NULL,
  `address` varchar(200) NOT NULL,
  `email` varchar(350) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`id`, `address`, `email`, `phone_number`, `created_at`) VALUES
(2, 'No. 37 Kwame Nkurumah Crescent, Asokoro, Abuja', 'info@primeguage.com', '08135719391', '2023-02-24 20:42:31');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `payer_id` varchar(100) NOT NULL,
  `revenue_head` int(255) NOT NULL,
  `invoice_number` varchar(15) NOT NULL,
  `due_date` date NOT NULL,
  `payment_status` enum('paid','unpaid') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `payer_id`, `revenue_head`, `invoice_number`, `due_date`, `payment_status`) VALUES
(183, '1', 7, '63d007d425641', '2023-02-24', 'unpaid'),
(184, '1', 9, '63d007d425877', '2023-02-24', 'unpaid'),
(185, '1', 10, '63d007d4259c5', '2023-02-24', 'unpaid'),
(186, '1', 35, '63d007d425b00', '2023-02-24', 'unpaid'),
(187, '1', 36, '63d007d425c58', '2023-02-24', 'unpaid'),
(188, '1', 37, '63d007d425d93', '2023-02-24', 'unpaid'),
(189, '1', 38, '63d007d425ed3', '2023-02-24', 'unpaid'),
(190, '1', 68, '63d007d426006', '2023-02-24', 'unpaid'),
(191, '1', 89, '63d007d42614d', '2023-02-24', 'unpaid'),
(192, '1', 90, '63d007d42627c', '2023-02-24', 'unpaid'),
(193, '1', 94, '63d007d4263b6', '2023-02-24', 'unpaid'),
(194, '1', 96, '63d007d4264e5', '2023-02-24', 'unpaid'),
(195, '1', 97, '63d007d4266ea', '2023-02-24', 'unpaid'),
(196, '1', 98, '63d007d4268a9', '2023-02-24', 'unpaid'),
(197, '1', 99, '63d007d4269ef', '2023-02-24', 'unpaid'),
(198, '1', 100, '63d007d426b58', '2023-02-24', 'unpaid'),
(199, '1', 101, '63d007d426cdd', '2023-02-24', 'unpaid'),
(200, '1', 104, '63d007d426e54', '2023-02-24', 'unpaid'),
(201, '1', 108, '63d007d42704a', '2023-02-24', 'unpaid'),
(202, '1', 110, '63d007d4271d9', '2023-02-24', 'unpaid'),
(203, '1', 113, '63d007d427346', '2023-02-24', 'unpaid'),
(204, '1', 115, '63d007d4274e7', '2023-02-24', 'unpaid'),
(205, '1', 116, '63d007d4276b1', '2023-02-24', 'unpaid'),
(206, '1', 117, '63d007d427932', '2023-02-24', 'unpaid'),
(207, '1', 118, '63d007d427b67', '2023-02-24', 'unpaid'),
(208, '1', 119, '63d007d427de0', '2023-02-24', 'unpaid'),
(209, '1', 122, '63d007d427f91', '2023-02-24', 'unpaid'),
(210, '1', 131, '63d007d428122', '2023-02-24', 'unpaid'),
(211, '1', 133, '63d007d428294', '2023-02-24', 'unpaid'),
(212, '1', 134, '63d007d4283ef', '2023-02-24', 'unpaid'),
(213, '1', 136, '63d007d42854c', '2023-02-24', 'unpaid'),
(214, '1', 137, '63d007d42873e', '2023-02-24', 'unpaid'),
(215, '1', 138, '63d007d4288d7', '2023-02-24', 'unpaid'),
(216, '1', 139, '63d007d428a5f', '2023-02-24', 'unpaid'),
(217, '1', 140, '63d007d428c1d', '2023-02-24', 'unpaid'),
(218, '1', 141, '63d007d428dbe', '2023-02-24', 'unpaid'),
(219, '1', 142, '63d007d428f46', '2023-02-24', 'unpaid'),
(220, '1', 143, '63d007d429132', '2023-02-24', 'unpaid'),
(221, '1', 145, '63d007d4292c7', '2023-02-24', 'unpaid'),
(222, '1', 146, '63d007d429462', '2023-02-24', 'unpaid'),
(223, '1', 149, '63d007d4295a9', '2023-02-24', 'unpaid'),
(224, '1', 150, '63d007d4296de', '2023-02-24', 'unpaid'),
(225, '1', 151, '63d007d429853', '2023-02-24', 'unpaid'),
(226, '1', 152, '63d007d4299b2', '2023-02-24', 'unpaid'),
(227, '1', 153, '63d007d429aeb', '2023-02-24', 'unpaid'),
(228, '1', 154, '63d007d429c3f', '2023-02-24', 'unpaid'),
(229, '1', 155, '63d007d429da2', '2023-02-24', 'unpaid'),
(230, '1', 156, '63d007d429ee8', '2023-02-24', 'unpaid'),
(231, '1', 157, '63d007d429ffd', '2023-02-24', 'unpaid'),
(232, '1', 167, '63d007d42a13c', '2023-02-24', 'unpaid'),
(233, '1', 168, '63d007d42a28b', '2023-02-24', 'unpaid'),
(234, '1', 176, '63d007d42a3cf', '2023-02-24', 'unpaid'),
(235, '1', 177, '63d007d42a605', '2023-02-24', 'unpaid'),
(236, '1', 179, '63d007d42a7d3', '2023-02-24', 'unpaid'),
(237, '1', 180, '63d007d42a921', '2023-02-24', 'unpaid'),
(238, '1', 181, '63d007d42aad9', '2023-02-24', 'unpaid'),
(239, '1', 182, '63d007d42ac53', '2023-02-24', 'unpaid'),
(240, '1', 183, '63d007d42ad8b', '2023-02-24', 'unpaid'),
(241, '1', 184, '63d007d42aeb2', '2023-02-24', 'unpaid'),
(242, '1', 185, '63d007d42afd9', '2023-02-24', 'unpaid'),
(243, '1', 186, '63d007d42b102', '2023-02-24', 'unpaid'),
(244, '1', 187, '63d007d42b227', '2023-02-24', 'unpaid'),
(245, '1', 188, '63d007d42b345', '2023-02-24', 'unpaid'),
(246, '1', 189, '63d007d42b46c', '2023-02-24', 'unpaid'),
(247, '1', 190, '63d007d42b58b', '2023-02-24', 'unpaid'),
(248, '1', 198, '63d007d42b6a3', '2023-02-24', 'unpaid'),
(249, '1', 200, '63d007d42b7cd', '2023-02-24', 'unpaid'),
(250, '1', 201, '63d007d42b947', '2023-02-24', 'unpaid'),
(251, '1', 204, '63d007d42bb23', '2023-02-24', 'unpaid'),
(252, '1', 205, '63d007d42bd03', '2023-02-24', 'unpaid'),
(253, '1', 211, '63d007d42bec7', '2023-02-24', 'unpaid'),
(254, '1', 213, '63d007d42c010', '2023-02-24', 'unpaid'),
(255, '1', 214, '63d007d42c147', '2023-02-24', 'unpaid'),
(256, '1', 215, '63d007d42c270', '2023-02-24', 'unpaid'),
(257, '1', 216, '63d007d42c397', '2023-02-24', 'unpaid'),
(258, '1', 217, '63d007d42c4db', '2023-02-24', 'unpaid'),
(259, '1', 218, '63d007d42c600', '2023-02-24', 'unpaid'),
(260, '1', 220, '63d007d42c71a', '2023-02-24', 'unpaid'),
(261, '1', 221, '63d007d42c86a', '2023-02-24', 'unpaid'),
(262, '1', 222, '63d007d42c98d', '2023-02-24', 'unpaid'),
(263, '1', 223, '63d007d42cab8', '2023-02-24', 'unpaid'),
(264, '1', 224, '63d007d42cc00', '2023-02-24', 'unpaid'),
(265, '1', 225, '63d007d42cd65', '2023-02-24', 'unpaid'),
(266, '1', 227, '63d007d42cf18', '2023-02-24', 'unpaid'),
(267, '1', 228, '63d007d42d09c', '2023-02-24', 'unpaid'),
(268, '1', 235, '63d007d42d284', '2023-02-24', 'unpaid'),
(269, '1', 236, '63d007d42d3f0', '2023-02-24', 'unpaid'),
(270, '1', 237, '63d007d42d59b', '2023-02-24', 'unpaid'),
(271, '1', 238, '63d007d42d6c9', '2023-02-24', 'unpaid'),
(272, '1', 239, '63d007d42d7fe', '2023-02-24', 'unpaid'),
(273, '1', 240, '63d007d42d938', '2023-02-24', 'unpaid'),
(274, '1', 241, '63d007d42da64', '2023-02-24', 'unpaid'),
(275, '1', 242, '63d007d42db88', '2023-02-24', 'unpaid'),
(276, '1', 245, '63d007d42dca9', '2023-02-24', 'unpaid'),
(277, '1', 248, '63d007d42ddc1', '2023-02-24', 'unpaid'),
(278, '1', 249, '63d007d42dee4', '2023-02-24', 'unpaid'),
(279, '1', 251, '63d007d42e029', '2023-02-24', 'unpaid'),
(280, '1', 252, '63d007d42e146', '2023-02-24', 'unpaid'),
(281, '1', 253, '63d007d42e27d', '2023-02-24', 'unpaid'),
(282, '1', 254, '63d007d42e3e7', '2023-02-24', 'unpaid'),
(283, '1', 255, '63d007d42e59f', '2023-02-24', 'unpaid'),
(284, '1', 256, '63d007d42e76b', '2023-02-24', 'unpaid'),
(285, '1', 257, '63d007d42e950', '2023-02-24', 'unpaid'),
(286, '1', 258, '63d007d42eafd', '2023-02-24', 'unpaid'),
(287, '1', 259, '63d007d42ec39', '2023-02-24', 'unpaid'),
(288, '1', 260, '63d007d42ed6a', '2023-02-24', 'unpaid'),
(289, '1', 261, '63d007d42ee99', '2023-02-24', 'unpaid'),
(290, '1', 272, '63d007d42efc4', '2023-02-24', 'unpaid'),
(291, '1', 274, '63d007d42f0ee', '2023-02-24', 'unpaid'),
(292, '1', 275, '63d007d42f20f', '2023-02-24', 'unpaid'),
(293, '1', 283, '63d007d42f328', '2023-02-24', 'unpaid'),
(294, '1', 284, '63d007d42f447', '2023-02-24', 'unpaid'),
(295, '1', 285, '63d007d42f567', '2023-02-24', 'unpaid'),
(296, '1', 286, '63d007d42f690', '2023-02-24', 'unpaid'),
(297, '1', 287, '63d007d42f7b0', '2023-02-24', 'unpaid'),
(298, '1', 290, '63d007d42f8e5', '2023-02-24', 'unpaid'),
(299, '1', 291, '63d007d42faf9', '2023-02-24', 'unpaid'),
(300, '1', 292, '63d007d42fcda', '2023-02-24', 'unpaid'),
(301, '1', 297, '63d007d42fe93', '2023-02-24', 'unpaid'),
(302, '1', 298, '63d007d430081', '2023-02-24', 'unpaid'),
(303, '1', 299, '63d007d430281', '2023-02-24', 'unpaid'),
(304, '1', 300, '63d007d4303d8', '2023-02-24', 'unpaid'),
(305, '1', 301, '63d007d430506', '2023-02-24', 'unpaid'),
(306, '1', 302, '63d007d430646', '2023-02-24', 'unpaid'),
(307, '1', 303, '63d007d43077b', '2023-02-24', 'unpaid'),
(308, '1', 304, '63d007d43089c', '2023-02-24', 'unpaid'),
(309, '1', 305, '63d007d4309c9', '2023-02-24', 'unpaid'),
(310, '1', 306, '63d007d430b1d', '2023-02-24', 'unpaid'),
(311, '1', 307, '63d007d430c33', '2023-02-24', 'unpaid'),
(312, '1', 308, '63d007d430db6', '2023-02-24', 'unpaid'),
(313, '1', 309, '63d007d430f04', '2023-02-24', 'unpaid'),
(314, '1', 310, '63d007d43105a', '2023-02-24', 'unpaid'),
(315, '1', 311, '63d007d4311ed', '2023-02-24', 'unpaid'),
(316, '1', 312, '63d007d4313f4', '2023-02-24', 'unpaid'),
(317, '1', 313, '63d007d431572', '2023-02-24', 'unpaid'),
(318, '1', 314, '63d007d43171d', '2023-02-24', 'unpaid'),
(319, '1', 315, '63d007d43184a', '2023-02-24', 'unpaid'),
(320, '1', 316, '63d007d43196f', '2023-02-24', 'unpaid'),
(321, '1', 317, '63d007d431a92', '2023-02-24', 'unpaid'),
(322, '1', 318, '63d007d431bc3', '2023-02-24', 'unpaid'),
(323, '1', 319, '63d007d431ce9', '2023-02-24', 'unpaid'),
(324, '1', 320, '63d007d431dfc', '2023-02-24', 'unpaid'),
(325, '1', 321, '63d007d431f2a', '2023-02-24', 'unpaid'),
(326, '1', 322, '63d007d43203d', '2023-02-24', 'unpaid'),
(327, '1', 323, '63d007d43216a', '2023-02-24', 'unpaid'),
(328, '1', 324, '63d007d432293', '2023-02-24', 'unpaid'),
(329, '1', 327, '63d007d4323bf', '2023-02-24', 'unpaid'),
(330, '1', 328, '63d007d4324e8', '2023-02-24', 'unpaid'),
(331, '1', 334, '63d007d432605', '2023-02-24', 'unpaid'),
(332, '1', 335, '63d007d43271f', '2023-02-24', 'unpaid'),
(333, '1', 341, '63d007d432847', '2023-02-24', 'unpaid'),
(334, '1', 343, '63d007d432964', '2023-02-24', 'unpaid'),
(335, '1', 346, '63d007d432a7b', '2023-02-24', 'unpaid'),
(336, '1', 352, '63d007d432bb9', '2023-02-24', 'unpaid'),
(337, '1', 355, '63d007d432d21', '2023-02-24', 'unpaid'),
(338, '1', 356, '63d007d432e6c', '2023-02-24', 'unpaid'),
(339, '1', 357, '63d007d432f89', '2023-02-24', 'unpaid'),
(340, '1', 358, '63d007d4330b1', '2023-02-24', 'unpaid'),
(341, '1', 359, '63d007d4331d2', '2023-02-24', 'unpaid'),
(342, '1', 364, '63d007d4332fa', '2023-02-24', 'unpaid'),
(343, '1', 365, '63d007d43341f', '2023-02-24', 'unpaid'),
(344, '1', 366, '63d007d43353a', '2023-02-24', 'unpaid'),
(345, '1', 367, '63d007d433672', '2023-02-24', 'unpaid'),
(346, '1', 368, '63d007d4337a2', '2023-02-24', 'unpaid'),
(347, '1', 369, '63d007d4338bf', '2023-02-24', 'unpaid'),
(348, '1', 370, '63d007d4339d4', '2023-02-24', 'unpaid'),
(349, '1', 371, '63d007d433af8', '2023-02-24', 'unpaid'),
(350, '1', 380, '63d007d433c56', '2023-02-24', 'unpaid'),
(351, '1', 381, '63d007d433e15', '2023-02-24', 'unpaid'),
(352, '1', 385, '63d007d433fc4', '2023-02-24', 'unpaid'),
(353, '1', 394, '63d007d434184', '2023-02-24', 'unpaid'),
(354, '1', 395, '63d007d4342e9', '2023-02-24', 'unpaid'),
(355, '1', 415, '63d007d434444', '2023-02-24', 'unpaid'),
(356, '1', 416, '63d007d434578', '2023-02-24', 'unpaid'),
(357, '1', 417, '63d007d4346b1', '2023-02-24', 'unpaid'),
(358, '1', 418, '63d007d4347d7', '2023-02-24', 'unpaid'),
(359, '1', 419, '63d007d4348f5', '2023-02-24', 'unpaid'),
(360, '1', 420, '63d007d434a09', '2023-02-24', 'unpaid'),
(361, '1', 421, '63d007d434b29', '2023-02-24', 'unpaid'),
(362, '1', 422, '63d007d434c47', '2023-02-24', 'unpaid'),
(363, '1', 423, '63d007d434d70', '2023-02-24', 'unpaid'),
(364, '1', 424, '63d007d434ee7', '2023-02-24', 'unpaid'),
(365, '1', 66, '63d11848795ca', '2023-02-25', 'unpaid'),
(366, '1', 67, '63d11848795ca', '2023-02-25', 'unpaid'),
(367, '1', 68, '63d11848795ca', '2023-02-25', 'unpaid'),
(368, '1', 76, '63d11848795ca', '2023-02-25', 'unpaid'),
(369, '1', 77, '63d11848795ca', '2023-02-25', 'unpaid'),
(370, '1', 78, '63d11848795ca', '2023-02-25', 'unpaid'),
(371, '1', 62, '63d118aacf6ed', '2023-02-25', 'unpaid'),
(372, '1', 62, '63d1197331b43', '2023-02-25', 'unpaid'),
(373, '1', 62, '63d1197c2cc5e', '2023-02-25', 'unpaid'),
(374, '1', 63, '63d1197c2cc5e', '2023-02-25', 'unpaid'),
(375, '1', 64, '63d1197c2cc5e', '2023-02-25', 'unpaid'),
(376, '1', 39, '63d127d0cf01a', '2023-02-25', 'unpaid'),
(377, '1', 39, '63d1300329da9', '2023-02-25', 'unpaid'),
(378, '1', 40, '63d1300329da9', '2023-02-25', 'unpaid'),
(379, '1', 48, '63d14b002bd2a', '2023-02-25', 'unpaid'),
(380, '1', 49, '63d14b002bd2a', '2023-02-25', 'unpaid'),
(381, '1', 41, '63d7d9cf09ee2', '2023-03-02', 'unpaid'),
(382, '2', 2, '63da3025126fb', '2023-03-01', 'unpaid'),
(383, '2', 35, '63da30846a66d', '2023-03-01', 'unpaid'),
(384, '2', 2, '63da36494fa83', '2023-03-01', 'unpaid'),
(385, '2', 2, '63da39bc09ba0', '2023-03-01', 'unpaid'),
(386, '2', 2, '63da3a0bebd58', '2023-03-01', 'unpaid'),
(387, '2', 2, '63da3ad16cf79', '2023-03-01', 'unpaid'),
(388, '1', 2, '63db227f45671', '2023-03-02', 'unpaid'),
(389, '1', 35, '63db23972941a', '2023-03-02', 'unpaid'),
(390, '2', 35, '63db4f752dac4', '2023-03-02', 'unpaid'),
(391, '2', 2, '63db500dd842c', '2023-03-02', 'unpaid'),
(392, '2', 2, '63db507dc5569', '2023-03-02', 'unpaid'),
(393, '2', 35, '63db50f02b43c', '2023-03-02', 'unpaid'),
(394, '2', 3, '63db515ea0d2e', '2023-03-02', 'unpaid'),
(395, '2', 3, '63db51c1d5d08', '2023-03-02', 'unpaid'),
(396, '2', 2, '63db5210c45ed', '2023-03-02', 'unpaid'),
(397, '5', 2, '63db53d9a4172', '2023-03-02', 'unpaid'),
(398, '2', 2, '63db55a51ac1c', '2023-03-02', 'unpaid'),
(399, '10', 2, '63db6048caf6a', '2023-03-02', 'unpaid'),
(400, '2', 2, '63db79daa75f1', '2023-03-02', 'unpaid'),
(401, '11', 38, '63db7a0a79e07', '2023-03-02', 'unpaid'),
(402, '11', 2, '63db7a9f156a7', '2023-03-02', 'unpaid'),
(403, '12', 35, '63db7b6a1fe8b', '2023-03-02', 'unpaid'),
(404, '1', 35, '63db8414ad21f', '2023-03-02', 'unpaid'),
(405, '1', 40, '63db8742a1eca', '2023-03-02', 'unpaid'),
(406, '1', 35, '63db875e47a39', '2023-03-02', 'unpaid'),
(407, '1', 38, '63dba890db037', '2023-03-02', 'unpaid'),
(408, '1', 39, '63dbd875c99b5', '2023-03-02', 'unpaid'),
(409, '2', 36, '63dbdf5230f3d', '2023-03-02', 'unpaid'),
(410, '13', 35, '63dbe0bac289a', '2023-03-02', 'unpaid'),
(411, '1', 35, '63dcbb46c0313', '2023-03-03', 'unpaid'),
(412, '1', 36, '63dd1d14e660b', '2023-03-03', 'unpaid'),
(413, '1', 38, '63dd201890e0b', '2023-03-03', 'unpaid'),
(414, '18', 39, '0000000414', '2023-03-14', 'unpaid'),
(415, '24', 35, '0000000415', '2023-03-20', 'unpaid'),
(416, '28', 2, '0000000416', '2023-04-11', 'unpaid'),
(417, '29', 2, '0000000417', '2023-04-11', 'unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `mda`
--

CREATE TABLE `mda` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `industry` varchar(500) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `geolocation` varchar(50) DEFAULT NULL,
  `lga` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `status` enum('active','deactivated') NOT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mda`
--

INSERT INTO `mda` (`id`, `fullname`, `email`, `phone`, `industry`, `state`, `geolocation`, `lga`, `address`, `status`, `time_in`, `password`) VALUES
(3, 'Sule MDART', 'sule22@gmail.com', '2345667789', 'nil', 'Akwa Ibom', 'nil', '', 'nil', 'active', '2023-02-03 08:11:26', ''),
(4, 'AKIRS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(5, 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(6, 'AGRICULTURAL LOANS BOARD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(7, 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(8, 'AKWA IBOM HOTELS AND TOURISM BOARD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(9, 'AKWA IBOM STATE BUDGET OFFICE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(10, 'AKWA IBOM STATE JUDICIARY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(11, 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(12, 'BUREAU OF TECHNICAL MATTERS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(13, 'DEPARTMENT OF ESTABLISHMENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(14, 'GENERAL SERVICE OFFICE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(15, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(16, 'JUDIClAL SERVICE COMMISSION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(17, 'LAND USE ALLOCATION COMMITTEE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(18, 'LAW REFORM COMMISSION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(19, 'LOCAL GOVT. SERVICE COMMISSION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(20, 'OFFICE OF THE A/C GENERAL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(21, 'MINISTRY OF AGRICULTURE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(22, 'MINISTRY OF CULTURE AND TOURISM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(23, 'MINISTRY OF EDUCATION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(24, 'MINISTRY OF ENVIRONMENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(25, 'MINISTRY OF FINANCE HQ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(26, 'MINISTRY OF HEALTH HQ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(27, 'MINISTRY OF HOUSING AND SPECIAL DUTIES', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(28, 'MINISTRY OF INFORMATION AND COMMUNICATIONS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(29, 'MINISTRY OF JUSTICE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(30, 'MIN. OF LANDS AND TOWN PLANNING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(31, 'MINISTRY OF LOCAL GOVERNMENT AND CHIEFTANCY AFFAIRS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(32, 'MINISTRY OF RURAL DEVELOPMENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(33, 'MINISTRY OF SCIENCE AND TECHNOLOGY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(34, 'AKWA IBOM URBAN TAXI NETWORK LIMITED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(35, 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(36, 'MINISTRY OF WOMEN AFFAIRS AND SOCIAL DEVELOPMENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(37, 'MINISTRY OF WORKS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(38, 'MINISTRY OF YOUTH AND SPORTS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(39, 'OFFICE OF THE AUDITOR GENERAL(LOCAL GOVERNMENT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(40, 'OFFICE OF THE AUDITOR GENERAL(STATE)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(41, 'OFFICE OF THE HEAD OF CIVIL SERVICE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(42, 'OFFICE OF THE SECRETARY TO THE STATE GOVERNMENT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(43, 'SURVEYOR GENERAL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(44, 'POLITICAL AND LEGISLATIVE AFFAIRS BUREAU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(45, 'HOSPITAL MANAGEMENT BOARD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(46, 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(47, 'AKS CIVIL SERVICE COMMISSION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(48, 'FINANCE AND GEN. PURPOSE COMMITTEE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(49, 'AKWA IBOM STATE FIRE SERVICE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(50, 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(51, 'AKS COUNCIL FOR ARTS AND CULTURE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2023-01-18 07:39:05', ''),
(53, 'test', 'testrrr@gmail.com', '34567890', '', 'Akwa Ibom', '', 'Abak', '', 'active', '2023-02-03 08:09:27', '5Kufasvd6S'),
(57, 'test mda', 'emailaddress', 'phonenum', 'Poultry', 'Akwa Ibom', 'Akwa South', 'Chibuk', 'the address', 'active', '2023-02-23 08:06:36', 'YWmx6gHLOC'),
(58, 'test 2 mda', 'EMALL', 'PHONN', 'NAME 3', 'ESTAT', 'CIJ', 'LGAA', 'ADDEDD', 'deactivated', '2023-02-23 08:06:36', '8LWhAV6Ob2');

-- --------------------------------------------------------

--
-- Table structure for table `mda_users`
--

CREATE TABLE `mda_users` (
  `id` int(11) NOT NULL,
  `mda_id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone_number` varchar(300) NOT NULL,
  `passwd` varchar(200) NOT NULL,
  `dashboard_access` enum('view','full') NOT NULL,
  `revenue_head_access` enum('view','full') NOT NULL,
  `payment_access` enum('view','full') NOT NULL,
  `users_access` enum('view','full') NOT NULL,
  `report_access` enum('view','full') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mda_users`
--

INSERT INTO `mda_users` (`id`, `mda_id`, `name`, `email`, `phone_number`, `passwd`, `dashboard_access`, `revenue_head_access`, `payment_access`, `users_access`, `report_access`, `created_at`) VALUES
(1, 6, 'paul', 'paul@gmail.com', '09067656744', '12345', 'full', 'full', 'full', 'full', 'full', '2023-02-02 12:35:12'),
(2, 5, 'Job Kolo', 'Job@gmail.com', '090654653444', '12345', 'full', 'full', 'full', 'full', 'full', '2023-02-02 12:36:17'),
(3, 6, 'Lawal', 'lawal@gmail.com', '0908787656', '12345', 'view', 'view', 'view', 'full', 'full', '2023-02-02 12:37:28'),
(5, 4, 'Aliyu kamilu', 'aliyukamilu005@gmail.com', '91838337', '12345', '', 'view', 'full', '', 'view', '2023-02-04 13:04:05'),
(6, 6, 'Aliyu Nurudeen', 'deen.aliyu40@gmail.com', '09043432434', '12345', '', 'view', 'view', '', '', '2023-02-08 10:24:04');

-- --------------------------------------------------------

--
-- Table structure for table `our_services`
--

CREATE TABLE `our_services` (
  `id` int(11) NOT NULL,
  `header` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `icon` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `our_services`
--

INSERT INTO `our_services` (`id`, `header`, `body`, `icon`, `created_at`) VALUES
(1, 'SELF SERVICE', 'Sign in or register to pay bills or taxes as an Individual, corporate, state agency or federal agency.', 'mdi:person-check', '2023-02-24 20:26:11'),
(2, 'PAY TAXES AND SERVICES', 'You can pay for taxes, services or bills such as PAYE, Land use charge Vehicle registration, Withholding tax, Business premises, Capital gain tax, Waste management, etc.', 'mdi:auto-pay', '2023-02-24 20:27:04'),
(3, 'MULTIPLE PAYMENT CHANNELS', 'Enjoy a faster and easier way to pay taxes or bills. Payments can be made against an invoice at any bank branch or online payments with debits cards (POS, Verve, Visa, or MasterCard', 'mdi:account-payment', '2023-02-24 20:27:37'),
(4, 'PAYMENT TRANSACTION RECORDS', 'View your tax information and payment history over a period of time.', 'icon-park-solid:transaction-order', '2023-02-24 20:28:09'),
(5, 'LEARN MORE', 'We are here to help you understand how to pay your bills or taxes with ease.', 'eos-icons:machine-learning', '2023-02-24 20:28:40'),
(6, 'TRACK TRANSACTION', 'Easy access to your payment history and receipt. View, share and download your receipts with ease.', 'ant-design:transaction-outlined', '2023-02-24 20:29:14');

-- --------------------------------------------------------

--
-- Table structure for table `payer_user`
--

CREATE TABLE `payer_user` (
  `id` int(11) NOT NULL,
  `tax_number` varchar(50) NOT NULL,
  `tin` varchar(100) NOT NULL,
  `category` enum('Corporate','Individual','State Agency','Federal Agency') NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `surname` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `state` varchar(50) NOT NULL,
  `business_type` varchar(255) NOT NULL,
  `employment_status` varchar(255) NOT NULL,
  `number_of_staff` varchar(10000) NOT NULL,
  `lga` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `img` longtext NOT NULL,
  `password` varchar(100) NOT NULL,
  `verification_status` varchar(500) NOT NULL,
  `verification_code` int(20) NOT NULL,
  `tin_status` enum('Unverified','Verified') NOT NULL,
  `timeIn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payer_user`
--

INSERT INTO `payer_user` (`id`, `tax_number`, `tin`, `category`, `first_name`, `surname`, `email`, `phone`, `state`, `business_type`, `employment_status`, `number_of_staff`, `lga`, `address`, `img`, `password`, `verification_status`, `verification_code`, `tin_status`, `timeIn`) VALUES
(1, 'SDSD-SS', '', 'Individual', 'Bello', 'Abubakar', 'abu@yahoo.com', '234234554465', 'Akwa Ibom', '', '', '', 'Eastern Obolo', 'ddd', '', '12345', 'M3ZHWWV0NGgxVkdMRWV1NkY2b0JqZkM0Uml0dm95K1BTZzc2SUx4c2ZPZz0=', 0, 'Verified', '2023-02-04 13:54:13'),
(13, '16753542986362', '', 'Corporate', 'Steamledge Limited', '08135719391', 'aliyukamilu003@gmail.com', '23456788984', '', '', '', '', '', '', '', '12345', 'SGtnVFpoVFAwWVR1RmR4eFRDeXdnWVhnQk5TaVVWWXl1R2ZtQ2JEa2Q1ND0=', 0, 'Unverified', '2023-02-02 16:11:38'),
(14, 'AKW-56048172', '', 'Individual', 'sd', 'we', 'aliyukamilu0ee02@gmail.com', '+2348135719391', 'Akwa Ibom', '', '', '', '--Select LGA--', '89 Lamido Crescent', '', 'ww', 'YzFtSUticlM0dlFjZE5GR1FYNFJNSncrdUptc0M0TzZoOE02ZFdIMHE1Vm84QmtnYktSemFobDF1WEdldWxYVw==', 0, 'Unverified', '2023-02-13 11:37:54'),
(24, 'AKW2-79516', '1234567890-1111', 'Individual', 'Aliyu', 'Kamilu', 'aliyukamilu002@gmail.com', '08135719391', 'Akwa Ibom', '', '', '', 'Eket', '89 Lamido Crescent', '', 'Aliyu@2003', '1', 734263, 'Unverified', '2023-02-17 11:40:55'),
(25, 'AKW1-51827', '', 'Corporate', 'aljtr', 'oerk', 'reok', 'roe', 'Akwa Ibom', '', '', '', 'Eastern Obolo', 'rte', '', '12345', 'TGdEeTZLVHlCTVcydEdydmpWTlVGZz09', 494542, 'Unverified', '2023-03-11 15:02:40'),
(26, 'AKW2-18732', 'we', 'Individual', 'o', 'je', 'erjk', 'rejlkw', 'Akwa Ibom', '', '', '', 'Abak', 'tirpe', '', '12345', 'UnhMaS9MZHBPOW4xbXdQQ2hxbXZTdz09', 271902, 'Unverified', '2023-03-11 15:05:09'),
(27, 'AKW2-47953', 'fkw;slkf', 'Individual', 'uho', 'r', 'kbjn', 'ern', 'Akwa Ibom', '', '', '', 'Esit Eket', 'eorjfwpoe', '', '12345', 'LzVVRUtwMGJFSWFCOHdxQUZWUy9CQT09', 733249, 'Unverified', '2023-03-11 15:07:47'),
(28, 'AKW2-82361', 'epo', 'Individual', 'ertiuhroi', 'eriuoh', 'eriuo', 'ewr', 'Akwa Ibom', '', '', '', 'Abak', 'eorip', '', '12345', 'VjMwWlYxaVdJbDRrTDB4MDk4aG1hQT09', 581270, 'Unverified', '2023-03-11 15:08:57'),
(29, 'AKW2-32719', '2323232', 'Individual', 'aliyu', 'kamilu', 'aaa@fd.com', '13232323', 'Akwa Ibom', '', '', '', 'Abak', 'the address', '', '12345', 'UkRVYS9YM21QUDBjTTJ1STg3akN4WEQ4dDhrQ1NIT2puVk1OTS9UNjFzYz0=', 256018, 'Unverified', '2023-03-11 16:09:54'),
(30, 'AKWindividual-21860', '1111111111-1111', 'Individual', 'Aliyu', 'Nurudeen', 'deen.aliyu4066@gmail.com', '08162248564', 'Akwa Ibom', 'Education', '', '', 'Uruan', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deenaliyu3677', 'dmx1WXN1RVlITUNIL2tSaEUxMEVUWHNnM3FGY3Z2YmdRRG55OHBQcDN2TT0=', 366108, 'Unverified', '2023-03-12 09:14:12'),
(31, 'AKWindividual-86473', '1111111111-1111', 'Individual', 'Aliyu', 'Nurudeen', 'deen.aliyu4066o@gmail.com', '08162248564', 'Akwa Ibom', 'Education', '', '', 'Uruan', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deenaliyu3677', 'QVBzVzlBUmw0TG9YV0w0Ty9vcWdSa2w4ZXRNeGlZU3NkWmtWQnFnUnVxZ0tVbCsvbmwrVkNoL0Z6QTh0QUZ2WQ==', 714892, 'Unverified', '2023-03-12 09:16:19'),
(32, 'AKWindividual-95230', '1111111111-1111', 'Individual', 'Aliyu', 'Nurudeen', 'deen.aliyu40662o@gmail.com', '08162248564', 'Akwa Ibom', 'Education', '', '', 'Uruan', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deenaliyu3677', 'LzdSYVRrd3JnS1FFN051M0x4ZVAxTTlkUWlxL1BkTEhzSFozTXZpV09zQmlOZ0djMUhYTStQam1uWGFvOTRDTQ==', 829369, 'Unverified', '2023-03-12 09:17:10'),
(33, 'AKWindividual-75081', '1111111111-1111', 'Individual', 'Aliyu', 'Nurudeen', 'deen.aliyu406624o@gmail.com', '08162248564', 'Akwa Ibom', 'Education', 'Employee', '', 'Uruan', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deenaliyu3677', 'Vzk5L095V1oyYlZIN0ZaUk43U0lIZXRpRTROWjY2S2l1MklpNXhUNXU3VHZlQWxiZU9XUzIvMTAxQTJoTmQycQ==', 39264, 'Unverified', '2023-03-12 09:18:26'),
(34, 'AKW1-87612', '1111111111-1111', 'Corporate', 'Aliyu', 'Nurudeen', 'deen.aliyu40444@gmail.com', '08162248564', 'Akwa Ibom', 'Hospitality', 'Selfemployed', '', 'Eastern Obolo', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deen3677', 'bkVjZnZlSzRINkFBRzk5cnhKVGVRankyWk9RREZBZUk0R1ZkRm9qR1Y0R2J5RjUxVlRGZzkzQ21XY2dmRXJmQg==', 947946, 'Unverified', '2023-03-12 09:43:05'),
(35, 'AKW1-04519', '1111111111-1111', 'Corporate', 'Aliyu', 'Nurudeen', 'deen.aliyu40@gmail.com', '08162248564', 'Akwa Ibom', 'Pool', 'Selfemployed', '', 'Esit Eket', 'Flat 373 Federal lowcost kontagora', 'assets/img/userprofile.png', '@Deen3677', 'WWhjejE3NkJLazhQRUlaQWlOQzZJazI2Y2pSdDN2WUJCdWV4c1dFa1ZXST0=', 524880, 'Unverified', '2023-03-12 09:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `payment_2`
--

CREATE TABLE `payment_2` (
  `id` int(11) NOT NULL,
  `0` varchar(100) DEFAULT NULL,
  `1` int(255) DEFAULT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_collection_report_individual`
--

CREATE TABLE `payment_collection_report_individual` (
  `id` int(11) NOT NULL,
  `mda_id` varchar(255) NOT NULL,
  `revenue_head` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `payment_channel` enum('Remita','PayStack','FlutterWave','InterSwitch') NOT NULL,
  `payment_reference_number` varchar(50) NOT NULL,
  `receipt_number` varchar(50) NOT NULL,
  `timeIn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_collection_report_individual`
--

INSERT INTO `payment_collection_report_individual` (`id`, `mda_id`, `revenue_head`, `user_id`, `invoice_number`, `payment_channel`, `payment_reference_number`, `receipt_number`, `timeIn`) VALUES
(4, 'AKIRS', 7, 1, '63cfc403aa282', 'PayStack', 'XDRR5WE-XX', 'XDRR5WE-ZX', '2023-01-24 13:58:29');

-- --------------------------------------------------------

--
-- Table structure for table `payment_form_labels`
--

CREATE TABLE `payment_form_labels` (
  `id` int(11) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `mda_id` int(255) NOT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_form_labels`
--

INSERT INTO `payment_form_labels` (`id`, `table_name`, `content`, `mda_id`, `time_in`) VALUES
(25, 'payment_2', 'customer name^text,amount^number', 2, '2023-01-09 18:21:45');

-- --------------------------------------------------------

--
-- Table structure for table `pending_payment_list`
--

CREATE TABLE `pending_payment_list` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `payer_id` int(11) NOT NULL,
  `mda_id` int(11) NOT NULL,
  `revenue_id` int(11) NOT NULL,
  `payment_amount` double(10,2) NOT NULL,
  `other_info` longtext NOT NULL,
  `payment_status` enum('unpaid','invoiced','paid') NOT NULL,
  `status` enum('inactive','active') NOT NULL,
  `date_of_payment` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pending_payment_list`
--

INSERT INTO `pending_payment_list` (`id`, `user_id`, `payer_id`, `mda_id`, `revenue_id`, `payment_amount`, `other_info`, `payment_status`, `status`, `date_of_payment`) VALUES
(1, 2, 1, 5, 2, 140.00, 'Mon, Tues, Wed', 'unpaid', 'inactive', '2023-01-12'),
(2, 2, 1, 4, 2, 140.00, 'Mon, Tues, Wed', 'unpaid', 'inactive', '2023-01-12');

-- --------------------------------------------------------

--
-- Table structure for table `primary_tax_clearance_certificate`
--

CREATE TABLE `primary_tax_clearance_certificate` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `category` varchar(350) NOT NULL,
  `title` varchar(400) NOT NULL,
  `first_name` varchar(400) NOT NULL,
  `surname` varchar(400) NOT NULL,
  `middle_name` varchar(400) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(400) NOT NULL,
  `merital_status` varchar(400) NOT NULL,
  `tin` varchar(400) NOT NULL,
  `bvn` varchar(400) NOT NULL,
  `state` varchar(400) NOT NULL,
  `local_area` varchar(400) NOT NULL,
  `ward` varchar(400) NOT NULL,
  `city` varchar(400) NOT NULL,
  `street_name` varchar(400) NOT NULL,
  `house_no` varchar(400) NOT NULL,
  `national_id_no` varchar(400) NOT NULL,
  `phone` varchar(400) NOT NULL,
  `natioality` varchar(450) NOT NULL,
  `tax_station_name` varchar(450) NOT NULL,
  `employment_type` varchar(450) NOT NULL,
  `occupation` varchar(450) NOT NULL,
  `profession` varchar(450) NOT NULL,
  `mother_maiden_name` varchar(450) NOT NULL,
  `first_year` date NOT NULL,
  `first_income` varchar(450) NOT NULL,
  `second_year` date NOT NULL,
  `second_income` varchar(450) NOT NULL,
  `third_year` date NOT NULL,
  `third_income` varchar(450) NOT NULL,
  `tax_paid` varchar(450) NOT NULL,
  `cop_rep_authorization` varchar(450) NOT NULL,
  `head_tax_station_authorization` varchar(450) NOT NULL,
  `reference_number` varchar(400) NOT NULL,
  `application_status` enum('approved','pending') NOT NULL,
  `admin_status` enum('active','inactive') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `primary_tax_clearance_certificate`
--

INSERT INTO `primary_tax_clearance_certificate` (`id`, `user_id`, `category`, `title`, `first_name`, `surname`, `middle_name`, `date_of_birth`, `gender`, `merital_status`, `tin`, `bvn`, `state`, `local_area`, `ward`, `city`, `street_name`, `house_no`, `national_id_no`, `phone`, `natioality`, `tax_station_name`, `employment_type`, `occupation`, `profession`, `mother_maiden_name`, `first_year`, `first_income`, `second_year`, `second_income`, `third_year`, `third_income`, `tax_paid`, `cop_rep_authorization`, `head_tax_station_authorization`, `reference_number`, `application_status`, `admin_status`, `created_at`) VALUES
(1, 1, 'string', 'Mr', 'string', 'string', 'string', '2023-03-01', 'male', 'Single', '12345', '3456789', 'Niger', 'Bida', 'Wadata', 'Bida', 'string', '1234', '3345678', '090878987645', 'Nigeria', 'string', 'string', 'string', 'string', 'string', '2023-03-01', '200', '2023-03-01', '300', '2023-03-01', '400', '7000', 'string', 'string', '23456', 'pending', 'active', '2023-03-13 10:56:59'),
(2, 2, 'string1', 'Mrs', 'string1', 'string1', 'string1', '2023-03-01', 'Female', 'Married', '12345', '3456789', 'Niger', 'Bida', 'Wadata', 'Bida', 'string1', '1234', '3345678', '090878987645', 'Nigeria', 'string', 'string', 'string', 'string', 'string', '2023-03-01', '200', '2023-03-01', '300', '2023-03-01', '400', '7000', 'string1', 'string1', '23456', 'pending', 'active', '2023-03-13 10:57:57'),
(3, 3, 'string', 'Mr', 'string', 'string', 'string', '2023-03-01', 'male', 'Single', '12345', '3456789', 'Niger', 'Bida', 'Wadata', 'Bida', 'string', '1234', '3345678', '090878987645', 'Nigeria', 'string', 'string', 'string', 'string', 'string', '2023-03-01', '200', '2023-03-01', '300', '2023-03-01', '400', '7000', 'string', 'string', '1678711440', 'pending', 'active', '2023-03-13 12:40:36');

-- --------------------------------------------------------

--
-- Table structure for table `primary_TIN_request`
--

CREATE TABLE `primary_TIN_request` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(400) NOT NULL,
  `first_name` varchar(400) NOT NULL,
  `surname` varchar(400) NOT NULL,
  `middle_name` varchar(400) DEFAULT NULL,
  `natioality` varchar(400) NOT NULL,
  `phone_number_1` varchar(400) NOT NULL,
  `phone_number_2` varchar(400) NOT NULL,
  `state_of_origin` varchar(400) NOT NULL,
  `marital_status` varchar(400) NOT NULL,
  `birthday` date NOT NULL,
  `occupation` varchar(400) NOT NULL,
  `gender` varchar(400) NOT NULL,
  `email` varchar(400) NOT NULL,
  `mother_maiden_name` varchar(400) NOT NULL,
  `mother_name` varchar(400) NOT NULL,
  `id_card` varchar(400) NOT NULL,
  `id_number` varchar(400) NOT NULL,
  `date_issue` date NOT NULL,
  `expiring_date` date NOT NULL,
  `place_of_issue` varchar(400) NOT NULL,
  `id_issuing_authority` varchar(400) NOT NULL,
  `last_assessment_date` date DEFAULT NULL,
  `last_assessment_amount` varchar(400) DEFAULT NULL,
  `last_payment_date` date DEFAULT NULL,
  `last_payment_amount` varchar(400) DEFAULT NULL,
  `tax_type` varchar(400) DEFAULT NULL,
  `first_year` varchar(400) DEFAULT NULL,
  `first_income` varchar(400) DEFAULT NULL,
  `second_year` varchar(400) DEFAULT NULL,
  `second_income` varchar(400) DEFAULT NULL,
  `third_year` varchar(400) DEFAULT NULL,
  `third_income` varchar(400) DEFAULT NULL,
  `reference_number` varchar(400) NOT NULL,
  `application_status` enum('approved','pending') NOT NULL,
  `admin_status` enum('active','inactive') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `primary_TIN_request`
--

INSERT INTO `primary_TIN_request` (`id`, `user_id`, `title`, `first_name`, `surname`, `middle_name`, `natioality`, `phone_number_1`, `phone_number_2`, `state_of_origin`, `marital_status`, `birthday`, `occupation`, `gender`, `email`, `mother_maiden_name`, `mother_name`, `id_card`, `id_number`, `date_issue`, `expiring_date`, `place_of_issue`, `id_issuing_authority`, `last_assessment_date`, `last_assessment_amount`, `last_payment_date`, `last_payment_amount`, `tax_type`, `first_year`, `first_income`, `second_year`, `second_income`, `third_year`, `third_income`, `reference_number`, `application_status`, `admin_status`, `created_at`) VALUES
(1, 2, 'Mr', 'string', 'string', 'string', 'Nigeria', '09087878787', '09088787676', 'Bida', 'Single', '2023-03-01', 'string', 'Male', 'string@gmail.com', 'string', 'string', '23434345', '45656545', '2023-03-01', '2023-03-09', 'Bida', 'string', '2023-03-08', '400', '2023-03-02', '300', 'string', '2000', '2001', '2001', '2001', '2001', '2001', '1678723199', 'pending', 'active', '2023-03-13 15:54:23'),
(2, 2, 'Mr', 'string', 'string', 'string', 'Nigeria', '09087878787', '09088787676', 'Bida', 'Single', '2023-03-01', 'string', 'Male', 'string@gmail.com', 'string', 'string', '23434345', '45656545', '2023-03-01', '2023-03-09', 'Bida', 'string', '2023-03-08', '400', '2023-03-02', '300', 'string', '2000', '2001', '2001', '2001', '2001', '2001', '1678723858', 'pending', 'active', '2023-03-13 16:08:26'),
(3, 2, 'Mr', 'string', 'string', 'string', 'Nigeria', '09087878787', '09088787676', 'Bida', 'Single', '2023-03-01', 'string', 'Male', 'string@gmail.com', 'string', 'string', '23434345', '45656545', '2023-03-01', '2023-03-09', 'Bida', 'string', '2023-03-08', '400', '2023-03-02', '300', 'string', '2000', '2001', '2001', '2001', '2001', '2001', '1678725889', 'pending', 'active', '2023-03-13 16:31:12');

-- --------------------------------------------------------

--
-- Table structure for table `revenue_heads`
--

CREATE TABLE `revenue_heads` (
  `id` int(11) NOT NULL,
  `COL_1` varchar(12) DEFAULT NULL,
  `COL_2` varchar(13) DEFAULT NULL,
  `COL_3` varchar(51) DEFAULT NULL,
  `COL_4` varchar(67) DEFAULT NULL,
  `COL_5` varchar(14) DEFAULT NULL,
  `COL_6` varchar(6) DEFAULT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `revenue_heads`
--

INSERT INTO `revenue_heads` (`id`, `COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`, `time_in`) VALUES
(2, '124456G', '12010104', 'AKIRS', 'Witholding Tax (General)', 'State Agency', '1100', '2023-01-23 08:22:55'),
(3, '', '12010105', 'AKIRS', 'Pay As You Earn (PAYE)', 'State Agency', '1000', '2023-01-18 07:41:29'),
(4, '', '12010106', 'AKIRS', 'Direct Assesment', 'State Agency', '2300', '2023-01-18 07:41:29'),
(5, '', '12010107', 'AKIRS', 'Stamp Duties', 'State Agency', '1000', '2023-01-18 07:41:29'),
(6, '', '12010117', 'AKIRS', 'Informal Sector Taxes', 'State Agency', '1200', '2023-01-18 07:41:29'),
(7, '', '12010108', 'AKIRS', 'Pools Betting Tax - Agents', 'Individual', '1150', '2023-01-18 07:41:29'),
(8, '', '12010109', 'AKIRS', 'Tax Arrears', 'State Agency', '4500', '2023-01-18 07:41:29'),
(9, '', '12020122', 'AKIRS', 'Pools Betting License: Issues', 'Individual', '2550', '2023-01-18 07:41:29'),
(10, '', '12020123', 'AKIRS', 'Pools Betting License: Renewals', 'Individual', '3555', '2023-01-18 07:41:29'),
(11, '', '12020124', 'AKIRS', 'Motor Vehicle License: Renewals', 'Federal Agency', '2310', '2023-01-18 07:41:29'),
(12, '', '12020458', 'AKIRS', 'Motor Vehicle License: Issues', 'Federal Agency', '1240', '2023-01-18 07:41:29'),
(13, '', '12020125', 'AKIRS', 'Drivers License - Renewals', 'Federal Agency', '5000', '2023-01-18 07:41:29'),
(14, '', '12020127', 'AKIRS', 'Drivers License - Issues', 'Federal Agency', '1010', '2023-01-18 07:41:29'),
(15, '', '12020465', 'AKIRS', 'Road Worthiness', 'Federal Agency', '4556', '2023-01-18 07:41:29'),
(16, '', '12020129', 'AKIRS', 'Dealers License', 'State Agency', '1234', '2023-01-18 07:41:29'),
(17, '', '12020445', 'AKIRS', 'Change of Engine', 'State Agency', '3200', '2023-01-18 07:41:29'),
(18, '', '12020445', 'AKIRS', 'Change of Ownership', 'State Agency', '1455', '2023-01-18 07:41:29'),
(19, '', '12020445', 'AKIRS', 'Proof of Ownership of Vehicle', 'State Agency', '1869', '2023-01-18 07:41:29'),
(20, '', '12020455', 'AKIRS', 'Replacement of Security Document', 'Federal Agency', '6547', '2023-01-18 07:41:29'),
(21, '', '12020455', 'AKIRS', 'Loss of Tax Reciept', 'State Agency', '8643', '2023-01-18 07:41:29'),
(22, '', '12020458', 'AKIRS', 'Registartion of Motor Vehicles Issues/Renewal', 'Federal Agency', '5673', '2023-01-18 07:41:29'),
(23, '', '12020478', 'AKIRS', 'Learners Permit', 'Federal Agency', '9876', '2023-01-18 07:41:29'),
(24, '', '12020448', 'AKIRS', 'Administrative Charges', 'State Agency', '5678', '2023-01-18 07:41:29'),
(25, '', '12020448', 'AKIRS', 'Economic Development Levy', 'State Agency', '1450', '2023-01-18 07:41:29'),
(26, '', '12020465', 'AKIRS', 'Extraction of Information', 'State Agency', '3301', '2023-01-18 07:41:29'),
(27, '', '12020465', 'AKIRS', 'Sealing of Document', 'State Agency', '3452', '2023-01-18 07:41:29'),
(28, '', '12020468', 'AKIRS', 'Disclosure Fees', 'State Agency', '4345', '2023-01-18 07:41:29'),
(29, '', '12010604', 'AKIRS', 'Sales of Condemn Stores', 'State Agency', '2000', '2023-01-18 07:41:29'),
(30, '', '12010485', 'AKIRS', 'Hackney Permit', 'State Agency', '2344', '2023-01-18 07:41:29'),
(31, '', '12010126', 'AKIRS', 'Gaming Machine license', 'State Agency', '5673', '2023-01-18 07:41:29'),
(32, '', '12010616', 'AKIRS', 'Sales of Unservicable Vehicle', 'State Agency', '4567', '2023-01-18 07:41:29'),
(33, '', '12010621', 'AKIRS', 'Sales of Unservicable Items', 'State Agency', '7656', '2023-01-18 07:41:29'),
(34, '', '12010632', 'AKIRS', 'Sales of Badges and Plate Numbers', 'State Agency', '6356', '2023-01-18 07:41:29'),
(35, '051706600100', '12020457', 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', 'Reg. of Evening Continunig Education', 'Individual', '9564', '2023-01-18 07:41:29'),
(36, '', '12020457', 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', 'Renewl Fee of Evening Continunig Education', 'Individual', '1342', '2023-01-18 07:41:29'),
(37, '', '12020448', 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', 'Dev. Fee for Adult Edu. Training Centers', 'Individual', '2333', '2023-01-18 07:41:29'),
(38, '', '12020638', 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', 'Sales of Forms for Opening of Cont. Edu. Centers', 'Individual', '3450', '2023-01-18 07:41:29'),
(39, '021511200100', '12021201', 'AGRICULTURAL LOANS BOARD', 'Charges on Loans Project Appraisal', 'State Agency', '3563', '2023-01-18 07:41:29'),
(40, '', '12021211', 'AGRICULTURAL LOANS BOARD', 'Recovery From Agric Loans Board', 'State Agency', '3123', '2023-01-18 07:41:29'),
(41, '01110190020', '12020713', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Electricity Surcharge', 'State Agency', '1000', '2023-01-18 07:41:29'),
(42, '', '12020458', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Taxi Registration', 'State Agency', '1001', '2023-01-18 07:41:29'),
(43, '', '12020462', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Landing Charges', 'State Agency', '1002', '2023-01-18 07:41:29'),
(44, '', '12020454', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Parking Charges', 'State Agency', '1003', '2023-01-18 07:41:29'),
(45, '', '12020454', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Overnight Parking', 'State Agency', '1004', '2023-01-18 07:41:29'),
(46, '', '12020463', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Excursion', 'State Agency', '1005', '2023-01-18 07:41:29'),
(47, '', '12020454', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Access Gate Charges', 'State Agency', '1006', '2023-01-18 07:41:29'),
(48, '', '12020462', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Apron Pass', 'State Agency', '1007', '2023-01-18 07:41:29'),
(49, '', '12020436', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Indoor Advert (Banner)', 'State Agency', '1008', '2023-01-18 07:41:29'),
(50, '', '12020473', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'On Duty Card', 'State Agency', '1009', '2023-01-18 07:41:29'),
(51, '', '12020462', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Passenger Service Charges', 'State Agency', '1010', '2023-01-18 07:41:29'),
(52, '', '12020805', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Desk Space', 'State Agency', '1011', '2023-01-18 07:41:29'),
(53, '', '12020484', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Trolley Service', 'State Agency', '1450', '2023-01-18 07:41:29'),
(54, '', '12020810', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Rent on Government Room', 'State Agency', '1451', '2023-01-18 07:41:29'),
(55, '', '12020620', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Fuel', 'State Agency', '1452', '2023-01-18 07:41:29'),
(56, '', '12020465', 'AKWA IBOM AIRPORT DEVELOPMENT COMPANY LIMITED', 'Service Recovery Charge', 'State Agency', '1453', '2023-01-18 07:41:29'),
(57, '011101900200', '12020449', 'AKWA IBOM HOTELS AND TOURISM BOARD', 'Franchise to Beauty Pageants', 'Corporate', '1455', '2023-01-18 07:41:29'),
(58, '', '12020449', 'AKWA IBOM HOTELS AND TOURISM BOARD', 'Grading Fees for Hospitality Establishment', 'State Agency', '1456', '2023-01-18 07:41:29'),
(59, '', '12020449', 'AKWA IBOM HOTELS AND TOURISM BOARD', 'Promotion Endorsement Fees for Tourism Enterprise', 'State Agency', '1457', '2023-01-18 07:41:29'),
(60, '', '12020457', 'AKWA IBOM HOTELS AND TOURISM BOARD', 'Reg. Fees for Hospitality Establishment', 'State Agency', '1458', '2023-01-18 07:41:29'),
(61, '', '12020623', 'AKWA IBOM HOTELS AND TOURISM BOARD', 'Sales of Registration Forms for Listing of Hotels', 'State Agency', '1560', '2023-01-18 07:41:29'),
(62, '02200030010', '12020616', 'AKWA IBOM STATE BUDGET OFFICE', 'Sales of Unserviceable Item', 'State Agency', '3450', '2023-01-18 07:41:29'),
(63, '', '12020631', 'AKWA IBOM STATE BUDGET OFFICE', 'Sales of Estimates Booklet', 'State Agency', '9800', '2023-01-18 07:41:29'),
(64, '', '12020455', 'AKWA IBOM STATE BUDGET OFFICE', 'Search Fees for the Lost of Service Document', 'State Agency', '4070', '2023-01-18 07:41:29'),
(65, '', '12020474', 'AKWA IBOM STATE BUDGET OFFICE', 'Margin for Revenue', 'State Agency', '6780', '2023-01-18 07:41:29'),
(66, '03180010010', '12020401', 'AKWA IBOM STATE JUDICIARY', 'Tribunal Fees', 'State Agency', '4550', '2023-01-18 07:41:29'),
(67, '', '12020703', 'AKWA IBOM STATE JUDICIARY', 'Fuel Dump', 'State Agency', '1111', '2023-01-18 07:41:29'),
(68, '', '12020705', 'AKWA IBOM STATE JUDICIARY', 'Hiring of Multi-Purpose Hall', 'Individual', '2342', '2023-01-18 07:41:29'),
(69, '', '12020401 - a', 'AKWA IBOM STATE JUDICIARY', 'Court Fees-a', 'State Agency', '2343', '2023-01-18 07:41:29'),
(70, '', '12020401 -b', 'AKWA IBOM STATE JUDICIARY', 'Customary Court Fees', 'State Agency', '2344', '2023-01-18 07:41:29'),
(71, '', '12020427', 'AKWA IBOM STATE JUDICIARY', 'Tenders Fees', 'Corporate', '2345', '2023-01-18 07:41:29'),
(72, '', '12020401', 'AKWA IBOM STATE JUDICIARY', 'Probate Fees', 'State Agency', '2346', '2023-01-18 07:41:29'),
(73, '', '12020502', 'AKWA IBOM STATE JUDICIARY', 'Court Fines', 'State Agency', '2347', '2023-01-18 07:41:29'),
(74, '', '12020502', 'AKWA IBOM STATE JUDICIARY', 'Customary Court Fines', 'State Agency', '6758', '2023-01-18 07:41:29'),
(75, '', '12020511', 'AKWA IBOM STATE JUDICIARY', 'Tribunal Fines', 'State Agency', '3582', '2023-01-18 07:41:29'),
(76, '', '12020604', 'AKWA IBOM STATE JUDICIARY', 'Reg. and Renewal of Contractor', 'State Agency', '9475', '2023-01-18 07:41:29'),
(77, '', '12020634', 'AKWA IBOM STATE JUDICIARY', 'Sales of Unserviceable Vehicles', 'State Agency', '8568', '2023-01-18 07:41:29'),
(78, '', '12020634', 'AKWA IBOM STATE JUDICIARY', 'Sales of Confiscated Goods', 'State Agency', '9274', '2023-01-18 07:41:29'),
(79, '01111880010', '12020448', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Search Fees for the Lost of Service Document', 'State Agency', '3857', '2023-01-18 07:41:29'),
(80, '', '12020433', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Co-operative Societies Registration Fees', 'State Agency', '3947', '2023-01-18 07:41:29'),
(81, '', '12020440', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Co-operative Audit and Supervision Fees', 'State Agency', '3658', '2023-01-18 07:41:29'),
(82, '', '12020455', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Replacement of lost Co-operative Certificate', 'State Agency', '2394', '2023-01-18 07:41:29'),
(83, '', '12020442', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Amendment of Co-operative Societies Bye-Law Fees', 'State Agency', '1993', '2023-01-18 07:41:29'),
(84, '', '12020456', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Registration projects', 'State Agency', '9287', '2023-01-18 07:41:29'),
(85, '', '12020442', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Co-operative Societies Renewal', 'State Agency', '3534', '2023-01-18 07:41:29'),
(86, '', '12020456', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Registration of Development Association', 'State Agency', '2453', '2023-01-18 07:41:29'),
(87, '', '12020616', 'BUREAU OF COOPERATIVE DEV. AND FOOD SUFFICIENCY', 'Sales of Unservicable Items', 'State Agency', '2563', '2023-01-18 07:41:29'),
(88, '011121000100', '12020441', 'BUREAU OF TECHNICAL MATTERS', 'Laboratoy Fees', 'State Agency', '4345', '2023-01-18 07:41:29'),
(89, '011121000100', '12020452', 'DEPARTMENT OF ESTABLISHMENT', 'Tuition Fees (CSTC)', 'Individual', '2443', '2023-01-18 07:41:29'),
(90, '', '12020456', 'DEPARTMENT OF ESTABLISHMENT', 'Registration Fees (CSTC)', 'Individual', '6832', '2023-01-18 07:41:29'),
(91, '', '12020452', 'DEPARTMENT OF ESTABLISHMENT', 'Fees for Compulsory Exams for Executive Cadre', 'Corporate', '3368', '2023-01-18 07:41:29'),
(92, '', '12020452', 'DEPARTMENT OF ESTABLISHMENT', 'Fees for Compulsory Exams for Administrative/Professional Officer', 'Corporate', '2592', '2023-01-18 07:41:29'),
(93, '', '12020452', 'DEPARTMENT OF ESTABLISHMENT', 'Fees for Confirmation/Promotion Exams for Clerical and Allied Staff', 'Corporate', '2389', '2023-01-18 07:41:29'),
(94, '', '12020508', 'DEPARTMENT OF ESTABLISHMENT', 'Late Collection of Statement of resulT certificate', 'Individual', '4826', '2023-01-18 07:41:29'),
(95, '', '12020506', 'DEPARTMENT OF ESTABLISHMENT', 'Fines of Lost of Establisshmeni Record', 'State Agency', '3894', '2023-01-18 07:41:29'),
(96, '', '12020455', 'DEPARTMENT OF ESTABLISHMENT', 'Fees for Collection of Certificate executive Class', 'Individual', '2848', '2023-01-18 07:41:29'),
(97, '', '12020455', 'DEPARTMENT OF ESTABLISHMENT', 'Fees for Collection of Certificate special Class', 'Individual', '3984', '2023-01-18 07:41:29'),
(98, '', '12020455', 'DEPARTMENT OF ESTABLISHMENT', 'Change of Name/Next of Kin', 'Individual', '9583', '2023-01-18 07:41:29'),
(99, '01119000100', '12020705', 'GENERAL SERVICE OFFICE', 'Hiring of Multi -Purpose Hall', 'Individual', '3589', '2023-01-18 07:41:29'),
(100, '', '12020460', 'GENERAL SERVICE OFFICE', 'Certficate of Origin - Public Service office', 'Individual', '8473', '2023-01-18 07:41:29'),
(101, '', '12020459', 'GENERAL SERVICE OFFICE', 'Clinic Fees from Staff Clinic. Wellington Bassey Way', 'Individual', '2748', '2023-01-18 07:41:29'),
(102, '', '12020801', 'GENERAL SERVICE OFFICE', 'Rent from Senior Staff Quaters', 'Corporate', '5732', '2023-01-18 07:41:29'),
(103, '', '12020806', 'GENERAL SERVICE OFFICE', 'Rent on Government Shops', 'State Agency', '6453', '2023-01-18 07:41:29'),
(104, '', '12020616', 'GENERAL SERVICE OFFICE', 'Sales of unserviceable item', 'Individual', '2847', '2023-01-18 07:41:29'),
(105, '', '', '', 'Earnings from Govt. Guest house', 'State Agency', '3757', '2023-01-18 07:41:29'),
(106, '', '', '', 'GSO', 'State Agency', '9849', '2023-01-18 07:41:29'),
(107, '03180110010', '12020510', 'JUDIClAL SERVICE COMMISSION', 'Tenders Fees coIlected from Contractors', 'State Agency', '3748', '2023-01-18 07:41:29'),
(108, '', '12020616', 'JUDIClAL SERVICE COMMISSION', 'Sales of Unservicable Item', 'Individual', '5736', '2023-01-18 07:41:29'),
(109, '', '12020651', 'JUDIClAL SERVICE COMMISSION', 'Sales of Customary Court Forms', 'Corporate', '8463', '2023-01-18 07:41:29'),
(110, '02600030010', '12020453', 'LAND USE ALLOCATION COMMITTEE', 'Application Fees for Government Plot (Residential)', 'Individual', '7352', '2023-01-18 07:41:29'),
(111, '', '12020453', 'LAND USE ALLOCATION COMMITTEE', 'Application Fees for Government Plot (Industrial)', 'Corporate', '2747', '2023-01-18 07:41:29'),
(112, '', '12020447', 'LAND USE ALLOCATION COMMITTEE', 'Site Inspection Fees', 'Corporate', '1283', '2023-01-18 07:41:29'),
(113, '', '12020453', 'LAND USE ALLOCATION COMMITTEE', 'Application Fees for Letter of Consent', 'Individual', '1234', '2023-01-18 07:41:29'),
(114, '', '12020460', 'LAND USE ALLOCATION COMMITTEE', 'Non-Refundable Application Fees for Certificate of Occupancy', 'State Agency', '3729', '2023-01-18 07:41:29'),
(115, '', '12020453', 'LAND USE ALLOCATION COMMITTEE', 'Renewal of Lettet of Consent Fees', 'Individual', '2947', '2023-01-18 07:41:29'),
(116, '', '12020447', 'LAND USE ALLOCATION COMMITTEE', 'Change of Data Fees', 'Individual', '8374', '2023-01-18 07:41:29'),
(117, '', '12020445', 'LAND USE ALLOCATION COMMITTEE', 'Change of Purpose Fees', 'Individual', '2849', '2023-01-18 07:41:29'),
(118, '', '12020616', 'LAND USE ALLOCATION COMMITTEE', 'Sales of Unserviceable Vehicles', 'Individual', '2749', '2023-01-18 07:41:29'),
(119, '', '', 'LAND USE ALLOCATION COMMITTEE', 'Land Use Dev. Clearance Certificate', 'Individual', '2344', '2023-01-18 07:41:29'),
(120, '032600200100', '12020601', 'LAW REFORM COMMISSION', 'Sales of AKS Laws ( Customary Law Mannual)', 'State Agency', '3874', '2023-01-18 07:41:29'),
(121, '', '12020601', 'LAW REFORM COMMISSION', 'Sales of Law Reform Commission Annual Report', 'State Agency', '2848', '2023-01-18 07:41:29'),
(122, '05510040010', '12020705', 'LOCAL GOVT. SERVICE COMMISSION', 'Hiring of Commission Hall', 'Individual', '9293', '2023-01-18 07:41:29'),
(123, '', '', 'LOCAL GOVT. SERVICE COMMISSION', 'Withholding Tax (State)', 'State Agency', '2343', '2023-01-18 07:41:29'),
(124, '', '', 'LOCAL GOVT. SERVICE COMMISSION', 'PAYE', 'State Agency', '2384', '2023-01-18 07:41:29'),
(125, '055100400100', '11010401', 'OFFICE OF THE A/C GENERAL', 'Derivation Revenue', 'Federal Agency', '2747', '2023-01-18 07:41:29'),
(126, '', '11010104', 'OFFICE OF THE A/C GENERAL', 'Budget support', 'Federal Agency', '2094', '2023-01-18 07:41:29'),
(127, '', '11010201', 'OFFICE OF THE A/C GENERAL', 'Federal Govt Share of VAT', 'Federal Agency', '1536', '2023-01-18 07:41:29'),
(128, '', '11010300', 'OFFICE OF THE A/C GENERAL', 'Federal Govt Faac', 'Federal Agency', '3876', '2023-01-18 07:41:29'),
(129, '', '12020731', 'OFFICE OF THE A/C GENERAL', 'Interest on Motor Vehicles loan', 'Federal Agency', '3362', '2023-01-18 07:41:29'),
(130, '', '12020732', 'OFFICE OF THE A/C GENERAL', 'Interest on Fixed Deposit', 'Federal Agency', '3672', '2023-01-18 07:41:29'),
(131, '', '12020455', 'OFFICE OF THE A/C GENERAL', 'Replacement of lost pension I.D card', 'Individual', '7264', '2023-01-18 07:41:29'),
(132, '', '12020601', 'OFFICE OF THE A/C GENERAL', 'Sale of Revised Edition ol Finance Reg.', 'State Agency', '2743', '2023-01-18 07:41:29'),
(133, '', '12020616', 'OFFICE OF THE A/C GENERAL', 'Sale of unserviceable', 'Individual', '2874', '2023-01-18 07:41:29'),
(134, '', '12020733', 'OFFICE OF THE A/C GENERAL', 'Hiring of ICT Centre', 'Individual', '2747', '2023-01-18 07:41:29'),
(135, '', '12010104', 'OFFICE OF THE A/C GENERAL', 'Withholding Tax (State)', 'State Agency', '2839', '2023-01-18 07:41:29'),
(136, '021500100100', '12020400', 'MINISTRY OF AGRICULTURE', 'Registration of Fishing Boats', 'Individual', '2839', '2023-01-18 07:41:29'),
(137, '', '12020456', 'MINISTRY OF AGRICULTURE', 'Registration ol Farmers-Rubber', 'Individual', '8747', '2023-01-18 07:41:29'),
(138, '', '12020456', 'MINISTRY OF AGRICULTURE', 'Registration of Farmers — Cocoa', 'Individual', '2847', '2023-01-18 07:41:29'),
(139, '', '12020456', 'MINISTRY OF AGRICULTURE', 'Registration of Rice Farmers', 'Individual', '8293', '2023-01-18 07:41:29'),
(140, '', '12020456', 'MINISTRY OF AGRICULTURE', 'Registration of Fishermen/Fish Farmers', 'Individual', '8284', '2023-01-18 07:41:29'),
(141, '', '12020446', 'MINISTRY OF AGRICULTURE', 'Veterinay Clinic Treatment Fees', 'Individual', '9284', '2023-01-18 07:41:29'),
(142, '', '12020446', 'MINISTRY OF AGRICULTURE', 'Vaccination and Consultancy Fees', 'Individual', '8273', '2023-01-18 07:41:29'),
(143, '', '12020456', 'MINISTRY OF AGRICULTURE', 'Registration of Farmers — Oil Palm', 'Individual', '2533', '2023-01-18 07:41:29'),
(144, '', '12020446', 'MINISTRY OF AGRICULTURE', 'Processing of Rice', 'State Agency', '1247', '2023-01-18 07:41:29'),
(145, '', '12020446', 'MINISTRY OF AGRICULTURE', 'Tractor Hiring Service', 'Individual', '2632', '2023-01-18 07:41:29'),
(146, '', '12010114', 'MINISTRY OF AGRICULTURE', 'Livestock Sales Tax', 'Individual', '7237', '2023-01-18 07:41:29'),
(147, '', '12020905', 'MINISTRY OF AGRICULTURE', 'Lease of Swamp Land to Rice Farmers/Lease of Upland to Rice Farmers', 'State Agency', '6000', '2023-01-18 07:41:29'),
(148, '', '12020609', 'MINISTRY OF AGRICULTURE', 'Sales of Agricultural Product', 'Corporate', '5600', '2023-01-18 07:41:29'),
(149, '', '12020609', 'MINISTRY OF AGRICULTURE', 'Sales of Banana, Plantain, Pineapple, suckers citrus seedling etc.', 'Individual', '8765', '2023-01-18 07:41:29'),
(150, '', '12020617', 'MINISTRY OF AGRICULTURE', 'Sales of Eggs, BroiTers and Spent Birds', 'Individual', '7432', '2023-01-18 07:41:29'),
(151, '', '12020617', 'MINISTRY OF AGRICULTURE', 'Sales of Day Old Chicks', 'Individual', '8754', '2023-01-18 07:41:29'),
(152, '', '12020618', 'MINISTRY OF AGRICULTURE', 'Sales of Fish/Fingerlings', 'Individual', '7543', '2023-01-18 07:41:29'),
(153, '', '12020618', 'MINISTRY OF AGRICULTURE', 'Sales of Fishing Inputs', 'Individual', '1267', '2023-01-18 07:41:29'),
(154, '', '12020641', 'MINISTRY OF AGRICULTURE', 'Sales of Ice/Rental of Smoking Klins', 'Individual', '2432', '2023-01-18 07:41:29'),
(155, '', '12020643', 'MINISTRY OF AGRICULTURE', 'Sales of Rice Seeds and farmers', 'Individual', '4243', '2023-01-18 07:41:29'),
(156, '', '12020645', 'MINISTRY OF AGRICULTURE', 'Sales of Small Ruminants (Sheep and Goat)', 'Individual', '1237', '2023-01-18 07:41:29'),
(157, '', '12020649', 'MINISTRY OF AGRICULTURE', 'Surplus from Sales of Meat and Bleeding Stock (Piggery)', 'Individual', '4624', '2023-01-18 07:41:29'),
(158, '', '12020121', 'MINISTRY OF AGRICULTURE', 'Veterinary Permits', 'State Agency', '2028', '2023-01-18 07:41:29'),
(159, '023600100100', '12020709', 'MINISTRY OF CULTURE AND TOURISM', 'E - Tourism', 'State Agency', '9263', '2023-01-18 07:41:29'),
(160, '', '12020717', 'MINISTRY OF CULTURE AND TOURISM', 'Hiring of Ibom Plaza', 'State Agency', '6368', '2023-01-18 07:41:29'),
(161, '', '12020719', 'MINISTRY OF CULTURE AND TOURISM', 'Ibom Kitchen', 'State Agency', '6369', '2023-01-18 07:41:29'),
(162, '', '12020417', 'MINISTRY OF CULTURE AND TOURISM', 'Registration of Tourism Promoters', 'State Agency', '6370', '2023-01-18 07:41:29'),
(163, '', '12020456', 'MINISTRY OF CULTURE AND TOURISM', 'Registration Arts & Cultural Performance Fees', 'State Agency', '6371', '2023-01-18 07:41:29'),
(164, '', '12020465', 'MINISTRY OF CULTURE AND TOURISM', 'Endorsement Fees for Arts and Culture Festival', 'State Agency', '6372', '2023-01-18 07:41:29'),
(165, '', '12020465', 'MINISTRY OF CULTURE AND TOURISM', 'Renewal of Art & Culture Festival', 'State Agency', '6373', '2023-01-18 07:41:29'),
(166, '', '12021111', 'MINISTRY OF CULTURE AND TOURISM', 'Interest on Investment on Le Meridian Ibom Golf Course and Hotels', 'State Agency', '6374', '2023-01-18 07:41:29'),
(167, '', '12020616', 'MINISTRY OF CULTURE AND TOURISM', 'Sales of unserviceable items', 'Individual', '6375', '2023-01-18 07:41:29'),
(168, '', '12020647', 'MINISTRY OF CULTURE AND TOURISM', 'Sales og Works of Arts', 'Individual', '6376', '2023-01-18 07:41:29'),
(169, '', '12020803', 'MINISTRY OF CULTURE AND TOURISM', 'Rent on Ibibio Museum Parks', 'State Agency', '6377', '2023-01-18 07:41:29'),
(170, '051700100100', '12020705', 'MINISTRY OF EDUCATION', 'Hiring of Libraiy Hall (AKS LB)', 'Corporate', '1120', '2023-01-18 07:41:29'),
(171, '', '', '', 'ENDL Application Fees', 'Corporate', '1121', '2023-01-18 07:41:29'),
(172, '', '12020705', 'MINISTRY OF EDUCATION', 'Hiring e-Library Hall', 'Corporate', '1146', '2023-01-18 07:41:29'),
(173, '', '12020705', 'MINISTRY OF EDUCATION', 'Hiring of other Library Halls', 'Corporate', '2348', '2023-01-18 07:41:29'),
(174, '', '12020705', 'MINISTRY OF EDUCATION', 'Hiring of Library Hall (AKS LB)', 'Corporate', '3216', '2023-01-18 07:41:29'),
(175, '', '12020705', 'MINISTRY OF EDUCATION', 'Hiring e-Library Hall', 'Corporate', '2358', '2023-01-18 07:41:29'),
(176, '', '12020455', 'MINISTRY OF EDUCATION', 'Search Fees For Lost Certificates/Statement of Results', 'Individual', '3456', '2023-01-18 07:41:29'),
(177, '', '12020457', 'MINISTRY OF EDUCATION', 'Registration of Private Educational Institutions', 'Individual', '1439', '2023-01-18 07:41:29'),
(178, '', '12020457', 'MINISTRY OF EDUCATION', 'Fees for Public Education Facilities', 'State Agency', '6083', '2023-01-18 07:41:29'),
(179, '', '12020457', 'MINISTRY OF EDUCATION', 'French Tutorial Class to Public', 'Individual', '1300', '2023-01-18 07:41:29'),
(180, '', '12020457', 'MINISTRY OF EDUCATION', 'Renewal of Private Educational Institutions', 'Individual', '4009', '2023-01-18 07:41:29'),
(181, '', '12020505', 'MINISTRY OF EDUCATION', 'Fines for Overdue Books (Library Department)', 'Individual', '5432', '2023-01-18 07:41:29'),
(182, '', '12020507', 'MINISTRY OF EDUCATION', 'Fines on Operation of Illegal Schools', 'Individual', '6743', '2023-01-18 07:41:29'),
(183, '', '12020604', 'MINISTRY OF EDUCATION', 'Sales of Condemned Stores', 'Individual', '5439', '2023-01-18 07:41:29'),
(184, '', '12020715', 'MINISTRY OF EDUCATION', 'Hiring of Chairs (Library Department)', 'Individual', '6570', '2023-01-18 07:41:29'),
(185, '', '12020467', 'MINISTRY OF EDUCATION', 'Registration/Renewals of Library Membership', 'Individual', '7042', '2023-01-18 07:41:29'),
(186, '', '12020604', 'MINISTRY OF EDUCATION', 'Exam Reg Fee for Private School', 'Individual', '3212', '2023-01-18 07:41:29'),
(187, '', '', '', 'Dev fee for Adult trainning centre', 'Individual', '3000', '2023-01-18 07:41:29'),
(188, '', '', '', 'Sale of form for cont.Edu', 'Individual', '3200', '2023-01-18 07:41:29'),
(189, '', '12020637', 'MINISTRY OF EDUCATION', 'Sales of Form for Private Edu. Inst.', 'Individual', '2890', '2023-01-18 07:41:29'),
(190, '', '12020644', 'MINISTRY OF EDUCATION', 'Sales of Science Equipment', 'Individual', '1270', '2023-01-18 07:41:29'),
(191, '053500100100', '12020417', 'MINISTRY OF ENVIRONMENT', 'Renewal of Environmental Contractors/Consultants', 'State Agency', '3752', '2023-01-18 07:41:29'),
(192, '', '12020417', 'MINISTRY OF ENVIRONMENT', 'Registration of Environmental Contractors/Consultants', 'State Agency', '2647', '2023-01-18 07:41:29'),
(193, '', '12020448', 'MINISTRY OF ENVIRONMENT', 'Refuse and Tariff Fee', 'State Agency', '1283', '2023-01-18 07:41:29'),
(194, '', '12020438', 'MINISTRY OF ENVIRONMENT', 'Mining Fees', 'State Agency', '7126', '2023-01-18 07:41:29'),
(195, '', '12020451', 'MINISTRY OF ENVIRONMENT', 'Forests Fees', 'State Agency', '2642', '2023-01-18 07:41:29'),
(196, '', '12020431', 'MINISTRY OF ENVIRONMENT', 'Pollution Mgt and Efflucnce discharge Fee', 'State Agency', '7372', '2023-01-18 07:41:29'),
(197, '', '12020447', 'MINISTRY OF ENVIRONMENT', 'Environmental Fees', 'State Agency', '6463', '2023-01-18 07:41:29'),
(198, '', '12020503', 'MINISTRY OF ENVIRONMENT', 'EnvironmentaI Defaulters (Fines)', 'Individual', '3647', '2023-01-18 07:41:29'),
(199, '', '', 'MINISTRY OF ENVIRONMENT', 'Waste Management Fees', 'State Agency', '8273', '2023-01-18 07:41:29'),
(200, '', '', 'MINISTRY OF ENVIRONMENT', 'Roof Rack Permit', 'Individual', '2617', '2023-01-18 07:41:29'),
(201, '', '12020504', 'MINISTRY OF ENVIRONMENT', 'Forestry Fine', 'Individual', '1263', '2023-01-18 07:41:29'),
(202, '', '12020134', 'MINISTRY OF ENVIRONMENT', 'Forestry General License', 'State Agency', '3278', '2023-01-18 07:41:29'),
(203, '', '12020604', 'MINISTRY OF ENVIRONMENT', 'Sales of Condenmed Stores', 'State Agency', '2648', '2023-01-18 07:41:29'),
(204, '', '12020619', 'MINISTRY OF ENVIRONMENT', 'Sales of Forestry Product - Timber', 'Individual', '1273', '2023-01-18 07:41:29'),
(205, '', '12020619', 'MINISTRY OF ENVIRONMENT', 'Sales of Forestry Product - Ornamental', 'Individual', '8463', '2023-01-18 07:41:29'),
(206, '02200010010', '12020809', 'MINISTRY OF FINANCE HQ', 'Exceptional/Extra-ordinary Income', 'State Agency', '7234', '2023-01-18 07:41:29'),
(207, '', '12021103', 'MINISTRY OF FINANCE HQ', 'Investment Income', 'State Agency', '2347', '2023-01-18 07:41:29'),
(208, '', '14030100', 'MINISTRY OF FINANCE HQ', 'Domestic Loans/Borrowing Receipts', 'State Agency', '3648', '2023-01-18 07:41:29'),
(209, '', '14030100', 'MINISTRY OF FINANCE HQ', 'Internal loans', 'State Agency', '8374', '2023-01-18 07:41:29'),
(210, '', '14020103', 'MINISTRY OF FINANCE HQ', 'Privatization of State own Enterprise/Investment Income', 'State Agency', '2638', '2023-01-18 07:41:29'),
(211, '', '12021205', 'MINISTRY OF FINANCE HQ', 'Interest on car loans', 'Individual', '2732', '2023-01-18 07:41:29'),
(212, '052100100100', '12020441', 'MINISTRY OF HEALTH HQ', 'Laboratory Fees for Public Health', 'State Agency', '2543', '2023-01-18 07:41:29'),
(213, '', '12020452', 'MINISTRY OF HEALTH HQ', 'Tuition Fees for Student Nurses/Midwiyes', 'Individual', '4567', '2023-01-18 07:41:29'),
(214, '', '12020447', 'MINISTRY OF HEALTH HQ', 'Minor Surgical Intervention', 'Individual', '2747', '2023-01-18 07:41:29'),
(215, '', '12020475', 'MINISTRY OF HEALTH HQ', 'Medical Certificate for Fitness', 'Individual', '6452', '2023-01-18 07:41:29'),
(216, '', '12020447', 'MINISTRY OF HEALTH HQ', 'Wound Dressing and /Minor Suturing', 'Individual', '9182', '2023-01-18 07:41:29'),
(217, '', '12020452', 'MINISTRY OF HEALTH HQ', 'Entrance Examination Fees for Training Nurses and Paramedical Staff', 'Individual', '1638', '2023-01-18 07:41:29'),
(218, '', '12020458', 'MINISTRY OF HEALTH HQ', 'Registration Fees Ambulances', 'Individual', '3721', '2023-01-18 07:41:29'),
(219, '', '12020465', 'MINISTRY OF HEALTH HQ', 'Revenue for Govt Hospital', 'State Agency', '5273', '2023-01-18 07:41:29'),
(220, '', '12020459', 'MINISTRY OF HEALTH HQ', 'Registration Fees for Mortuary Clinic', 'Individual', '2537', '2023-01-18 07:41:29'),
(221, '', '12020459', 'MINISTRY OF HEALTH HQ', 'Registration /RenewaI Fees for Private Medical Clinic', 'Individual', '8365', '2023-01-18 07:41:29'),
(222, '', '12020472', 'MINISTRY OF HEALTH HQ', 'Hostel Fees For Student Nurses/Midwives', 'Individual', '1732', '2023-01-18 07:41:29'),
(223, '', '12020458', 'MINISTRY OF HEALTH HQ', 'Renewal Fees Ambulances', 'Individual', '6367', '2023-01-18 07:41:29'),
(224, '', '12020459', 'MINISTRY OF HEALTH HQ', 'Renewal fees for Mortuary Clinic', 'Individual', '6128', '2023-01-18 07:41:29'),
(225, '', '12020603', 'MINISTRY OF HEALTH HQ', 'Sales of Cards (2 Staff Clinics & Eye Clinic)', 'Individual', '1273', '2023-01-18 07:41:29'),
(226, '', '12020133', 'MINISTRY OF HEALTH HQ', 'Patent Medicine Proprietary Vendors Licenses', 'Corporate', '2732', '2023-01-18 07:41:29'),
(227, '', '12020604', 'MINISTRY OF HEALTH HQ', 'Sales of Condemned Stores', 'Individual', '1832', '2023-01-18 07:41:29'),
(228, '', '12020447', 'MINISTRY OF HEALTH HQ', 'Other Medical Charges/On Duty Card', 'Individual', '2874', '2023-01-18 07:41:29'),
(229, '025300100100', '12020438', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Building Plans Vetting Fees', 'State Agency', '3764', '2023-01-18 07:41:29'),
(230, '', '12020438', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Preparation of Bill of Quantities Fees', 'State Agency', '2833', '2023-01-18 07:41:29'),
(231, '', '12020480', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Vetting of Mechanical & Engineering (M&E)Drawing', 'State Agency', '3882', '2023-01-18 07:41:29'),
(232, '', '12020431', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Preparation of Working Drawing Fees', 'State Agency', '8366', '2023-01-18 07:41:29'),
(233, '', '12020116', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Property Tax', 'State Agency', '2742', '2023-01-18 07:41:29'),
(234, '', '12020906', 'MINISTRY OF HOUSING AND SPECIAL DUTIES', 'Rent on Govt. Building/Quavers', 'State Agency', '7376', '2023-01-18 07:41:29'),
(235, '012300100100', '12020715', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Hiring of PubIic Address System', 'Individual', '7362', '2023-01-18 07:41:29'),
(236, '', '12020449', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Renewal of Newspapers and Magazines', 'Individual', '8377', '2023-01-18 07:41:29'),
(237, '', '12020449', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Registration of Newspapers and Magazines', 'Individual', '2972', '2023-01-18 07:41:29'),
(238, '', '12020468', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Media Centre Fees', 'Individual', '7365', '2023-01-18 07:41:29'),
(239, '', '12020616', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Sales of Unserviceable Vehicles', 'Individual', '2765', '2023-01-18 07:41:29'),
(240, '', '12020721', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Printing on Payment', 'Individual', '2736', '2023-01-18 07:41:29'),
(241, '', '12020604', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Sales of Condemned Stores', 'Individual', '2874', '2023-01-18 07:41:29'),
(242, '', '12020616', 'MINISTRY OF INFORMATION AND COMMUNICATIONS', 'Sales of Unserviceable Vehicles', 'Individual', '8263', '2023-01-18 07:41:29'),
(243, '032600100100', '12020465', 'MINISTRY OF JUSTICE', 'Public Trustee and Administration', 'Federal Agency', '2364', '2023-01-18 07:41:29'),
(244, '', '12020440', 'MINISTRY OF JUSTICE', 'Agreement Fee/Consultancy Services', 'Federal Agency', '2874', '2023-01-18 07:41:29'),
(245, '', '12020601', 'MINISTRY OF JUSTICE', 'Sales of Unserviceable Items', 'Individual', '9482', '2023-01-18 07:41:29'),
(246, '', '12020601', 'MINISTRY OF JUSTICE', 'Sales of Revised Edition Law', 'State Agency', '8762', '2023-01-18 07:41:29'),
(247, '', '12020640', 'MINISTRY OF JUSTICE', 'Sales of High Court Civil Procedure', 'Federal Agency', '2742', '2023-01-18 07:41:29'),
(248, '026000100100', '12020904', 'MIN. OF LANDS AND TOWN PLANNING', 'Ground Rent', 'Individual', '9483', '2023-01-18 07:41:29'),
(249, '', '12020486', 'MIN. OF LANDS AND TOWN PLANNING', 'Registration fee for Ad-on-LDP-Station', 'Individual', '2768', '2023-01-18 07:41:29'),
(250, '', '12020437', 'MIN. OF LANDS AND TOWN PLANNING', 'Deeds Preparation Approval, Execution and Registration Fees', 'State Agency', '3687', '2023-01-18 07:41:29'),
(251, '', '12020438', 'MIN. OF LANDS AND TOWN PLANNING', 'Building Plans and Inspection Fees', 'Individual', '8746', '2023-01-18 07:41:29'),
(252, '', '12020455', 'MIN. OF LANDS AND TOWN PLANNING', 'Search Fee', 'Individual', '7482', '2023-01-18 07:41:29'),
(253, '', '12020440', 'MIN. OF LANDS AND TOWN PLANNING', 'Annual Pratice fee for Consultant Town Planning', 'Individual', '8467', '2023-01-18 07:41:29'),
(254, '', '12020807', 'MIN. OF LANDS AND TOWN PLANNING', 'Rent on Industrial Estate', 'Individual', '8847', '2023-01-18 07:41:29'),
(255, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Site Analysis Report Fees', 'Individual', '9734', '2023-01-18 07:41:29'),
(256, '', '12020453', 'MIN. OF LANDS AND TOWN PLANNING', 'Non-Refundable Application Fees for Letters of Consent', 'Individual', '7262', '2023-01-18 07:41:29'),
(257, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Plot Identification Fees', 'Individual', '2764', '2023-01-18 07:41:29'),
(258, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Land Use Development Clearance Certificate', 'Individual', '2738', '2023-01-18 07:41:29'),
(259, '', '12020438', 'MIN. OF LANDS AND TOWN PLANNING', 'Approval Fees for Private Layout Plans', 'Individual', '8276', '2023-01-18 07:41:29'),
(260, '', '12020431', 'MIN. OF LANDS AND TOWN PLANNING', 'Environmental Impact Analysis Report Fees                   *', 'Individual', '4253', '2023-01-18 07:41:29'),
(261, '', '12020465', 'MIN. OF LANDS AND TOWN PLANNING', 'Oil/Gas Fees', 'Individual', '7251', '2023-01-18 07:41:29'),
(262, '', '12020448', 'MIN. OF LANDS AND TOWN PLANNING', 'Revenue from Communication Masks', 'State Agency', '2472', '2023-01-18 07:41:29'),
(263, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Sitting /ApprovaI of GSM Renewal Charges', 'State Agency', '3622', '2023-01-18 07:41:29'),
(264, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Siting / Approval of GSM Masks', 'State Agency', '2743', '2023-01-18 07:41:29'),
(265, '', '12020447', 'MIN. OF LANDS AND TOWN PLANNING', 'Urban Development Fees', 'State Agency', '8466', '2023-01-18 07:41:29'),
(266, '', '12010112', 'MIN. OF LANDS AND TOWN PLANNING', 'Property Tax (Urban Devt Tax)', 'State Agency', '3264', '2023-01-18 07:41:29'),
(267, '', '12020901', 'MIN. OF LANDS AND TOWN PLANNING', 'Land Rent — Temporary right of Occupancy', 'State Agency', '3747', '2023-01-18 07:41:29'),
(268, '', '12020901', 'MIN. OF LANDS AND TOWN PLANNING', 'Premium on Lands', 'State Agency', '2743', '2023-01-18 07:41:29'),
(269, '', '12020132', 'MIN. OF LANDS AND TOWN PLANNING', 'Container Strcutures Permit', 'State Agency', '8346', '2023-01-18 07:41:29'),
(270, '', '12020901', 'MIN. OF LANDS AND TOWN PLANNING', 'Rent on State Lands (Residential)', 'State Agency', '8366', '2023-01-18 07:41:29'),
(271, '', '12020901', 'MIN. OF LANDS AND TOWN PLANNING', 'Land Use Rent (Privace C/O)', 'State Agency', '2373', '2023-01-18 07:41:29'),
(272, '', '12020616', 'MIN. OF LANDS AND TOWN PLANNING', 'Sales of unserviceabIe items', 'Individual', '2843', '2023-01-18 07:41:29'),
(273, '', '12020906', 'MIN. OF LANDS AND TOWN PLANNING', 'Rent on Govt Property withstate', 'Federal Agency', '2848', '2023-01-18 07:41:29'),
(274, '', '12020616', 'MIN. OF LANDS AND TOWN PLANNING', 'Sales of Unserviceable Motor Vehicles', 'Individual', '9483', '2023-01-18 07:41:29'),
(275, '', '', 'MIN. OF LANDS AND TOWN PLANNING', 'Consultation Fees', 'Individual', '8376', '2023-01-18 07:41:29'),
(276, '', '12020621', 'MIN. OF LANDS AND TOWN PLANNING', 'Sales of Master Plan', 'State Agency', '2748', '2023-01-18 07:41:29'),
(277, '045100200100', '12020465', 'MINISTRY OF LOCAL GOVERNMENT AND CHIEFTANCY AFFAIRS', 'Rating Valuation Fees', 'State Agency', '8397', '2023-01-18 07:41:29'),
(278, '', '12020135', 'MINISTRY OF LOCAL GOVERNMENT AND CHIEFTANCY AFFAIRS', 'Licencing of Place of Worship', 'State Agency', '2648', '2023-01-18 07:41:29'),
(279, '', '12020136', 'MINISTRY OF LOCAL GOVERNMENT AND CHIEFTANCY AFFAIRS', 'Renewal of licence of Registered Place of Worship', 'State Agency', '3843', '2023-01-18 07:41:29'),
(280, '0', '12020456', 'MINISTRY OF RURAL DEVELOPMENT', 'Registration of Projects', 'State Agency', '2847', '2023-01-18 07:41:29'),
(281, '', '12020448', 'MINISTRY OF RURAL DEVELOPMENT', 'Project Servicing fee', 'State Agency', '9487', '2023-01-18 07:41:29'),
(282, '', '12020456', 'MINISTRY OF RURAL DEVELOPMENT', 'Registration of Development Associations', 'State Agency', '9384', '2023-01-18 07:41:29'),
(283, '', '12020616', 'MINISTRY OF RURAL DEVELOPMENT', 'Sales of Unserviceable Items', 'Individual', '5987', '2023-01-18 07:41:29'),
(284, '022800100100', '12020441', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Laboratory Services Fees', 'Individual', '2874', '2023-01-18 07:41:29'),
(285, '', '12020449', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Fee for Cyber Café/Computer Operation', 'Individual', '2493', '2023-01-18 07:41:29'),
(286, '', '12020453', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'ICT Acedamy Fees', 'Individual', '4976', '2023-01-18 07:41:29'),
(287, '', '12020705', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Hiring e-Library Hall', 'Individual', '3957', '2023-01-18 07:41:29'),
(288, '', '12020705', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Revenue from e-library', 'State Agency', '3874', '2023-01-18 07:41:29'),
(289, '', '12020130', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Inspection and Licensing of Lab', 'State Agency', '2948', '2023-01-18 07:41:29'),
(290, '', '12020616', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Sales of Unserviceable Motor Vehicles/Items', 'Individual', '2747', '2023-01-18 07:41:29'),
(291, '', '12020465', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Internet Services', 'Individual', '2847', '2023-01-18 07:41:29'),
(292, '', '12020804', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Rent on Canteen/Conference Hall', 'Individual', '2846', '2023-01-18 07:41:29'),
(293, '', '12020608', 'MINISTRY OF SCIENCE AND TECHNOLOGY', 'Sales of Produced Chemicals', 'State Agency', '2374', '2023-01-18 07:41:29'),
(294, '0', '12020704', 'AKWA IBOM URBAN TAXI NETWORK LIMITED', 'Fares form Taxi', 'State Agency', '8384', '2023-01-18 07:41:29'),
(295, '', '12020704', 'AKWA IBOM URBAN TAXI NETWORK LIMITED', 'Fares form Marc BuseS', 'State Agency', '2943', '2023-01-18 07:41:29'),
(296, '', '12020704', 'AKWA IBOM URBAN TAXI NETWORK LIMITED', 'Fares from City Buses', 'State Agency', '4959', '2023-01-18 07:41:29'),
(297, '022900100100', '12020718', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Hiring of Towing of Trucks / Van', 'Individual', '9483', '2023-01-18 07:41:29'),
(298, '', '12020449', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Registration of Driving School', 'Individual', '3748', '2023-01-18 07:41:29'),
(299, '', '12020458', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Registration of Comm. Vehicle / TryCycles', 'Individual', '4858', '2023-01-18 07:41:29'),
(300, '', '12020462', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Landing and Take Off £ees', 'Individual', '3858', '2023-01-18 07:41:29'),
(301, '', '12020449', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Renewal of Driving School', 'Individual', '3848', '2023-01-18 07:41:29'),
(302, '', '12020458', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Renewal of Comm. Vehicle/Tricycles', 'Individual', '2938', '2023-01-18 07:41:29'),
(303, '', '12020465', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Motor Traffic Road Worthless Test', 'Individual', '3947', '2023-01-18 07:41:29'),
(304, '', '12020482', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Sea Worthiness Certification', 'Individual', '3854', '2023-01-18 07:41:29'),
(305, '', '12020465', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Motor Traffic Examination Fees', 'Individual', '5938', '2023-01-18 07:41:29'),
(306, '', '12020465', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Motor Traffic Driving Test', 'Individual', '2746', '2023-01-18 07:41:29'),
(307, '', '12020448', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Manifest', 'Individual', '3748', '2023-01-18 07:41:29'),
(308, '', '12020464', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Maritime Derivable Revenue', 'Individual', '3849', '2023-01-18 07:41:29'),
(309, '', '12020464', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Maritime Emblems Fees', 'Individual', '3988', '2023-01-18 07:41:29'),
(310, '', '12020483', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Whaf landing fee on Petroleun Product', 'Individual', '3842', '2023-01-18 07:41:29'),
(311, '', '12020458', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Boat Registration Fees', 'Individual', '3847', '2023-01-18 07:41:29'),
(312, '', '12020462', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Loading / Take OfT Fees', 'Individual', '3984', '2023-01-18 07:41:29'),
(313, '', '12020509', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Pounding of Illegal Parking', 'Individual', '4858', '2023-01-18 07:41:29'),
(314, '', '12010111', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Road Tsx', 'Individual', '3848', '2023-01-18 07:41:29'),
(315, '', '12020664', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Daily Ticketing on Tric cle,Taxis snd Bus', 'Individual', '3848', '2023-01-18 07:41:29'),
(316, '', '12020616', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Other Unspecified Revenue (Unservicable Items)', 'Individual', '5038', '2023-01-18 07:41:29'),
(317, '', '12020910', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Rent on Used of State Water Ways', 'Individual', '3894', '2023-01-18 07:41:29'),
(318, '', '12020625', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'SaIes of Highway Codes', 'Individual', '4856', '2023-01-18 07:41:29'),
(319, '', '12020646', 'MINISTRY OF TRANSPORT AND PETROLEUM RESOURCES', 'Sales of Vehicle Emblems', 'Individual', '3875', '2023-01-18 07:41:29'),
(320, '051400100100', '12020705', 'MINISTRY OF WOMEN AFFAIRS AND SOCIAL DEVELOPMENT', 'Hiring of Women Development Hall', 'Individual', '3498', '2023-01-18 07:41:29'),
(321, '', '12020456', 'MINISTRY OF WOMEN AFFAIRS AND SOCIAL DEVELOPMENT', 'Registrstion Fee of women NGO', 'Individual', '2876', '2023-01-18 07:41:29'),
(322, '', '12020456', 'MINISTRY OF WOMEN AFFAIRS AND SOCIAL DEVELOPMENT', 'Revalidation Fee of women NGO', 'Individual', '2384', '2023-01-18 07:41:29'),
(323, '053900100100', '12020410', 'MINISTRY OF WORKS', 'Weight and Measure of Tippers', 'Individual', '2948', '2023-01-18 07:41:29'),
(324, '', '12020428', 'MINISTRY OF WORKS', 'Caution fees', 'Individual', '3866', '2023-01-18 07:41:29'),
(325, '', '12020462', 'MINISTRY OF WORKS', 'State Haulage for all Manufacturing cop', 'State Agency', '3974', '2023-01-18 07:41:29'),
(326, '', '12020441', 'MINISTRY OF WORKS', 'Soil Material Laboratory', 'State Agency', '4863', '2023-01-18 07:41:29'),
(327, '', '12020454', 'MINISTRY OF WORKS', 'Delivery fee', 'Individual', '8455', '2023-01-18 07:41:29'),
(328, '', '12020436', 'MINISTRY OF WORKS', 'Hoisting of Banners', 'Individual', '2876', '2023-01-18 07:41:29'),
(329, '', '12020473', 'MINISTRY OF WORKS', 'Road Rehabilitation and city permit', 'State Agency', '1762', '2023-01-18 07:41:29'),
(330, '', '12020450', 'MINISTRY OF WORKS', 'Inspcction Fees (Peuol Station)', 'State Agency', '1972', '2023-01-18 07:41:29'),
(331, '', '12020448', 'MINISTRY OF WORKS', 'Right of Way', 'State Agency', '7369', '2023-01-18 07:41:29'),
(332, '', '12020908', 'MINISTRY OF WORKS', 'RenT of MOW Filling Stations', 'State Agency', '2874', '2023-01-18 07:41:29'),
(333, '', '12020909', 'MINISTRY OF WORKS', 'Rent of Overhead Tank', 'State Agency', '8792', '2023-01-18 07:41:29'),
(334, '', '12020616', 'MINISTRY OF WORKS', 'Sales of Unserviceable Vehicles, Plants and Equipment', 'Individual', '2948', '2023-01-18 07:41:29'),
(335, '053900100100', '12020714', 'MINISTRY OF YOUTH AND SPORTS', 'Gate Taking/Hiring of Stadium', 'Individual', '8778', '2023-01-18 07:41:29'),
(336, '', '12020456', 'MINISTRY OF YOUTH AND SPORTS', 'Registration of Youth Associations', 'State Agency', '2847', '2023-01-18 07:41:29'),
(337, '', '12020456', 'MINISTRY OF YOUTH AND SPORTS', 'Revalidation of Youth Associations', 'State Agency', '3846', '2023-01-18 07:41:29'),
(338, '014000100100', '12020417', 'OFFICE OF THE AUDITOR GENERAL(LOCAL GOVERNMENT)', 'Registration fee (Ext. Auditors)', 'State Agency', '9474', '2023-01-18 07:41:29'),
(339, '', '12020465', 'OFFICE OF THE AUDITOR GENERAL(LOCAL GOVERNMENT)', 'Audit Arrears', 'State Agency', '8366', '2023-01-18 07:41:29'),
(340, '', '12020465', 'OFFICE OF THE AUDITOR GENERAL(LOCAL GOVERNMENT)', 'Audit Fees', 'State Agency', '8476', '2023-01-18 07:41:29'),
(341, '', '12020440', 'OFFICE OF THE AUDITOR GENERAL(LOCAL GOVERNMENT)', 'Audit Consul fancy Fees', 'Individual', '3873', '2023-01-18 07:41:29'),
(342, '014000100100', '12020465', 'OFFICE OF THE AUDITOR GENERAL(STATE)', 'Audit fees', 'State Agency', '9847', '2023-01-18 07:41:29'),
(343, '', '12020440', 'OFFICE OF THE AUDITOR GENERAL(STATE)', 'Audit Consultancy fees', 'Individual', '9487', '2023-01-18 07:41:29'),
(344, '', '12020456', 'OFFICE OF THE AUDITOR GENERAL(STATE)', 'Registration of Audit Firms', 'State Agency', '2748', '2023-01-18 07:41:29'),
(345, '', '12020456', 'OFFICE OF THE AUDITOR GENERAL(STATE)', 'Renewal of Audit Firms', 'State Agency', '3848', '2023-01-18 07:41:29'),
(346, '', '12020616', 'OFFICE OF THE AUDITOR GENERAL(STATE)', 'Sales of Unserviceable Item', 'Individual', '9473', '2023-01-18 07:41:29'),
(347, '012500100100', '12020705', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Hiring of Secretarait Complex Auditorium', 'Federal Agency', '3779', '2023-01-18 07:41:29'),
(348, '', '12020449', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Reg/Rwal Fees for Training and Consultancy Services', 'Federal Agency', '3987', '2023-01-18 07:41:29'),
(349, '', '12020465', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Civil Service Rule Scheme', 'Federal Agency', '4987', '2023-01-18 07:41:29'),
(350, '', '12020601', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Sales of Civil Service Rule Booklets', 'Federal Agency', '4873', '2023-01-18 07:41:29'),
(351, '', '12020604', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Sales of Staff List', 'Federal Agency', '3854', '2023-01-18 07:41:29'),
(352, '', '12020616', 'OFFICE OF THE HEAD OF CIVIL SERVICE', 'Sales of Unserviceable Item', 'Individual', '3848', '2023-01-18 07:41:29'),
(353, '011101300100', '12020417', 'OFFICE OF THE SECRETARY TO THE STATE GOVERNMENT', 'Registration and Renewal of Contractor', 'State Agency', '3497', '2023-01-18 07:41:29'),
(354, '', '12020642', 'OFFICE OF THE SECRETARY TO THE STATE GOVERNMENT', 'Sales of Pilgrims Reg Forms', 'State Agency', '7363', '2023-01-18 07:41:29'),
(355, '023400200100', '', 'SURVEYOR GENERAL', 'OPL Exclusive Prospective License', 'Individual', '8466', '2023-01-18 07:41:29'),
(356, '', '12020438', 'SURVEYOR GENERAL', 'Survery Fees', 'Individual', '8376', '2023-01-18 07:41:29'),
(357, '', '12020460', 'SURVEYOR GENERAL', 'Certificate of Depost', 'Individual', '8576', '2023-01-18 07:41:29'),
(358, '', '12020447', 'SURVEYOR GENERAL', 'Site Inspection Fees', 'Individual', '8364', '2023-01-18 07:41:29'),
(359, '', '12020455', 'SURVEYOR GENERAL', 'Search Fees', 'Individual', '9847', '2023-01-18 07:41:29'),
(360, '', '12020621', 'SURVEYOR GENERAL', 'Sales of Map', 'State Agency', '9857', '2023-01-18 07:41:29'),
(361, '', '12020314', 'SURVEYOR GENERAL', 'Royalties on Plan and Map Films', 'State Agency', '8757', '2023-01-18 07:41:29'),
(362, '02340020010', '12020456', 'POLITICAL AND LEGISLATIVE AFFAIRS BUREAU', 'Registration of Political Association', 'State Agency', '6374', '2023-01-18 07:41:29'),
(363, '', '12020457', 'POLITICAL AND LEGISLATIVE AFFAIRS BUREAU', 'Renewal Fee for Political Association', 'State Agency', '2747', '2023-01-18 07:41:29'),
(364, '02340020010', '12020452', 'HOSPITAL MANAGEMENT BOARD', 'Medical Examination', 'Individual', '2474', '2023-01-18 07:41:29'),
(365, '', '12020441', 'HOSPITAL MANAGEMENT BOARD', 'Medical Laboratory Fees', 'Individual', '2974', '2023-01-18 07:41:29'),
(366, '', '12020459-a', 'HOSPITAL MANAGEMENT BOARD', 'HospitaI Fees', 'Individual', '8273', '2023-01-18 07:41:29'),
(367, '', '12020459-b', 'HOSPITAL MANAGEMENT BOARD', 'Mortuary fees', 'Individual', '2873', '2023-01-18 07:41:29'),
(368, '', '12020468-b', 'HOSPITAL MANAGEMENT BOARD', 'Fixed Fees', 'Individual', '8473', '2023-01-18 07:41:29'),
(369, '', '', 'HOSPITAL MANAGEMENT BOARD', 'X-Ray Fees', 'Individual', '8489', '2023-01-18 07:41:29'),
(370, '', '12020468-c', 'HOSPITAL MANAGEMENT BOARD', 'Operation', 'Individual', '2648', '2023-01-18 07:41:29'),
(371, '', '', 'HOSPITAL MANAGEMENT BOARD', 'Scan', 'Individual', '8243', '2023-01-18 07:41:29'),
(372, '022200100100', '12010110', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Produce Sales Tax', 'State Agency', '4726', '2023-01-18 07:41:29'),
(373, '', '12020448', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Produce Dev. Fund', 'State Agency', '3948', '2023-01-18 07:41:29'),
(374, '', '12020449-a', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Reg. of Business Premises', 'State Agency', '8363', '2023-01-18 07:41:29'),
(375, '', '12020449-b', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Reg. of Produce Stores', 'State Agency', '8483', '2023-01-18 07:41:29'),
(376, '', '12020449-c', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Listing & Reco Hotels Tourism Entterp. Fees', 'State Agency', '2739', '2023-01-18 07:41:29'),
(377, '', '12020449-d', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Renewal of produce scores', 'State Agency', '4934', '2023-01-18 07:41:29');
INSERT INTO `revenue_heads` (`id`, `COL_1`, `COL_2`, `COL_3`, `COL_4`, `COL_5`, `COL_6`, `time_in`) VALUES
(378, '', '1202449- e', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Renewal of Business Premises', 'State Agency', '8473', '2023-01-18 07:41:29'),
(379, '', '12020450', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Produce Inspection Fees', 'State Agency', '9473', '2023-01-18 07:41:29'),
(380, '', '12020455', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Replacement of Lost Cert. of Reg. Fees', 'Individual', '8473', '2023-01-18 07:41:29'),
(381, '', '12020456', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Produre Merchant Reg. Fees', 'Individual', '2848', '2023-01-18 07:41:29'),
(382, '', '12020514', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Fine for Non-Compliance with produce Law', 'State Agency', '3857', '2023-01-18 07:41:29'),
(383, '', '12020515', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Fine for using Platform other than Registered Place', 'State Agency', '9473', '2023-01-18 07:41:29'),
(384, '', '12020516', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Wrong Grading of Produce', 'State Agency', '8747', '2023-01-18 07:41:29'),
(385, '', '12020636', 'MINISTRY OF INVESTMENT, COMMERCE AND INDUSTRY', 'Sales of Desk Dairy', 'Individual', '2377', '2023-01-18 07:41:29'),
(386, '014700100100', '12020601', 'AKS CIVIL SERVICE COMMISSION', 'Sales of Annual Report', 'State Agency', '3747', '2023-01-18 07:41:29'),
(387, '', '12020455', 'AKS CIVIL SERVICE COMMISSION', 'Search Fees for the Lost of Service Doc.', 'State Agency', '4778', '2023-01-18 07:41:29'),
(388, '014700100100', '12020417', 'FINANCE AND GEN. PURPOSE COMMITTEE', 'Registration and Renewal of Contractor', 'State Agency', '7478', '2023-01-18 07:41:29'),
(389, '', '12020453', 'FINANCE AND GEN. PURPOSE COMMITTEE', 'Processing Fees', 'State Agency', '2634', '2023-01-18 07:41:29'),
(390, '', '12020427', 'FINANCE AND GEN. PURPOSE COMMITTEE', 'Fees tor Tenders Documents', 'State Agency', '2838', '2023-01-18 07:41:29'),
(391, '', '12020417', 'FINANCE AND GEN. PURPOSE COMMITTEE', 'Renewal of Contractors', 'State Agency', '1294', '2023-01-18 07:41:29'),
(392, '', '12020417', 'FINANCE AND GEN. PURPOSE COMMITTEE', 'Registration of Contractors', 'State Agency', '2894', '2023-01-18 07:41:29'),
(393, '023405600100', '12020428', 'AKWA IBOM STATE FIRE SERVICE', 'Fire Safety Certitlcate to Petrol Station', 'State Agency', '2484', '2023-01-18 07:41:29'),
(394, '', '12020436', 'AKWA IBOM STATE FIRE SERVICE', 'Hoisting of Banners', 'Individual', '1467', '2023-01-18 07:41:29'),
(395, '', '12020430', 'AKWA IBOM STATE FIRE SERVICE', 'Inspection Fees (Petrol Station)', 'Individual', '2812', '2023-01-18 07:41:29'),
(396, '0', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Fencing Fees', 'State Agency', '1000', '2023-01-18 07:41:29'),
(397, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Building Plan Fees', 'State Agency', '9383', '2023-01-18 07:41:29'),
(398, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Site Plan Analysis Report Fees', 'State Agency', '2848', '2023-01-18 07:41:29'),
(399, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Application For Letter of Consent', 'State Agency', '2848', '2023-01-18 07:41:29'),
(400, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Environment Impact Assessment Report', 'State Agency', '3847', '2023-01-18 07:41:29'),
(401, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Temporary Structure Fees', 'State Agency', '3848', '2023-01-18 07:41:29'),
(402, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Pegging Fees', 'State Agency', '4857', '2023-01-18 07:41:29'),
(403, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Petition Fees', 'State Agency', '8547', '2023-01-18 07:41:29'),
(404, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Opening of Roads', 'State Agency', '5483', '2023-01-18 07:41:29'),
(405, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Allocation of Plot Fees', 'State Agency', '4873', '2023-01-18 07:41:29'),
(406, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Borehole Development Fees', 'State Agency', '3948', '2023-01-18 07:41:29'),
(407, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Burial Fees', 'State Agency', '3839', '2023-01-18 07:41:29'),
(408, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Site Clearance', 'State Agency', '3390', '2023-01-18 07:41:29'),
(409, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Mast Antenna', 'State Agency', '3489', '2023-01-18 07:41:29'),
(410, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Re-Submission', 'State Agency', '3849', '2023-01-18 07:41:29'),
(411, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Charting Fees', 'State Agency', '3948', '2023-01-18 07:41:29'),
(412, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Building Regulation Fees', 'State Agency', '9484', '2023-01-18 07:41:29'),
(413, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Sales - General', 'State Agency', '9384', '2023-01-18 07:41:29'),
(414, '', '', 'UYO CAPITAL CITY DEVELOPMENT AUTHORITY', 'Building Application Form', 'State Agency', '9478', '2023-01-18 07:41:29'),
(415, '0', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Registration of Cultural Troupe', 'Individual', '4673', '2023-01-18 07:41:29'),
(416, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Cultural Performance', 'Individual', '7364', '2023-01-18 07:41:29'),
(417, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Production/Sales of Arts Work', 'Individual', '2473', '2023-01-18 07:41:29'),
(418, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Craft Shop', 'Individual', '3473', '2023-01-18 07:41:29'),
(419, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Renting of Councils Hall', 'Individual', '3743', '2023-01-18 07:41:29'),
(420, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Variety Show', 'Individual', '3747', '2023-01-18 07:41:29'),
(421, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Hiring of Costumes', 'Individual', '3848', '2023-01-18 07:41:29'),
(422, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Income from Millennium Band', 'Individual', '4857', '2023-01-18 07:41:29'),
(423, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Hiring of Council Band', 'Individual', '4748', '2023-01-18 07:41:29'),
(424, '', '', 'AKS COUNCIL FOR ARTS AND CULTURE', 'Sundry Revenue', 'Individual', '3747', '2023-01-18 07:41:29'),
(426, '22', '045RF', 'AGENCY FOR ADULT AND NON FORMAL EDUCATION', 'TESTING_2', 'Individual', '120', '2023-01-25 12:29:22'),
(427, '22', '045RF', 'tester', 'testerrev', 'Individual', '222', '2023-02-03 07:14:11'),
(428, '22', '045RF', 'tester', 'test444', 'Federal Agency', '123', '2023-02-03 07:15:05'),
(429, '22', '045RF', 'tester', 'tery', 'Federal Agency', '22', '2023-02-03 07:17:30'),
(431, '22', '045RF', '4', 'TestingNew', 'Individual', '1232', '2023-02-03 12:41:30'),
(432, '22', '045RF', '4', 'TestingNew4', 'Corporate', '43', '2023-02-03 12:42:24'),
(433, '22', '045RF', 'AKIRS', 'TestingNew46', 'Individual', '33', '2023-02-03 12:43:29'),
(434, '22', '045RF', 'AKIRS', 'test rev', 'State Agency', '200', '2023-02-22 14:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `revenue_heads1`
--

CREATE TABLE `revenue_heads1` (
  `id` int(11) NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `description` varchar(500) NOT NULL,
  `amount` double(10,2) NOT NULL,
  `mda_id` int(255) NOT NULL,
  `time_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `revenue_heads1`
--

INSERT INTO `revenue_heads1` (`id`, `fullname`, `description`, `amount`, `mda_id`, `time_in`) VALUES
(1, '2', 'lll', 2.50, 2, '2023-01-11 14:40:59'),
(2, '22', 'lll', 2.50, 2, '2023-01-11 14:41:08'),
(3, 'PAYE', 'tax to be paid as PAYE', 3232.00, 2, '2023-01-14 09:31:39'),
(4, '434', 'fsgd', 2232.00, 2, '2023-01-14 15:28:38');

-- --------------------------------------------------------

--
-- Table structure for table `secondary_tax_clearance_certificate`
--

CREATE TABLE `secondary_tax_clearance_certificate` (
  `id` int(11) NOT NULL,
  `primary_tax_clearance_certificate_id` bigint(20) NOT NULL,
  `emai_address` varchar(400) NOT NULL,
  `state_of_origin` varchar(400) NOT NULL,
  `company_name` varchar(300) NOT NULL,
  `company_branch` varchar(400) NOT NULL,
  `company_address` varchar(400) NOT NULL,
  `web_address` varchar(400) NOT NULL,
  `official_position` varchar(400) NOT NULL,
  `international_passport_no` varchar(400) NOT NULL,
  `alien_negistration_no` varchar(400) NOT NULL,
  `sponsor_name` varchar(400) DEFAULT NULL,
  `sponsor_occupation` varchar(400) DEFAULT NULL,
  `sponsor_business` varchar(400) DEFAULT NULL,
  `employment_from_1` varchar(400) DEFAULT NULL,
  `employment_to_1` varchar(400) DEFAULT NULL,
  `employment_from_2` varchar(400) DEFAULT NULL,
  `employment_to_2` varchar(400) DEFAULT NULL,
  `employment_from_3` varchar(400) DEFAULT NULL,
  `employment_to_3` varchar(400) DEFAULT NULL,
  `signature_1` varchar(400) DEFAULT NULL,
  `date_1` date DEFAULT NULL,
  `signature_2` varchar(400) DEFAULT NULL,
  `date_2` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `secondary_tax_clearance_certificate`
--

INSERT INTO `secondary_tax_clearance_certificate` (`id`, `primary_tax_clearance_certificate_id`, `emai_address`, `state_of_origin`, `company_name`, `company_branch`, `company_address`, `web_address`, `official_position`, `international_passport_no`, `alien_negistration_no`, `sponsor_name`, `sponsor_occupation`, `sponsor_business`, `employment_from_1`, `employment_to_1`, `employment_from_2`, `employment_to_2`, `employment_from_3`, `employment_to_3`, `signature_1`, `date_1`, `signature_2`, `date_2`) VALUES
(1, 1, 'www@gmail.com', 'niger', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '2002', '2008', '2008', '2010', '2010', '2018', 'string', '2023-03-01', 'string', '2023-03-01'),
(2, 2, 'fff@gmail.com', 'niger', 'string1', 'string1', 'string1', 'string1', 'string1', 'string1', 'string1', 'string1', 'string1', 'string1', '2002', '2008', '2008', '2010', '2010', '2018', 'string1', '2023-03-01', 'string1', '2023-03-01'),
(3, 3, 'www@gmail.com', 'niger', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '2002', '2008', '2008', '2010', '2010', '2018', 'string', '2023-03-01', 'string', '2023-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `secondary_TIN_request`
--

CREATE TABLE `secondary_TIN_request` (
  `id` int(11) NOT NULL,
  `primary_TIN_request_id` bigint(20) NOT NULL,
  `name` varchar(350) NOT NULL,
  `tin` varchar(400) NOT NULL,
  `retyp` varchar(400) NOT NULL,
  `reason` varchar(300) NOT NULL,
  `state` varchar(400) NOT NULL,
  `local_gvt` varchar(400) NOT NULL,
  `ward` varchar(400) NOT NULL,
  `city` varchar(400) NOT NULL,
  `street_name` varchar(400) NOT NULL,
  `house_no` varchar(400) NOT NULL,
  `phone_number_1` varchar(400) NOT NULL,
  `phone_number_2` varchar(400) NOT NULL,
  `email` varchar(400) NOT NULL,
  `source_of_income` varchar(400) NOT NULL,
  `employer_name` varchar(400) NOT NULL,
  `employer_tin` varchar(400) NOT NULL,
  `start_date_of_employment` date NOT NULL,
  `dep_child_first_name` varchar(400) NOT NULL,
  `dep_child_surname` varchar(400) NOT NULL,
  `dep_child_middle_name` varchar(400) NOT NULL,
  `dep_child_state` varchar(400) NOT NULL,
  `dep_child_birthday` date NOT NULL,
  `dep_child_tin` varchar(400) NOT NULL,
  `dep_child_relationship_type` varchar(400) NOT NULL,
  `sponser_first_name` varchar(400) DEFAULT NULL,
  `sponser_surname` varchar(400) DEFAULT NULL,
  `sponser_middle_name` varchar(400) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `sponser_tin` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `secondary_TIN_request`
--

INSERT INTO `secondary_TIN_request` (`id`, `primary_TIN_request_id`, `name`, `tin`, `retyp`, `reason`, `state`, `local_gvt`, `ward`, `city`, `street_name`, `house_no`, `phone_number_1`, `phone_number_2`, `email`, `source_of_income`, `employer_name`, `employer_tin`, `start_date_of_employment`, `dep_child_first_name`, `dep_child_surname`, `dep_child_middle_name`, `dep_child_state`, `dep_child_birthday`, `dep_child_tin`, `dep_child_relationship_type`, `sponser_first_name`, `sponser_surname`, `sponser_middle_name`, `start_date`, `sponser_tin`) VALUES
(1, 1, 'string', '1234', 'string', 'string', 'string', 'minna', 'wadata', 'minna', 'string', 'string', '09087878787', '09088787676', 'string@gmail.com', 'string', 'string', '23434', '2023-03-01', 'string', 'string', 'string', 'string', '2023-03-01', '34565654', 'string', 'string', 'string', 'string', '2023-03-08', 'string'),
(2, 2, 'string', '1234', 'string', 'string', 'string', 'minna', 'wadata', 'minna', 'string', 'string', '09087878787', '09088787676', 'string@gmail.com', 'string', 'string', '23434', '2023-03-01', 'string', 'string', 'string', 'string', '2023-03-01', '34565654', 'string', 'string', 'string', 'string', '2023-03-08', 'string'),
(3, 3, 'string', '1234', 'string', 'string', 'string', 'minna', 'wadata', 'minna', 'string', 'string', '09087878787', '09088787676', 'string@gmail.com', 'string', 'string', '23434', '2023-03-01', 'string', 'string', 'string', 'string', '2023-03-01', '34565654', 'string', 'string', 'string', 'string', '2023-03-08', 'string');

-- --------------------------------------------------------

--
-- Table structure for table `tax_filing`
--

CREATE TABLE `tax_filing` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `category` varchar(400) NOT NULL,
  `tax_to_file` varchar(400) NOT NULL,
  `first_name` varchar(400) NOT NULL,
  `surname` varchar(400) NOT NULL,
  `email` varchar(400) NOT NULL,
  `phone_number` varchar(400) NOT NULL,
  `form_assessment_upload` varchar(400) NOT NULL,
  `tax_income_upload` varchar(400) NOT NULL,
  `evidence_of_tax_payment` varchar(400) NOT NULL,
  `form_upload_4` varchar(200) DEFAULT NULL,
  `form_upload_5` varchar(200) DEFAULT NULL,
  `tax_filling_refrence` varchar(200) NOT NULL,
  `application_status` enum('approved','pending') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tax_filing`
--

INSERT INTO `tax_filing` (`id`, `user_id`, `category`, `tax_to_file`, `first_name`, `surname`, `email`, `phone_number`, `form_assessment_upload`, `tax_income_upload`, `evidence_of_tax_payment`, `form_upload_4`, `form_upload_5`, `tax_filling_refrence`, `application_status`, `created_at`) VALUES
(1, 2, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', NULL, NULL, '43554566', 'approved', '2023-03-13 16:23:13'),
(2, 1, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', NULL, NULL, '43554566', 'approved', '2023-03-13 16:38:17'),
(3, 1, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', NULL, NULL, '1678726880', 'approved', '2023-03-13 16:47:51'),
(4, 1, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', NULL, NULL, 'IBS|14032023|7324', 'pending', '2023-03-14 13:58:09'),
(5, 1, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', 'string', 'string', 'IBS|14032023|6350', 'pending', '2023-03-14 16:25:45'),
(6, 1, 'string', 'string', 'string', 'string', 'string@gmail.com', '090988787778', 'string', 'string', 'string', '', '', 'IBS|14032023|1826', 'pending', '2023-03-14 16:26:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Administrative_users`
--
ALTER TABLE `Administrative_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `applicable_taxes`
--
ALTER TABLE `applicable_taxes`
  ADD PRIMARY KEY (`id`);


--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mda`
--
ALTER TABLE `mda`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `mda_users`
--
ALTER TABLE `mda_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `our_services`
--
ALTER TABLE `our_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payer_user`
--
ALTER TABLE `payer_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_2`
--
ALTER TABLE `payment_2`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_collection_report_individual`
--
ALTER TABLE `payment_collection_report_individual`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_form_labels`
--
ALTER TABLE `payment_form_labels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pending_payment_list`
--
ALTER TABLE `pending_payment_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `primary_tax_clearance_certificate`
--
ALTER TABLE `primary_tax_clearance_certificate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `primary_TIN_request`
--
ALTER TABLE `primary_TIN_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `revenue_heads`
--
ALTER TABLE `revenue_heads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `revenue_heads1`
--
ALTER TABLE `revenue_heads1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `secondary_tax_clearance_certificate`
--
ALTER TABLE `secondary_tax_clearance_certificate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `secondary_TIN_request`
--
ALTER TABLE `secondary_TIN_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax_filing`
--
ALTER TABLE `tax_filing`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Administrative_users`
--
ALTER TABLE `Administrative_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `applicable_taxes`
--
ALTER TABLE `applicable_taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=418;

--
-- AUTO_INCREMENT for table `mda`
--
ALTER TABLE `mda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `mda_users`
--
ALTER TABLE `mda_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `our_services`
--
ALTER TABLE `our_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payer_user`
--
ALTER TABLE `payer_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `payment_2`
--
ALTER TABLE `payment_2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_collection_report_individual`
--
ALTER TABLE `payment_collection_report_individual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_form_labels`
--
ALTER TABLE `payment_form_labels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `pending_payment_list`
--
ALTER TABLE `pending_payment_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `primary_tax_clearance_certificate`
--
ALTER TABLE `primary_tax_clearance_certificate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `primary_TIN_request`
--
ALTER TABLE `primary_TIN_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `revenue_heads`
--
ALTER TABLE `revenue_heads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=435;

--
-- AUTO_INCREMENT for table `revenue_heads1`
--
ALTER TABLE `revenue_heads1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `secondary_tax_clearance_certificate`
--
ALTER TABLE `secondary_tax_clearance_certificate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `secondary_TIN_request`
--
ALTER TABLE `secondary_TIN_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tax_filing`
--
ALTER TABLE `tax_filing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
