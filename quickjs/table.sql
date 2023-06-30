

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees`(

`employeeNumber` int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
`lastName` varchar(50) NOT NULL,
`firstName` varchar(50) NOT NULL,
`extension` varchar(10) NOT NULL,
`email` varchar(100) NOT NULL,
`officeCode` varchar(10) NOT NULL,
`reportsTo` int(11) DEFAULT NULL,
`jobTittle` varchar(50) NOT NULL,

KEY `reportsTo` (`reportsTo`),
KEY `officeCode`(`officeCode`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;