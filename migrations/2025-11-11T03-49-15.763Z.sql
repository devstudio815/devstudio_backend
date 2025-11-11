CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- ✅ Auto increment
    username VARCHAR(200) NOT NULL, 
    email TEXT NOT NULL UNIQUE, 
    password TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT false, 
    role VARCHAR(20),
    image TEXT, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);