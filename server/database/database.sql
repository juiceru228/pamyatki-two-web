 CREATE DATABASE forum;
   \c forum
   
CREATE TABLE users(
       id SERIAL PRIMARY KEY,
       username VARCHAR(28) NOT NULL UNIQUE,
       passhash VARCHAR NOT NULL 
   );

CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES threads(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT,
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_number SERIAL
);

UPDATE messages SET message_number = (SELECT COUNT(*) FROM messages WHERE thread_id = messages.thread_id AND created_at <= messages.created_at);
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);

