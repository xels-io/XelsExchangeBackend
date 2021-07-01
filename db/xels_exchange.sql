CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `order_no` varchar(100) DEFAULT NULL,
  `deposit_symbol` varchar(100) NOT NULL DEFAULT 'SELS',
  `xels_address` varchar(200) NOT NULL,
  `deposit_address` varchar(200) NOT NULL,
  `deposit_pvt` varchar(256) NOT NULL,
  `xels_amount` decimal(20,8) NOT NULL,
  `deposit_amount` decimal(20,8) NOT NULL,
  `status` int(10) NOT NULL DEFAULT 0,
  `transaction_id` varchar(256) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table Xels_Exchange_DB.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_code` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
