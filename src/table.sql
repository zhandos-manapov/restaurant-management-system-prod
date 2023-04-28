create table user(
    id int primary key auto_increment,
    name varchar(250),
    contact_number varchar(20),
    email varchar(50),
    salt varchar(256),
    hash varchar(256),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);
insert into user(
        name,
        contactNumber,
        email,
        password,
        status,
        role
    )
values (
        'Admin',
        '12345678',
        'admin@gmail.com',
        'admin',
        'true',
        'admin'
    );
insert into user(
        name,
        contactNumber,
        email,
        password,
        status,
        role
    )
values(
        'John',
        '12345566',
        'john@gmail.com',
        '54321',
        'true',
        'user'
    ),
    (
        'Bob',
        '1234567890',
        'bob@gmail.com',
        '123456',
        'true',
        'user'
    ),
    (
        'Brad',
        '1234567890',
        'brad@gmail.com',
        '1810340123',
        'true',
        'user'
    ),
    (
        'Steve',
        '9012364123',
        'steve@gmail.com',
        '191203410923013',
        'true',
        'user'
    ),
    (
        'Jack',
        '1239123113',
        'jack@gmail.com',
        '1231231231231',
        'true',
        'user'
    ),
    (
        'Fred',
        '1231123412',
        'fred@gmail.com',
        '134123413413',
        'true',
        'user'
    );
create table category(
    id int not null auto_increment,
    name varchar(255) not null,
    primary key(id)
);
insert into category(name)
values ('Drinks'),
    ('Pizza'),
    ('Breakfasts'),
    ('Dessert'),
    ('Pasta'),
    ('Snacks'),
    ('Salads'),
    ('Soups'),
    ('Hot Drinks'),
    ('Steaks'),
    ('Rolls');
create table product(
    id int not null auto_increment,
    name varchar(255) not null,
    categoryId integer not null,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id)
);
insert into product(name, categoryId, description, price, status)
values('Pepperoni', 2, 'Sausage pizza', 500, 'true'),
    ('Coke', 1, 'soft drink', 5, 'true'),
    ('Pancakes', 3, 'pancakes', 10, 'true'),
    ('Snickers', 4, 'Cake', 15, 'true'),
    ('Coffee', 9, 'coffee', 5, 'true'),
    ('Carbonara', 5, 'pasta dish', 15, 'true');
create table bill(
    id int not null auto_increment,
    uuid varchar(200) not null,
    name varchar(255) not null,
    email varchar(255) not null,
    contactNumber varchar(20) not null,
    paymentMethod varchar(50) not null,
    total int not null,
    productDetails text,
    createdBy varchar(255) not null,
    primary key(id)
);