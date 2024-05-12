CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "movie";

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "movie" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    year INTEGER,
    director VARCHAR(100),
    genre VARCHAR(100),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "user" (username, password, email) VALUES (
  'default', 
  '$argon2id$v=19$m=65536,t=3,p=4$/4uENUnrSzAlExkyeBw/CA$UuUwIIr01ISEcAL+Lt8riWE0RgUnbZYEkPbMPsDR+74', 
  'default@email.com');

INSERT INTO "movie" (title, description, year, director, genre) VALUES ('Filme 1', 'Descrição do Filme 1', 2001, 'Diretor 1', 'Gênero 1');
INSERT INTO "movie" (title, description, year, director, genre) VALUES ('Filme 2', 'Descrição do Filme 2', 2002, 'Diretor 2', 'Gênero 2');