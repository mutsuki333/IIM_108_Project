# Database settings and tables
* [This usage](#this_usage)
* [MySQL](#mysql)
* [MongoDB](#mongodb)

## This usage  
(on rpi3)  
User : `root`   
Pwd : `admin`  
database : `customer`  
=>`mysql -h 172.20.10.7 -u root -p customer`

### Tables
```
mysql> describe users;
+-----------------------------+-------------------+------+-----+-------------------+----------------+
| Field                       | Type              | Null | Key | Default           | Extra          |
+-----------------------------+-------------------+------+-----+-------------------+----------------+
| id                          | mediumint(9)      | NO   | PRI | NULL              | auto_increment |
| username                    | varchar(20)       | NO   |     | NULL              |                |
| password_hash               | varchar(128)      | NO   |     | NULL              |                |
| email                       | varchar(120)      | YES  |     | NULL              |                |
| mobile                      | varchar(20)       | YES  |     | NULL              |                |
| date_of_birth               | date              | YES  |     | NULL              |                |
| gender                      | enum('m','f','a') | YES  |     | NULL              |                |
| first_name                  | varchar(20)       | NO   |     | NULL              |                |
| last_name                   | varchar(20)       | NO   |     | NULL              |                |
| middle_name                 | varchar(20)       | YES  |     | NULL              |                |
| credit_card_number_h        | varchar(128)      | YES  |     | NULL              |                |
| credit_card_expiration_date | char(7)           | YES  |     | NULL              |                |
| credit_card_security_code_h | varchar(128)      | YES  |     | NULL              |                |
| join_date                   | timestamp         | NO   |     | CURRENT_TIMESTAMP |                |
+-----------------------------+-------------------+------+-----+-------------------+----------------+
```

## MySQL 
### Setup
to use command line tools:  
`echo 'export PATH=/usr/local/mysql/bin:$PATH' >> ~/.bash_profile`  
to set connection privileges
```MySQL
>use mysql
>GRANT ALL ON *.* to root@'%' IDENTIFIED BY 'yourpassword';
>FLUSH PRIVILEGES;

/* '%' or '192.186.2.%' */
```
### Basic commands
#### Connect
`mysql -h host -u user -p <database_name?>` 
#### syntax
cmd|usage
---|---
`\c`|cancel execution
`SHOW <tables/databases...>;`|find out what is on the server
`USE name;`|If the **name** database exists, try to access it:
#### Tables
**Create** : `CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20), species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);`  
**DESCRIBE** : `DESCRIBE pet`  


#### Disconnect
`QUIT` 




### SQLAlchemy 

## MongoDB
### Start  
`mongod --dbpath ~/data/db`
### Connect  
`mongo --host 127.0.0.1:27017`
### Basic commands
