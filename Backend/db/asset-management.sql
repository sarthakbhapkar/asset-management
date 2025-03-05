CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        role VARCHAR CHECK (role IN ('admin', 'employee')) NOT NULL DEFAULT 'employee',
        seat_n INTEGER,
        active BOOLEAN DEFAULT true
);

CREATE TABLE assets (
        id SERIAL PRIMARY KEY,
        type VARCHAR CHECK (type IN ('hardware', 'software')) NOT NULL,
        name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR CHECK (status IN ('assigned', 'unassigned')) NOT NULL
);

CREATE TABLE asset_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        asset_id INTEGER NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unassigned_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (asset_id) REFERENCES assets(id)
);

CREATE TABLE employee_request (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        asset_id INTEGER NOT NULL,
        status VARCHAR CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (asset_id) REFERENCES assets(id)
);

insert into users(first_name, last_name, email, password, role, seat_n) values
                ('Sarthak','Bhapkar','sarthak@gmail.com','sarthak','admin','1');
insert into users(first_name, last_name, email, password, seat_n) values
    ('Shivam','Chouksey','shivam@gmail.com','shivam',2);
select * from users;

insert into assets(type, name) VALUES ('hardware','Laptop');
insert into assets(type, name) VALUES ('software','Quick-Heal');
select * from assets;


insert into asset_history(user_id, asset_id) values (7,1);
update assets set status='assigned' where id=1;

ALTER TABLE assets
    DROP column status;

ALTER TABLE assets
    ADD COLUMN status VARCHAR CHECK (status IN ('assigned', 'unassigned', 'disposed'))
        default 'unassigned' not null;
