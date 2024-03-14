-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS relationships_regions (
    id SERIAL PRIMARY KEY,
    parent_id INT NULL,
    child_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS microcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS relationships_microcategories (
    id SERIAL PRIMARY KEY,
    parent_id INT NULL,
    child_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    region_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_segments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    segment_id SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    microcategory_id INT NOT NULL,
    is_order BOOLEAN NOT NULL,
    datetime TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE relationships_regions
    ADD CONSTRAINT fk_parent
        FOREIGN KEY (parent_id) REFERENCES regions(id),
    ADD CONSTRAINT fk_child
        FOREIGN KEY (child_id) REFERENCES regions(id);

ALTER TABLE relationships_microcategories
    ADD CONSTRAINT fk_parent
        FOREIGN KEY (parent_id) REFERENCES microcategories(id),
    ADD CONSTRAINT fk_child
        FOREIGN KEY (child_id) REFERENCES microcategories(id);

ALTER TABLE users_segments
    ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE interests
    ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT fk_microcategory
        FOREIGN KEY (user_id) REFERENCES microcategories(id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS regions, relationships_regions, microcategories, relationships_microcategories, users, users_segments, interests   CASCADE
-- +goose StatementEnd
