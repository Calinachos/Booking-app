# sudo mysql -u root # I had to use "sudo" since is new installation

USE mysql;
CREATE USER 'test'@'localhost' IDENTIFIED BY 'testdb123';
GRANT ALL PRIVILEGES ON *.* TO 'test'@'localhost';
FLUSH PRIVILEGES;

# sudo service mysql restart