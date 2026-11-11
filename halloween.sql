CREATE DATABASE IF NOT EXISTS halloween CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE halloween;

CREATE TABLE disfraces (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  votos INT(11) NOT NULL DEFAULT 0,
  foto VARCHAR(255) NOT NULL DEFAULT '',
  foto_blob BLOB NULL,
  eliminado INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  clave TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE votos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  id_usuario INT(11) NOT NULL,
  id_disfraz INT(11) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_voto (id_usuario, id_disfraz),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_disfraz) REFERENCES disfraces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin por defecto: usuario=admin / clave=admin123
-- (hash generado con password_hash('admin123', PASSWORD_BCRYPT))
INSERT INTO usuarios (nombre, clave, rol) VALUES
('admin', '$2y$10$uNZxVgbnKycNoOpSlwY0bud8yGqZnAHHBYSowepdHcAT7ybDaCICm', 'admin');