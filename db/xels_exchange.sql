DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(100) DEFAULT NULL,
  `xels_address` varchar(200) NOT NULL,
  `eth_address` varchar(200) NOT NULL,
  `eth_pvt` varchar(256) NOT NULL,
  `xels_amount` decimal(20,8) NOT NULL,
  `eth_token_amount` decimal(20,8) NOT NULL,
  `status` int(10) NOT NULL DEFAULT '0',
  `transaction_id` varchar(256) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
