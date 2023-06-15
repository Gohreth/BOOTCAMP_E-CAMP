--Aquellas usadas para insertar, modificar y eliminar un Customer.
INSERT INTO customer (store_id, first_name, last_name, email, address_id, activebool, active)
VALUES (1, 'Sebastian', 'Campos', 'sebastian.campos@sakilacustomer.org', 5, true, 1);
UPDATE customer SET first_name = 'Andres', last_name = 'Fernandez'
WHERE first_name = 'Sebastian' AND last_name = 'Campos';
DELETE FROM customer WHERE first_name = 'Andres' AND last_name = 'Fernandez';

--Aquellas usadas para insertar, modificar y eliminar un Staff.
SELECT * FROM staff;
INSERT INTO staff (first_name, last_name, address_id, email, store_id, active, username, password, picture)
VALUES ('Sebastian', 'Campos', 5, 'sebastian.campos@sakilacustomer.org', 1, true, 'Gohreth',
		'8cb2237d0679ca88db6464eac60da96345513964', NULL);
UPDATE staff SET first_name = 'Andres', last_name = 'Fernandez'
WHERE first_name = 'Sebastian' AND last_name = 'Campos';
DELETE FROM staff WHERE first_name = 'Andres' AND last_name = 'Fernandez';


--Aquellas usadas para insertar, modificar y eliminar un Actor.
SELECT * FROM actor;
INSERT INTO actor (first_name, last_name) VALUES ('Sebastian', 'Campos');
UPDATE actor SET first_name = 'Andres', last_name = 'Fernandez'
WHERE first_name = 'Sebastian' AND last_name = 'Campos';
DELETE FROM actor WHERE first_name = 'Andres' AND last_name = 'Fernandez';

--Listar todas las “rental” con los datos del “customer” dado un año y mes.
SELECT c.first_name, c.last_name, c.email, r.* FROM rental AS r
INNER JOIN customer AS c ON r.customer_id = c.customer_id 
WHERE EXTRACT (YEAR FROM r.rental_date) = 2005 AND EXTRACT (MONTH FROM r.rental_date) = 6;

--Listar Número, Fecha (payment_date) y Total (amount) de todas las “payment”.
SELECT payment_id, payment_date, amount FROM payment;

--Listar todas las “film” del año 2006 que contengan un (rental_rate) mayor a 4.0.
SELECT * FROM film WHERE release_year = 2006 AND rental_rate > 4.00;

/*
DICCIONARIO DE DATOS

	Tabla "actor", contiene información básica de un actor:
actor_id: identificador único del actor (tipo: smallint).
first_name: nombre del actor (tipo: character varying).
last_name: apellido del actor (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "address", contiene datos relevantes de una ubicación geográfica junto al número telefónico asociado:
address_id: identificador único de la dirección (tipo: smallint).
address: dirección (tipo: character varying).
address2: segunda línea de dirección (tipo: character varying, puede ser nulo).
district: distrito (tipo: character varying).
city_id: identificador de la ciudad (tipo: smallint).
postal_code: código postal (tipo: character varying).
phone: número de teléfono (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "category", contiene simplemente el nombre de la categoría:
category_id: identificador único de la categoría (tipo: smallint).
name: nombre de la categoría (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "city", contiene simplemente el nombre de la ciudad y el identificador del país donde se sitúa:
city_id: identificador único de la ciudad (tipo: smallint).
city: nombre de la ciudad (tipo: character varying).
country_id: identificador del país (tipo: smallint).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "country", contiene simplemente el nombre del país:
country_id: identificador único del país (tipo: smallint).
country: nombre del país (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "customer", contiene información asociada al cliente:
customer_id: identificador único del cliente (tipo: smallint).
store_id: identificador de la tienda (tipo: smallint).
first_name: nombre del cliente (tipo: character varying).
last_name: apellido del cliente (tipo: character varying).
email: dirección de correo electrónico del cliente (tipo: character varying, puede ser nulo).
address_id: identificador de la dirección (tipo: smallint).
activebool: estado de activación del cliente (tipo: boolean).
create_date: fecha de creación del cliente (tipo: date).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "film", contiene información básica de una película y datos relacionados a su alquiler:
film_id: identificador único de la película (tipo: smallint).
title: título de la película (tipo: character varying).
description: descripción de la película (tipo: text, puede ser nulo).
release_year: año de lanzamiento de la película (tipo: year, puede ser nulo).
language_id: identificador del idioma de la película (tipo: smallint).
rental_duration: duración del alquiler en días (tipo: smallint).
rental_rate: tarifa de alquiler (tipo: numeric).
length: duración de la película en minutos (tipo: smallint, puede ser nulo).
replacement_cost: costo de reemplazo de la película (tipo: numeric).
rating: clasificación de la película (tipo: mpaa_rating, puede ser nulo).
special_features: características especiales de la película (tipo: text[], puede ser nulo).
fulltext: texto completo de la película (tipo: tsvector).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "inventory", contiene las llaves foráneas de las entidades relacionadas film y store, para saber
	en que tienda se encuentra disponible una película:
inventory_id: identificador único del inventario (tipo: smallint).
film_id: identificador de la película (tipo: smallint).
store_id: identificador de la tienda (tipo: smallint).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "language", contiene solamente el nombre del idioma:
language_id: identificador único del idioma (tipo: smallint).
name: nombre del idioma (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "payment", contiene información de todos los entes involucrados a la hora de hacer un alquiler de
	una película junto al monto asociado:
payment_id: identificador único del pago (tipo: smallint).
customer_id: identificador del cliente (tipo: smallint).
staff_id: identificador del personal (tipo: smallint).
rental_id: identificador del alquiler (tipo: smallint).
amount: monto del pago (tipo: numeric).
payment_date: fecha del pago (tipo: timestamp without time zone).

	Tabla "rental", contiene información relacionada al alquiler, como la fecha de retorno de la película:
rental_id: identificador único del alquiler (tipo: smallint).
rental_date: fecha del alquiler (tipo: timestamp without time zone).
inventory_id: identificador del inventario (tipo: smallint).
customer_id: identificador del cliente (tipo: smallint).
return_date: fecha de devolución del alquiler (tipo: timestamp without time zone).
staff_id: identificador del personal (tipo: smallint).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "staff", contiene información referente al personal junto a sus credenciales de ingreso e imagen personal:
staff_id: identificador único del personal (tipo: smallint).
first_name: nombre del personal (tipo: character varying).
last_name: apellido del personal (tipo: character varying).
address_id: identificador de la dirección (tipo: smallint).
email: dirección de correo electrónico del personal (tipo: character varying).
store_id: identificador de la tienda (tipo: smallint).
active: estado de actividad del personal (tipo: boolean).
username: nombre de usuario del personal (tipo: character varying).
password: contraseña del personal (tipo: character varying).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).
picture: imagen del personal (tipo: bytea).

	Tabla "store", contiene las llaves foráneas de las entidades relacionadas staff y address, para saber
	quien administra una tienda en específico:
store_id: identificador único de la tienda (tipo: smallint).
manager_staff_id: identificador del personal gerente de la tienda (tipo: smallint).
address_id: identificador de la dirección de la tienda (tipo: smallint).
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "film_actor", contiene las llaves foráneas de las entidades relacionadas film y actor:
actor_id: identificador del actor (tipo: smallint, clave foránea referenciando a la tabla "actor").
film_id: identificador de la película (tipo: smallint, clave foránea referenciando a la tabla "film").
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

	Tabla "film_category", contiene las llaves foráneas de las entidades relacionadas film y category:
film_id: identificador de la película (tipo: smallint, clave foránea referenciando a la tabla "film").
category_id: identificador de la categoría (tipo: smallint, clave foránea referenciando a la tabla "category").
last_update: marca de tiempo de la última actualización (tipo: timestamp without time zone).

La columna last_update en las tablas corresponde a un trigger que se ejecuta BEFORE UPDATE.
*/
