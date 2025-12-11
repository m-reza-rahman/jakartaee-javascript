CREATE TABLE javascript_users (username VARCHAR(20) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (username))
CREATE TABLE javascript_groups (username VARCHAR(20) NOT NULL, group_name VARCHAR(20) NOT NULL, PRIMARY KEY (username, group_name))
ALTER TABLE javascript_groups ADD CONSTRAINT fk_username FOREIGN KEY(username) REFERENCES javascript_users (username)
