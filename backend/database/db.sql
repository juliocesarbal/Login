CREATE DATABASE surtidorDB;

CREATE TABLE rol (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
nombre VARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE permiso (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
nombre VARCHAR(40) NOT NULL UNIQUE,
descripcion VARCHAR(100)
);
CREATE TABLE permiso_rol (
id_permiso UUID NOT NULL,
id_rol UUID NOT NULL,
PRIMARY KEY (id_permiso, id_rol),
FOREIGN KEY (id_permiso) REFERENCES permiso(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_rol) REFERENCES rol(id) ON DELETE CASCADE ON UPDATE
CASCADE
);
CREATE TABLE empresa (
id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
direccion VARCHAR(40) NOT NULL,
nombre VARCHAR(40) NOT NULL,
logo_url VARCHAR(40),
telefono VARCHAR(20),
nombre_propietario VARCHAR(40) NOT NULL,
fecha DATE NOT NULL,
correo VARCHAR(30) NOT NULL,
nit VARCHAR(20) NOT NULL
);
CREATE TABLE descuento (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
descripcion VARCHAR(100) NOT NULL,
tipo VARCHAR(20) NOT NULL,
monto DECIMAL(7) NOT NULL,
porcentaje DECIMAL(5) NOT NULL,
esta_activo BOOLEAN NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sucursal (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL UNIQUE,
direccion VARCHAR(40) NOT NULL,
telefono VARCHAR(20),
correo VARCHAR(30) NOT NULL,
esta_suspendido BOOLEAN NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
id_empresa UUID,
id_descuento UUID,
FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (id_descuento) REFERENCES descuento(id) ON DELETE CASCADE
ON UPDATE CASCADE
);
CREATE TABLE usuario (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
ci VARCHAR(40) NOT NULL UNIQUE,
nombre VARCHAR(40) NOT NULL,
telefono VARCHAR(20) NOT NULL,
sexo CHAR(1) NOT NULL,
correo VARCHAR(30) NOT NULL UNIQUE,
domicilio VARCHAR(40) NOT NULL,
contraseña TEXT NOT NULL,
id_sucursal UUID,
id_rol UUID NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_rol) REFERENCES rol(id) ON DELETE CASCADE ON UPDATE
CASCADE
);
CREATE TABLE dispensador (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
ubicacion VARCHAR(40) NOT NULL,
capacidad_maxima INT NOT NULL,
estado VARCHAR(15) NOT NULL,
id_sucursal UUID NOT NULL,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE categoria (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
descripcion VARCHAR(100),
imagen_url VARCHAR(40)
);
CREATE TABLE combustible (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tipo VARCHAR(30) NOT NULL,
octanaje DECIMAL(7,2) NOT NULL,
nombre VARCHAR(15) NOT NULL,
esta_activo BOOLEAN NOT NULL
);
CREATE TABLE tanque (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
descripcion VARCHAR(100) NOT NULL,
capacidad_max INT NOT NULL,
esta_activo BOOLEAN NOT NULL,
fecha_instalacion DATE NOT NULL,
ultima_revision DATE NOT NULL,
stock DECIMAL(7, 2) NOT NULL,
id_sucursal UUID NOT NULL,
id_combustible UUID NOT NULL,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_combustible) REFERENCES combustible(id) ON DELETE
CASCADE ON UPDATE CASCADE
);
CREATE TABLE producto (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
stock DECIMAL(7, 2) NOT NULL,
stock_minimo DECIMAL(7, 2) NOT NULL,
descripcion VARCHAR(100),
unidad_medida VARCHAR(10),
precio_venta DECIMAL(7, 2) NOT NULL,
precio_compra DECIMAL(7, 2) NOT NULL,
iva DECIMAL(7, 2) NOT NULL,
url_image VARCHAR(40),
esta_activo BOOLEAN NOT NULL,
descuento DECIMAL(7, 2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
id_categoria UUID NOT NULL,
id_sucursal UUID NOT NULL,
id_tanque UUID,
FOREIGN KEY (id_categoria) REFERENCES categoria(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_tanque) REFERENCES tanque(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
ALTER TABLE combustible
ADD COLUMN id_producto UUID,
ADD CONSTRAINT fk_combustible_producto
FOREIGN KEY (id_producto)
REFERENCES producto(id)
ON DELETE CASCADE
ON UPDATE CASCADE;
CREATE TABLE grupo (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
descripcion VARCHAR(100)
);
CREATE TABLE grupo_producto (
id_producto UUID NOT NULL DEFAULT gen_random_uuid(),
id_grupo UUID NOT NULL,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_grupo) REFERENCES grupo(id) ON DELETE CASCADE ON UPDATE
CASCADE
);
CREATE TABLE proveedor (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
telefono VARCHAR(20) NOT NULL,
correo VARCHAR(40) NOT NULL,
direccion VARCHAR(40) NOT NULL,
nit VARCHAR(20) NOT NULL,
detalle VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE proveedor_producto (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
detalle VARCHAR(100) NOT NULL,
ultimo_precio INT NOT NULL,
id_proveedor UUID NOT NULL,
id_producto UUID NOT NULL,
FOREIGN KEY (id_proveedor) REFERENCES proveedor(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE nota_de_compra (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
codigo VARCHAR(40) NOT NULL,
motivo VARCHAR(100) NOT NULL,
hora TIME NOT NULL,
monto_total DECIMAL(7) NOT NULL,
moneda VARCHAR(20) NOT NULL,
id_proveedor UUID NOT NULL,
id_sucursal UUID NOT NULL,
id_usuario UUID NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_proveedor) REFERENCES proveedor(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE orden_de_compra (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
codigo VARCHAR(40) NOT NULL,
fecha DATE NOT NULL,
hora TIME NOT NULL,
motivo VARCHAR(100) NOT NULL,
estado VARCHAR(15) NOT NULL,
id_proveedor UUID,
id_sucursal UUID,
id_nota_de_compra UUID,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_proveedor) REFERENCES proveedor(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_nota_de_compra) REFERENCES nota_de_compra(id) ON DELETE
CASCADE ON UPDATE CASCADE
);
CREATE TABLE detalle_orden_compra (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
cantidad DECIMAL(7, 2) NOT NULL,
id_producto UUID NOT NULL,
id_orden_de_compra UUID NOT NULL,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_orden_de_compra) REFERENCES orden_de_compra(id) ON DELETE
CASCADE ON UPDATE CASCADE
);
CREATE TABLE lote (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
codigo VARCHAR(40) NOT NULL,
fecha_vencimiento DATE NOT NULL,
detalle VARCHAR(100) NOT NULL,
stock DECIMAL(7, 2) NOT NULL,
stock_inicial DECIMAL(7, 2) NOT NULL,
esta_activo BOOLEAN NOT NULL,
id_producto UUID NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE detalle_compra (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
cantidad DECIMAL(7, 2) NOT NULL,
precio DECIMAL(7, 2) NOT NULL,
subtotal DECIMAL(7, 2) NOT NULL,
id_nota_de_compra UUID NOT NULL,
id_lote UUID NOT NULL,
id_tanque UUID NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_nota_de_compra) REFERENCES nota_de_compra(id) ON DELETE
CASCADE ON UPDATE CASCADE,
FOREIGN KEY (id_lote) REFERENCES lote(id) ON DELETE CASCADE ON UPDATE
CASCADE,
FOREIGN KEY (id_tanque) REFERENCES tanque(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE notificacion_producto (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
titulo VARCHAR(30) NOT NULL,
descripcion VARCHAR(100) NOT NULL,
hora TIME NOT NULL,
id_producto UUID NOT NULL,
id_lote UUID NOT NULL,
id_tanque UUID NOT NULL,
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_lote) REFERENCES lote(id) ON DELETE CASCADE ON UPDATE
CASCADE,
FOREIGN KEY (id_tanque) REFERENCES tanque(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE usuario_notificacion (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
visto BOOLEAN NOT NULL,
recordar BOOLEAN NOT NULL,
id_notificacion_producto UUID NOT NULL,
id_usuario UUID NOT NULL,
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_notificacion_producto) REFERENCES notificacion_producto(id) ON
DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE manguera (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
esta_activo BOOLEAN NOT NULL,
id_dispensador UUID NOT NULL,
id_combustible UUID NOT NULL,
FOREIGN KEY (id_dispensador) REFERENCES dispensador(id) ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (id_combustible) REFERENCES combustible(id) ON DELETE CASCADE
ON UPDATE CASCADE
);
CREATE TABLE cliente (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nombre VARCHAR(40) NOT NULL,
nit VARCHAR(20) NOT NULL,
placa VARCHAR(10) NOT NULL UNIQUE,
b_sisa BOOLEAN NOT NULL,
cantidad_mensual_vendida int,
ultima_fecha DATE,
id_sucursal UUID NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE nota_venta (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
codigo VARCHAR(40) NOT NULL,
monto_pagado VARCHAR(100) NOT NULL,
monto_por_cobrar DECIMAL(5) NOT NULL,
monto_cambio VARCHAR(20) NOT NULL,
hora TIME NOT NULL,
id_sucursal UUID NOT NULL,
id_usuario UUID NOT NULL,
id_dispensador UUID,
id_cliente UUID NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_dispensador) REFERENCES dispensador(id) ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE detalle_venta (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
cantidad DECIMAL(7, 2) NOT NULL,
precio DECIMAL(7, 2) NOT NULL,
subtotal DECIMAL(7, 2) NOT NULL,
id_nota_venta UUID,
id_producto UUID,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_nota_venta) REFERENCES nota_venta(id) ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE salida (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
motivo VARCHAR(100) NOT NULL,
destino VARCHAR(40) NOT NULL,
notas_adicionales VARCHAR(100) NOT NULL,
id_usuario UUID NOT NULL,
id_sucursal UUID NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE ON
UPDATE CASCADE,
FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE CASCADE ON
UPDATE CASCADE
);
CREATE TABLE salida_producto (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
cantidad DECIMAL(7, 2) NOT NULL,
id_salida UUID NOT NULL,
id_lote UUID NOT NULL,
FOREIGN KEY (id_salida) REFERENCES salida(id) ON DELETE CASCADE ON UPDATE
CASCADE,
FOREIGN KEY (id_lote) REFERENCES lote(id) ON DELETE CASCADE ON UPDATE
CASCADE
);
DROP TABLE salida;
-- TABLA ROL
INSERT INTO rol (nombre) VALUES
('Administrador'),
('Empleado'),
('Supervisor');
SELECT * FROM rol;
-- TABLA PERSMISO
INSERT INTO permiso (nombre, descripcion) VALUES
('Gestionar Usuarios', 'Permite agregar, editar y eliminar usuarios.'),
('Gestionar Productos', 'Permite agregar, editar y eliminar productos.');
SELECT * FROM permiso;
-- TABLA PERMISO_ROL
INSERT INTO permiso_rol (id_permiso, id_rol) VALUES
((SELECT id FROM permiso WHERE nombre = 'Gestionar Usuarios'), (SELECT id FROM rol
WHERE nombre = 'Administrador')),
((SELECT id FROM permiso WHERE nombre = 'Gestionar Productos'), (SELECT id FROM
rol WHERE nombre = 'Administrador'));
SELECT * FROM permiso_rol;
SELECT rol.nombre,permiso.nombre FROM permiso_rol,permiso,rol WHERE permiso_rol.id_permiso=permiso.id AND 
 permiso_rol.id_rol=rol.id;
-- TABLA EMPRESA
INSERT INTO empresa (direccion, nombre, logo_url, telefono, nombre_propietario, fecha,
correo, nit) VALUES
('Av.Cristo Redentor', 'Octano Adm Ofice', 'url_logo1', '77616677', 'Maribel Osorio', '2025-03-27',
'AdmOfice@gmail.com', '1234567890');
SELECT * FROM empresa;
-- TABLA DESCUENTO
INSERT INTO descuento (nombre, descripcion, tipo, monto, porcentaje, esta_activo)
VALUES
('Descuento de Bienvenida', 'Descuento para nuevos clientes', 'Fijo', 5, 0, true),
('Descuento de Temporada', 'Descuento por temporada alta', 'Porcentaje', 0, 10, true);
SELECT * FROM descuento;
-- TABLA SUCURSAL
INSERT INTO sucursal (nombre, direccion, telefono, correo, esta_suspendido, id_empresa,
id_descuento) VALUES
('Octano Paurito', 'Av.Paurito', '987654321', 'OctPaurito@gmail.com', false,
(SELECT id FROM empresa WHERE nombre = 'Octano Adm Ofice'), 
(SELECT id FROM descuento WHERE nombre = 'Descuento de Bienvenida')),
('Octano Sur', 'Av.Bolivia', '77813346', 'OctSuro@gmail.com', false,
(SELECT id FROM empresa WHERE nombre = 'Octano Adm Ofice'), 
(SELECT id FROM descuento WHERE nombre = 'Descuento de Bienvenida'));
SELECT * FROM sucursal;
-- TABLA USUARIO
INSERT INTO usuario (ci, nombre, telefono, sexo, correo, domicilio, contraseña, id_sucursal,
id_rol) VALUES
('1234567', 'María López', '654321987', 'F', 'maria@gmail.com', 'Calle Libertad 789',
'contraseña123', (SELECT id FROM sucursal WHERE nombre = 'Octano Paurito'),
(SELECT id FROM rol WHERE nombre = 'Administrador')),
('7654321', 'Mateo Bersatti', '321987654', 'M', 'Mateo@gmail.com', 'Calle Independencia',
'contraseña456', (SELECT id FROM sucursal WHERE nombre = 'Octano Sur'),
(SELECT id FROM rol WHERE nombre = 'Empleado'));
SELECT * FROM usuario;
-- TABLA DISPENSADOR
INSERT INTO dispensador ( ubicacion, capacidad_maxima, estado, id_sucursal) VALUES
('Pista 1', 1000, 'Operativo', (SELECT id FROM sucursal WHERE nombre = 'Octano Sur')),
('Pista 2', 1000, 'Mantenimiento', (SELECT id FROM sucursal WHERE nombre = 'Octano Paurito'));
SELECT * FROM dispensador;
-- TABLA CATEGORIA
INSERT INTO categoria (nombre, descripcion, imagen_url) VALUES
('Combustible', 'GNV para vehículos pesados y livianos', 'url_imagen_combustible'),
('Lubricante y aceite', 'Productos para el mantenimiento del motor.', 'url_imagen_aceite'),
('Accesorio', 'Artículos prácticos y decorativos para automóviles', 'url_imagen_accesorio');
SELECT * FROM categoria;
-- TABLA COMBUSTIBLE
INSERT INTO combustible (tipo, octanaje, nombre, esta_activo) VALUES
('Gas', 110, 'GNV', true);
SELECT * FROM combustible;
-- TABLA TANQUE
INSERT INTO tanque (nombre, descripcion, capacidad_max, esta_activo,
fecha_instalacion, ultima_revision, stock, id_sucursal, id_combustible) VALUES
('Tanque 1', 'Tanque de gas Regular', 7000, true,
'2024-02-01', '2024-10-09', 6000, (SELECT id FROM sucursal WHERE nombre = 'Octano Paurito'), 
(SELECT id FROM combustible WHERE tipo = 'Gas' and nombre = 'GNV')),
('Tanque 2', 'Tanque de gas Regular', 7000, true, 
'2024-01-15', '2024-09-01', 7000, (SELECT id FROM sucursal WHERE nombre = 'Octano Paurito'),
(SELECT id FROM combustible WHERE tipo = 'Gas' and nombre ='GNV')),
('Tanque 3', 'Tanque de gas Grande', 10000, true, 
'2023-01-15', '2024-10-01', 8000, (SELECT id FROM sucursal WHERE nombre = 'Octano Sur'),
(SELECT id FROM combustible WHERE tipo = 'Gas' and nombre ='GNV'));
SELECT * FROM tanque;
-- TABLA PRODUCTO
INSERT INTO producto (nombre, stock, stock_minimo, descripcion,unidad_medida, precio_venta,
precio_compra, iva, url_image, esta_activo, descuento, id_categoria, id_sucursal, id_tanque)
VALUES
('GNV', 8000, 1000, 'GNV en almacen','m^3', 1.66, 1.0, 13.0,
'url_imagen_gas', true, 0.0, (SELECT id FROM categoria WHERE nombre =
'Combustible'), (SELECT id FROM sucursal WHERE nombre = 'Octano Paurito'),
(SELECT id FROM tanque WHERE nombre = 'Tanque 1'));
SELECT * FROM producto;
DELETE FROM producto;

update combustible set id_producto = (Select id from producto where nombre = 'GNV');
-- TABLA GRUPO
INSERT INTO grupo (nombre, descripcion) VALUES
('Ofertas', 'Productos en oferta'),
('Promociones', 'Promociones especiales');
SELECT * FROM grupo;
-- TABLA GRUPO_PRODUCTO
INSERT INTO grupo_producto (id_producto, id_grupo) VALUES
((Select id from producto where nombre = 'GNV'), (Select id from grupo where
nombre = 'Ofertas')),
((Select id from producto where nombre = 'GNV'), (Select id from grupo where
nombre = 'Promociones'));
SELECT * FROM grupo_producto;
-- TABLA PROVEEDOR
INSERT INTO proveedor (nombre, telefono, correo, direccion, nit, detalle) VALUES
('Proveedor A', '987654321', 'prov1@gmail.com', 'Calle Comercial 123',
'1234567890', 'Proveedor de gas'),
('Proveedor B', '123123123', 'prov2@gmail.com', 'Calle 222',
'0987654321', 'Proveedor de gas');
SELECT * FROM proveedor;
-- TABLA PROVEEDOR_PRODUCTO
INSERT INTO proveedor_producto (detalle, ultimo_precio, id_proveedor, id_producto)
VALUES
('Precio por m^3', 1.0, (Select id from proveedor where nombre = 'Proveedor A'), (Select id
from producto where nombre = 'GNV')),
('Precio por m^3', 1.0, (Select id from proveedor where nombre = 'Proveedor A'), (Select id
from producto where nombre = 'GNV'));

SELECT * FROM proveedor_producto;
-- TABLA NOTA_DE_COMPRA
INSERT INTO nota_de_compra (codigo, motivo, hora, monto_total, moneda,
id_proveedor, id_sucursal, id_usuario) VALUES
('NC123', 'Compra de inventario 1', '11:00:30', 2000, 'USD', (Select id from
proveedor where nombre = 'Proveedor A'), (SELECT id FROM sucursal WHERE nombre =
'Octano Paurito'), (SELECT id FROM usuario WHERE ci = '1234567')),
('NC111', 'Compra de inventario 2', '14:24:12', 3000, 'USD', (Select id from
proveedor where nombre = 'Proveedor A'), (SELECT id FROM sucursal WHERE nombre =
'Octano Paurito'), (SELECT id FROM usuario WHERE ci = '1234567'));
SELECT * FROM nota_de_compra;
-- TABLA ORDEN_DE_COMPRA
INSERT INTO orden_de_compra (codigo, motivo, fecha, hora, estado, id_proveedor,
id_sucursal,id_nota_de_compra) VALUES
('OC456', 'Compra de productos','2025-02-10', '15:24:30', 'Pendiente', (Select id from
proveedor where nombre = 'Proveedor A'), (SELECT id FROM sucursal WHERE nombre =
'Octano Paurito'),(SELECT id FROM nota_de_compra WHERE codigo='NC123')),
('OC400', 'Compra de productos','2025-03-20', '09:01:10', 'Recibido', (Select id from
proveedor where nombre = 'Proveedor B'), (SELECT id FROM sucursal WHERE nombre =
'Octano Paurito'),(SELECT id FROM nota_de_compra WHERE codigo='NC123'));
SELECT * FROM orden_de_compra;
-- TABLA DETALLE_ORDEN_DE_COMPRA
INSERT INTO detalle_orden_compra (cantidad, id_producto, id_orden_de_compra) VALUES
(100, (Select id from producto where nombre = 'GNV'), (Select id from
orden_de_compra where codigo = 'OC456')),
(80, (Select id from producto where nombre = 'GNV'), (Select id from
orden_de_compra where codigo = 'OC400'));
SELECT * FROM detalle_orden_compra;
-- TABLA LOTE
INSERT INTO lote (codigo, fecha_vencimiento, detalle, stock, stock_inicial, esta_activo,
id_producto) VALUES
('LT001', '2025-10-01', 'Lote de Gas', 1200, 8000, true, (Select id from producto
where nombre = 'GNV')),
('LT002', '2025-05-20', 'Lote de Gas', 900, 7000, true, (Select id from producto
where nombre = 'GNV'));
SELECT * FROM lote;
-- TABLA DETALLE_COMPRA
INSERT INTO detalle_compra (cantidad, precio, subtotal, id_nota_de_compra, id_lote,
id_tanque) VALUES
(100, 1.0, 100, (Select id from nota_de_compra where codigo = 'NC123'), (Select id from lote
where codigo = 'LT001'), (Select id from tanque where nombre = 'Tanque 1')),
(200, 1.0, 200, (Select id from nota_de_compra where codigo = 'NC123'), (Select id from lote
where codigo = 'LT002'), (Select id from tanque where nombre = 'Tanque 2'));
SELECT * FROM detalle_compra;
-- TABLA NOTIFICACION_PRODUCTO
INSERT INTO notificacion_producto (titulo, descripcion, fecha, hora, id_producto, id_lote,
id_tanque) VALUES
('Reabastece tu GNV', 'GNV con stock minimo Tanque 1','2025-03-01','12:42:30',
(Select id from producto where nombre = 'GNV'), (Select id from lote where
codigo = 'LT001'), (Select id from tanque where nombre = 'Tanque 1')),
('Reabastece tu GNV', 'GNV con stock minimo Tanque 2','2025-03-15','15:00:30',
(Select id from producto where nombre = 'GNV'), (Select id from lote where
codigo = 'LT002'), (Select id from tanque where nombre = 'Tanque 2'));
SELECT * FROM notificacion_producto;
-- TABLA USUARIO_NOTIFICACION
INSERT INTO usuario_notificacion (visto, recordar, id_notificacion_producto, id_usuario)
VALUES
(false, true, (Select id from notificacion_producto where titulo = 'Reabastece tu GNV' and
descripcion = 'GNV con stock minimo Tanque 1'), (SELECT id FROM usuario WHERE ci =
'1234567')),
(false, true, (Select id from notificacion_producto where titulo = 'Reabastece tu GNV' and
descripcion = 'GNV con stock minimo Tanque 2'), (SELECT id FROM usuario WHERE ci =
'7654321'));
SELECT * FROM usuario_notificacion;
-- TABLA MANGUERA
INSERT INTO manguera (esta_activo, id_dispensador, id_combustible) VALUES
(true, (Select id from dispensador where ubicacion = 'Pista 1'), (SELECT id FROM
combustible WHERE tipo = 'Gas' and nombre = 'GNV')),
(false, (Select id from dispensador where ubicacion = 'Pista 2'), (SELECT id FROM
combustible WHERE tipo = 'Gas' and nombre = 'GNV'));
SELECT * FROM manguera;
-- TABLA CLIENTE
INSERT INTO cliente (nombre, nit, placa,b_sisa, cantidad_mensual_vendida, ultima_fecha,
id_sucursal) VALUES
('Juan Carlos Perez', '1234567890', 'ABC123',true, '200', '2025-02-13',(SELECT id FROM sucursal
WHERE nombre = 'Octano Paurito')),
('Juana Mariscal Torrez', '0987654321', 'DEF456',true, '100', '2025-02-17',(SELECT id FROM
sucursal WHERE nombre = 'Octano Sur'));
SELECT * FROM cliente;
-- TABLA NOTA_VENTA
INSERT INTO nota_venta (codigo, monto_pagado, monto_por_cobrar, monto_cambio,
hora,id_sucursal, id_usuario, id_dispensador, id_cliente) VALUES
('NV001', '200', 0, '0','16:46:42', (SELECT id FROM sucursal WHERE nombre =
'Octano Paurito'), (SELECT id FROM usuario WHERE ci = '1234567'), (Select id from
dispensador where ubicacion = 'Pista 1'), (Select id from cliente where placa = 'ABC123'));
SELECT * FROM nota_venta;
-- TABLA DETALLE_VENTA
INSERT INTO detalle_venta (cantidad, precio, subtotal, id_nota_venta, id_producto) VALUES
(100, 1.66, 166, (Select id from nota_venta where codigo = 'NV001'), (Select id from producto
where nombre = 'GNV')),
(80, 1.66, 132.8, (Select id from nota_venta where codigo = 'NV001'), (Select id from producto
where nombre = 'GNV'));
SELECT * FROM detalle_venta;


-- 1. Obtener el nombre y dirección de todas las sucursales activas.
SELECT nombre, direccion
FROM sucursal
WHERE esta_suspendido = false;
--2. Mostrar el precio de compra y venta de cada producto de combustible.
SELECT p.nombre AS producto, p.precio_compra, p.precio_venta
FROM producto p
JOIN categoria c ON p.id_categoria = c.id
WHERE c.nombre = 'Combustible';
-- 3. Obtener la cantidad disponible en stock de cada producto de combustible.
SELECT p.nombre AS producto, p.stock
FROM producto p
INNER JOIN categoria c ON p.id_categoria = c.id
WHERE c.nombre = 'Combustible';
-- 4. Obtener el total de ventas de cada usuario.
SELECT u.nombre AS usuario, SUM(dv.subtotal) AS total_ventas
FROM usuario u
LEFT JOIN nota_venta nv ON u.id = nv.id_usuario
LEFT JOIN detalle_venta dv ON nv.id = dv.id_nota_venta
GROUP BY u.nombre;
-- 5. Listar las órdenes de compra que aún no han sido recibidas por la sucursal.
SELECT *
FROM orden_de_compra
WHERE estado <> 'Recibido';
-- 6. Mostrar todos los usuarios con su sucursal asociada.
SELECT u.nombre AS usuario, s.nombre AS sucursal
FROM usuario u
JOIN sucursal s ON u.id_sucursal = s.id;
--7. Mostrar todos los roles con sus usuarios asignados.
SELECT r.nombre AS rol, u.nombre AS usuario
FROM rol r
JOIN usuario u ON r.id = u.id_rol;
--8. Obtener los detalles de todas las ventas realizadas por un usuario en específico
SELECT nv.id AS nota_venta_id,
nv.codigo AS codigo_nota_venta,
nv.fecha AS fecha_venta,
dv.cantidad AS cantidad_vendida,
dv.precio AS precio_unitario,
dv.subtotal AS subtotal_producto,
p.nombre AS nombre_producto
FROM nota_venta nv
JOIN detalle_venta dv ON nv.id = dv.id_nota_venta
JOIN producto p ON dv.id_producto = p.id
JOIN usuario u ON nv.id_usuario = u.id
WHERE u.id = (select id from usuario where nombre='María López');
-- 9. Mostrar todos los roles con sus usuarios asignados que sean mujeres.
SELECT r.nombre AS rol, u.nombre AS usuario
FROM rol r
LEFT JOIN usuario u ON r.id = u.id_rol
where u.sexo='F';
-- 10. Mostrar todos los descuentos activos con su monto y tipo.
SELECT nombre, tipo, monto,porcentaje
FROM descuento
WHERE esta_activo = true;
-- 11. Obtener todos los productos con su categoría
SELECT p.nombre AS producto, c.nombre AS categoria
FROM producto p
JOIN categoria c ON p.id_categoria = c.id;
-- 12. Mostrar todos los productos y su sucursal asociada
SELECT p.nombre AS producto, s.nombre AS sucursal
FROM producto p
JOIN sucursal s ON p.id_sucursal = s.id;
-- 13. Obtener todos los usuarios con su contacto.
SELECT nombre, telefono, correo
FROM usuario;
-- 14. Mostrar todas las ventas realizadas por el ususario María López.
SELECT DISTINCT nv.id AS id_venta,
nv.codigo AS codigo_venta,
nv.fecha AS fecha_venta,
c.nombre AS nombre_cliente,
c.nit,
c.placa,
dv.precio,
p.nombre AS nombre_producto
FROM nota_venta nv
INNER JOIN detalle_venta dv ON nv.id = dv.id_nota_venta
INNER JOIN producto p ON dv.id_producto = p.id
INNER JOIN cliente c ON nv.id_cliente = c.id
WHERE nv.id_usuario = (select id from usuario where nombre='María López');
-- 15. Listar todos los proveedores con sus productos y precios asociados
SELECT pr.nombre AS proveedor, pp.detalle AS detalle_producto, pp.ultimo_precio AS precio
FROM proveedor pr
JOIN proveedor_producto pp ON pr.id = pp.id_proveedor;
-- 16. Obtener todas las sucursales con la cantidad total de productos ofrecidos.
SELECT s.nombre AS sucursal, COUNT(p.id) AS cantidad_productos_ofrecidos
FROM sucursal s
JOIN producto p ON s.id = p.id_sucursal
GROUP BY s.nombre;
--17. Cuenta la cantidad de ventas por cada sucursal.
SELECT 
    s.nombre AS sucursal,
    COUNT(nv.id) AS total_transacciones,
    SUM(dv.subtotal) AS total_ingresos
FROM nota_venta nv
JOIN sucursal s ON nv.id_sucursal = s.id
JOIN detalle_venta dv ON nv.id = dv.id_nota_venta
GROUP BY s.nombre
ORDER BY total_ingresos DESC;
--18. Productos con stock bajo en cada sucursal
SELECT 
    s.nombre AS sucursal,
    p.nombre AS producto,
    p.stock,
    p.stock_minimo
FROM producto p
JOIN sucursal s ON p.id_sucursal = s.id
WHERE p.stock < p.stock_minimo
ORDER BY s.nombre, p.stock ASC;
--19. Lista los proveedores, los productos que venden y el último precio de compra registrado.
SELECT DISTINCT
    pr.nombre AS proveedor,
    p.nombre AS producto,
    pp.ultimo_precio
FROM proveedor_producto pp
JOIN proveedor pr ON pp.id_proveedor = pr.id
JOIN producto p ON pp.id_producto = p.id
ORDER BY pr.nombre, pp.ultimo_precio DESC;
--20. Clientes con más compras y su gasto total
SELECT 
    c.nombre AS cliente,
    c.nit,
    COUNT(nv.id) AS total_compras,
    SUM(dv.subtotal) AS total_gastado
FROM nota_venta nv
JOIN cliente c ON nv.id_cliente = c.id
JOIN detalle_venta dv ON nv.id = dv.id_nota_venta
GROUP BY c.id, c.nombre, c.nit
ORDER BY total_gastado DESC
LIMIT 5;

-----------------------------PROCEDIMIENTOS ALMACENADOS-------------------------------------------


--1. Procedimiento para agergar usuario
CREATE OR REPLACE PROCEDURE AgregarUsuario (
	IN ci VARCHAR(40),
	IN nombre VARCHAR(40),
	IN telefono VARCHAR(20),
	IN sexo CHAR(1),
	IN correo VARCHAR(30),
	IN domicilio VARCHAR(40),
	IN contraseña VARCHAR(20),
	IN id_sucursal UUID,
	IN id_rol UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO usuario (ci, nombre, telefono, sexo, correo, domicilio, contraseña, id_sucursal,
id_rol)
VALUES (ci, nombre, telefono, sexo, correo, domicilio, contraseña, id_sucursal, id_rol);
END;
$$;
--llamado
DO $$ 
DECLARE 
    v_id_sucursal UUID;
    v_id_rol UUID;
BEGIN
    -- Obtener ID de la sucursal
    SELECT id INTO v_id_sucursal FROM sucursal WHERE nombre = 'Octano Paurito';
    -- Obtener ID del rol
    SELECT id INTO v_id_rol FROM rol WHERE nombre = 'Administrador';
    CALL AgregarUsuario(
        '12445344',
        'josue',
        '76716672',
        'M',
        'josue@gmail.com',
        'Av. virgen de cotoca',
        'contra4321',
        v_id_sucursal,
        v_id_rol
    );
END $$;
SELECT * FROM usuario;

--2.PROCEDIMIENTO PARA ACTUALIZAR STOCK
CREATE OR REPLACE PROCEDURE ActualizarStockProducto(
    IN p_id_producto UUID,
	IN p_id_sucursal UUID,
    IN p_cantidad DECIMAL(7,2),
    IN p_operacion VARCHAR(10) -- Puede ser 'SUMAR' o 'RESTAR'
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verifica el tipo de operación y actualiza el stock
    IF p_operacion = 'SUMAR' THEN
        UPDATE producto 
        SET stock = stock + p_cantidad
        WHERE id = p_id_producto AND id_sucursal=p_id_sucursal;
    ELSIF p_operacion = 'RESTAR' THEN
        UPDATE producto 
        SET stock = stock - p_cantidad
        WHERE id = p_id_producto AND id_sucursal=p_id_sucursal AND stock >= p_cantidad;
    ELSE
        RAISE EXCEPTION 'Operación no válida. Use SUMAR o RESTAR.';
    END IF;
END;
$$;
--LLAMADO
DO $$ 
DECLARE 
    v_id_producto UUID;
	v_id_sucursal UUID;
BEGIN
    -- Obtener ID del producto
    SELECT id INTO v_id_producto FROM producto WHERE nombre = 'GNV' LIMIT 1;
	SELECT id INTO v_id_sucursal FROM sucursal WHERE nombre = 'Octano Sur';
    -- Llamar al procedimiento con los valores obtenidos
   CALL ActualizarStockProducto(v_id_producto,v_id_sucursal, 10.00, 'RESTAR');
END $$;
SELECT * FROM producto;
SELECT * FROM sucursal;
--3.procedimiento para registrar cliente
CREATE OR REPLACE PROCEDURE RegistrarCliente(
    IN p_nombre VARCHAR(40),
    IN p_nit VARCHAR(20),
    IN p_placa VARCHAR(10),
    IN p_id_sucursal UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insertar el nuevo cliente
    INSERT INTO cliente (id, nombre, nit, placa, cantidad_mensual_vendida, ultima_fecha, id_sucursal)
    VALUES (gen_random_uuid(), p_nombre, p_nit, p_placa, 0, CURRENT_DATE, p_id_sucursal);
END;
$$;
--llamado
DO $$ 
DECLARE 
	v_id_sucursal UUID;
BEGIN
    -- Obtener ID de la sucursal
	SELECT id INTO v_id_sucursal FROM sucursal WHERE nombre = 'Octano Sur';
    -- Llamar al procedimiento con los valores obtenidos
   CALL RegistrarCliente(
    'Juan',
    '2356729823',
    'BTX234',
    v_id_sucursal
    );
END $$;

SELECT * FROM cliente;

--4. Procedimiento para agregar una sucursal
CREATE OR REPLACE PROCEDURE AgregarSucursal(
    IN p_nombre VARCHAR(40),
    IN p_direccion VARCHAR(40),
    IN p_telefono VARCHAR(20),
    IN p_correo VARCHAR(30),
    IN p_esta_suspendido BOOLEAN,
    IN p_id_empresa UUID,
    IN p_id_descuento UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insertar nueva sucursal
    INSERT INTO sucursal (id, nombre, direccion, telefono, correo, esta_suspendido, id_empresa, id_descuento) 
    VALUES (gen_random_uuid(),p_nombre, p_direccion, p_telefono, p_correo,p_esta_suspendido, p_id_empresa,p_id_descuento);
END;
$$;
--LLamado
DO $$ 
DECLARE 
	v_id_empresa UUID;
	V_id_descuento UUID;
BEGIN
    -- Obtener ID de la sucursal
	SELECT id INTO v_id_empresa FROM empresa WHERE nombre = 'Octano Adm Ofice';
    SELECT id INTO V_id_descuento FROM descuento WHERE nombre = 'Descuento de Bienvenida';
    -- Llamar al procedimiento con los valores obtenidos
   CALL AgregarSucursal(
    'Sucursal Centro',
    'Av. Principal #123',
    '76543210',
    'centro@sucursal.com',
    FALSE,
    v_id_empresa,
    V_id_descuento
	);
END $$;

SELECT * FROM SUCURSAL;

--5. Procedimiento para Agregar descuento 
CREATE OR REPLACE PROCEDURE AgregarDescuento(
	IN p_nombre VARCHAR(40),
	IN p_descripcion VARCHAR(40),
	IN p_tipo VARCHAR(20),
	IN p_monto DECIMAL(7),
	IN p_porcentaje DECIMAL(5),	
	IN p_esta_activo BOOLEAN
	)
LANGUAGE plpgsql
AS $$
BEGIN
	-- Insertar nueva descuento
    INSERT INTO descuento (nombre, descripcion, tipo, monto, porcentaje, esta_activo)
 	VALUES (p_nombre, p_descripcion, p_tipo, p_monto, p_porcentaje, p_esta_activo);
END;
$$;
--LLamado
DO $$ 
BEGIN
    -- Llamar al procedimiento 
   CALL AgregarDescuento(
    'Descuento Recurrente2',
    'Descuento para temporadas altas',
    'fijo',
    '4',
    '0',
    TRUE
	);
END $$;
SELECT * FROM descuento;

--6. Eliminar usuario 
CREATE OR REPLACE PROCEDURE EliminarUsuario(
    IN p_ci VARCHAR(40) 
)
LANGUAGE plpgsql
AS $$  
BEGIN
    DELETE FROM usuario WHERE ci = p_ci;
END;
$$;

--lamada
DO $$ 
BEGIN
   CALL EliminarUsuario('12445344');
END $$;

SELECT * FROM USUARIO;
-----------------------------------------TRIGGERS---------------------------------------------------

--1.trigger para desactivar productos sin stock
CREATE OR REPLACE FUNCTION DesactivarProductoSinStock()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el stock llega al minimo o menos, desactivar el producto
    IF NEW.stock <= NEW.stock_minimo THEN
        NEW.esta_activo = FALSE;  
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TriggerDesactivarProductoSinStock
BEFORE UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION DesactivarProductoSinStock();

DROP TRIGGER IF EXISTS TriggerDesactivarProductoSinnStock ON producto;

--2.trigger para activar productos con stock
CREATE OR REPLACE FUNCTION ActivarProductoConStock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock > NEW.stock_minimo THEN
        NEW.esta_activo = TRUE;  
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TriggerActivarProductoConStock
BEFORE UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION ActivarProductoConStock();

DROP TRIGGER IF EXISTS TriggerActivarProductoConStock ON producto;

--3.trigger para disminuir stock al vender
CREATE OR REPLACE FUNCTION DisminuirStockVenta()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si hay suficiente stock antes de vender
    IF (SELECT stock FROM producto WHERE id = NEW.id_producto) < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para la venta del producto %', NEW.id_producto;
    END IF;
    UPDATE producto
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.id_producto;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TriggerDisminuirStockVenta
AFTER INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION DisminuirStockVenta();

--DROP TRIGGER IF EXISTS TriggerDisminuirStockVenta ON detalle_venta;

SELECT * FROM detalle_venta;

INSERT INTO detalle_venta (cantidad, precio, subtotal, id_nota_venta, id_producto) VALUES
(3000, 1.66, 6000, (Select id from nota_venta where codigo = 'NV001'), (Select id from producto
where nombre = 'GNV'));
SELECT * FROM producto;

-- 4. Trigger para actualizar el stock cuando se realiza una compra
CREATE OR REPLACE FUNCTION ActualizarStockCompra()
RETURNS TRIGGER AS $$
DECLARE
    v_id_producto UUID;
BEGIN
    -- Obtener el id_producto desde la tabla lote
    SELECT id_producto INTO v_id_producto
    FROM lote
    WHERE id = NEW.id_lote;
    -- Verificar que el producto existe 
    IF v_id_producto IS NOT NULL THEN
        UPDATE producto
        SET stock = stock + NEW.cantidad
        WHERE id = v_id_producto;
    ELSE
        RAISE EXCEPTION 'No se encontró el producto asociado al lote %', NEW.id_lote;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TriggerActualizarStockCompra
AFTER INSERT ON detalle_compra
FOR EACH ROW
EXECUTE FUNCTION ActualizarStockCompra();

--DROP TRIGGER IF EXISTS TriggerActualizarStockCompra ON detalle_compra;

SELECT * FROM detalle_compra;

INSERT INTO detalle_compra (cantidad, precio, subtotal, id_nota_de_compra, id_lote,
id_tanque) VALUES
(3000, 1.0, 3000, (Select id from nota_de_compra where codigo = 'NC123'), (Select id from lote
where codigo = 'LT001'), (Select id from tanque where nombre = 'Tanque 1'));
SELECT * FROM producto;





