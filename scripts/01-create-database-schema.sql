-- Sistema de Inspección Vehicular HQ-FO-40
-- Base de datos PostgreSQL para SAS Servicios Asociados

-- Tabla principal de inspecciones
CREATE TABLE IF NOT EXISTS inspecciones (
    id SERIAL PRIMARY KEY,
    marca_temporal TIMESTAMP NOT NULL,
    conductor_nombre VARCHAR(255) NOT NULL,
    contrato VARCHAR(255),
    campo_coordinacion VARCHAR(255),
    placa_vehiculo VARCHAR(20) NOT NULL,
    kilometraje INTEGER,
    turno VARCHAR(50),
    observaciones TEXT,
    mes_datos INTEGER NOT NULL,
    año_datos INTEGER NOT NULL,
    hash_unico VARCHAR(64) UNIQUE NOT NULL, -- Para anti-duplicados
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de elementos de inspección (40+ elementos del Excel)
CREATE TABLE IF NOT EXISTS elementos_inspeccion (
    id SERIAL PRIMARY KEY,
    inspeccion_id INTEGER REFERENCES inspecciones(id) ON DELETE CASCADE,
    elemento VARCHAR(255) NOT NULL,
    cumple BOOLEAN NOT NULL,
    es_critico BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de control de fatiga (4 preguntas específicas)
CREATE TABLE IF NOT EXISTS control_fatiga (
    id SERIAL PRIMARY KEY,
    inspeccion_id INTEGER REFERENCES inspecciones(id) ON DELETE CASCADE,
    dormido_7_horas BOOLEAN NOT NULL,
    libre_fatiga BOOLEAN NOT NULL,
    condiciones_conducir BOOLEAN NOT NULL,
    medicamentos_alerta BOOLEAN NOT NULL,
    score_fatiga INTEGER DEFAULT 0, -- 0-4 calculado automáticamente
    estado_fatiga VARCHAR(20) DEFAULT 'verde', -- verde/amarillo/rojo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de resumen por conductor (calculada)
CREATE TABLE IF NOT EXISTS conductores_estado (
    id SERIAL PRIMARY KEY,
    conductor_nombre VARCHAR(255) UNIQUE NOT NULL,
    ultima_inspeccion TIMESTAMP,
    dias_sin_inspeccion INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'verde', -- verde/amarillo/rojo
    total_inspecciones INTEGER DEFAULT 0,
    placa_asignada VARCHAR(20),
    campo_coordinacion VARCHAR(255),
    contrato VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de resumen por vehículo (calculada)
CREATE TABLE IF NOT EXISTS vehiculos_estado (
    id SERIAL PRIMARY KEY,
    placa_vehiculo VARCHAR(20) UNIQUE NOT NULL,
    ultima_inspeccion TIMESTAMP,
    ultimo_conductor VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'verde', -- verde/amarillo/naranja/rojo
    fallas_criticas INTEGER DEFAULT 0,
    fallas_menores INTEGER DEFAULT 0,
    total_inspecciones INTEGER DEFAULT 0,
    observaciones_recientes TEXT,
    campo_coordinacion VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fallas categorizadas (análisis del campo OBSERVACIONES)
CREATE TABLE IF NOT EXISTS fallas_categorizadas (
    id SERIAL PRIMARY KEY,
    inspeccion_id INTEGER REFERENCES inspecciones(id) ON DELETE CASCADE,
    categoria VARCHAR(100), -- mecanica, electrica, seguridad, etc.
    severidad VARCHAR(20), -- menor, critica, urgente
    descripcion TEXT,
    solucionado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'consulta', -- admin, supervisor, consulta
    nombre_completo VARCHAR(255),
    email VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabla de log de actividades
CREATE TABLE IF NOT EXISTS log_actividades (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    accion VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_inspeccion_fecha ON inspecciones(marca_temporal, mes_datos, año_datos);
CREATE INDEX IF NOT EXISTS idx_conductor ON inspecciones(conductor_nombre);
CREATE INDEX IF NOT EXISTS idx_placa ON inspecciones(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_hash ON inspecciones(hash_unico);
CREATE INDEX IF NOT EXISTS idx_elementos_inspeccion ON elementos_inspeccion(inspeccion_id, elemento);
CREATE INDEX IF NOT EXISTS idx_fatiga_inspeccion ON control_fatiga(inspeccion_id);
CREATE INDEX IF NOT EXISTS idx_conductores_estado ON conductores_estado(estado, dias_sin_inspeccion);
CREATE INDEX IF NOT EXISTS idx_vehiculos_estado ON vehiculos_estado(estado, fallas_criticas);

-- Función para calcular hash único (anti-duplicados)
CREATE OR REPLACE FUNCTION calcular_hash_inspeccion(
    p_marca_temporal TIMESTAMP,
    p_conductor VARCHAR,
    p_placa VARCHAR,
    p_kilometraje INTEGER
) RETURNS VARCHAR AS $$
BEGIN
    RETURN MD5(
        CONCAT(
            p_marca_temporal::TEXT,
            UPPER(TRIM(p_conductor)),
            UPPER(TRIM(p_placa)),
            COALESCE(p_kilometraje, 0)::TEXT
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estado de conductores
CREATE OR REPLACE FUNCTION actualizar_estado_conductores() RETURNS VOID AS $$
BEGIN
    INSERT INTO conductores_estado (
        conductor_nombre, 
        ultima_inspeccion, 
        dias_sin_inspeccion, 
        estado,
        total_inspecciones,
        placa_asignada,
        campo_coordinacion,
        contrato
    )
    SELECT 
        i.conductor_nombre,
        MAX(i.marca_temporal) as ultima_inspeccion,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - MAX(i.marca_temporal))) as dias_sin_inspeccion,
        CASE 
            WHEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - MAX(i.marca_temporal))) <= 5 THEN 'verde'
            WHEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - MAX(i.marca_temporal))) <= 10 THEN 'amarillo'
            ELSE 'rojo'
        END as estado,
        COUNT(*) as total_inspecciones,
        (SELECT placa_vehiculo FROM inspecciones WHERE conductor_nombre = i.conductor_nombre ORDER BY marca_temporal DESC LIMIT 1) as placa_asignada,
        (SELECT campo_coordinacion FROM inspecciones WHERE conductor_nombre = i.conductor_nombre ORDER BY marca_temporal DESC LIMIT 1) as campo_coordinacion,
        (SELECT contrato FROM inspecciones WHERE conductor_nombre = i.conductor_nombre ORDER BY marca_temporal DESC LIMIT 1) as contrato
    FROM inspecciones i
    GROUP BY i.conductor_nombre
    ON CONFLICT (conductor_nombre) DO UPDATE SET
        ultima_inspeccion = EXCLUDED.ultima_inspeccion,
        dias_sin_inspeccion = EXCLUDED.dias_sin_inspeccion,
        estado = EXCLUDED.estado,
        total_inspecciones = EXCLUDED.total_inspecciones,
        placa_asignada = EXCLUDED.placa_asignada,
        campo_coordinacion = EXCLUDED.campo_coordinacion,
        contrato = EXCLUDED.contrato,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estado de vehículos
CREATE OR REPLACE FUNCTION actualizar_estado_vehiculos() RETURNS VOID AS $$
BEGIN
    INSERT INTO vehiculos_estado (
        placa_vehiculo,
        ultima_inspeccion,
        ultimo_conductor,
        estado,
        fallas_criticas,
        fallas_menores,
        total_inspecciones,
        observaciones_recientes,
        campo_coordinacion
    )
    SELECT 
        i.placa_vehiculo,
        MAX(i.marca_temporal) as ultima_inspeccion,
        (SELECT conductor_nombre FROM inspecciones WHERE placa_vehiculo = i.placa_vehiculo ORDER BY marca_temporal DESC LIMIT 1) as ultimo_conductor,
        CASE 
            WHEN COUNT(CASE WHEN ei.cumple = FALSE AND ei.es_critico = TRUE THEN 1 END) = 0 
                 AND (SELECT observaciones FROM inspecciones WHERE placa_vehiculo = i.placa_vehiculo ORDER BY marca_temporal DESC LIMIT 1) IS NULL 
                 THEN 'verde'
            WHEN COUNT(CASE WHEN ei.cumple = FALSE AND ei.es_critico = TRUE THEN 1 END) = 0 THEN 'amarillo'
            WHEN COUNT(CASE WHEN ei.cumple = FALSE AND ei.es_critico = TRUE THEN 1 END) <= 2 THEN 'naranja'
            ELSE 'rojo'
        END as estado,
        COUNT(CASE WHEN ei.cumple = FALSE AND ei.es_critico = TRUE THEN 1 END) as fallas_criticas,
        COUNT(CASE WHEN ei.cumple = FALSE AND ei.es_critico = FALSE THEN 1 END) as fallas_menores,
        COUNT(DISTINCT i.id) as total_inspecciones,
        (SELECT observaciones FROM inspecciones WHERE placa_vehiculo = i.placa_vehiculo ORDER BY marca_temporal DESC LIMIT 1) as observaciones_recientes,
        (SELECT campo_coordinacion FROM inspecciones WHERE placa_vehiculo = i.placa_vehiculo ORDER BY marca_temporal DESC LIMIT 1) as campo_coordinacion
    FROM inspecciones i
    LEFT JOIN elementos_inspeccion ei ON i.id = ei.inspeccion_id
    GROUP BY i.placa_vehiculo
    ON CONFLICT (placa_vehiculo) DO UPDATE SET
        ultima_inspeccion = EXCLUDED.ultima_inspeccion,
        ultimo_conductor = EXCLUDED.ultimo_conductor,
        estado = EXCLUDED.estado,
        fallas_criticas = EXCLUDED.fallas_criticas,
        fallas_menores = EXCLUDED.fallas_menores,
        total_inspecciones = EXCLUDED.total_inspecciones,
        observaciones_recientes = EXCLUDED.observaciones_recientes,
        campo_coordinacion = EXCLUDED.campo_coordinacion,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (username, password_hash, rol, nombre_completo, email) 
VALUES ('admin', '$2b$10$rGKqDxhkeXFNShH.hl/.OOEFwxiDIr6YimhqB0W0E8HGPdHWDvyNu', 'admin', 'Administrador SAS', 'admin@sas.com')
ON CONFLICT (username) DO NOTHING;

-- Comentarios en las tablas
COMMENT ON TABLE inspecciones IS 'Tabla principal con todas las inspecciones vehiculares del formato HQ-FO-40';
COMMENT ON TABLE elementos_inspeccion IS 'Detalle de los 40+ elementos inspeccionados por cada inspección';
COMMENT ON TABLE control_fatiga IS 'Respuestas a las 4 preguntas de control de fatiga del conductor';
COMMENT ON TABLE conductores_estado IS 'Resumen calculado del estado actual de cada conductor';
COMMENT ON TABLE vehiculos_estado IS 'Resumen calculado del estado actual de cada vehículo';
COMMENT ON TABLE fallas_categorizadas IS 'Análisis categorizado de las fallas encontradas en observaciones';
