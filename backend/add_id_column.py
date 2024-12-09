import sqlite3
from database.sqlite_connection import get_sqlite_connection


def add_id_column():
    conn = get_sqlite_connection()
    cursor = conn.cursor()

    try:
        # 1. Renombrar la tabla actual
        cursor.execute("ALTER TABLE folios RENAME TO folios_temp")

        # 2. Crear nueva tabla con ID
        cursor.execute(
            """
            CREATE TABLE folios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                folioPedido TEXT,
                cantidadPedida INTEGER,
                cantidadVerificada INTEGER,
                existencia INTEGER,
                localizacion TEXT,
                descripcion_producto TEXT,
                codigoFamiliaUno TEXT,
                descripcion_laboratorio TEXT,
                descripcion_clasificacion TEXT,
                descripcion_presentacion TEXT,
                codigoRelacionado TEXT,
                alias TEXT
            )
        """
        )

        # 3. Copiar datos de la tabla temporal a la nueva
        cursor.execute(
            """
            INSERT INTO folios (
                folioPedido, cantidadPedida, cantidadVerificada, 
                existencia, localizacion, descripcion_producto,
                codigoFamiliaUno, descripcion_laboratorio,
                descripcion_clasificacion, descripcion_presentacion,
                codigoRelacionado, alias
            )
            SELECT 
                folioPedido, cantidadPedida, cantidadVerificada,
                existencia, localizacion, descripcion_producto,
                codigoFamiliaUno, descripcion_laboratorio,
                descripcion_clasificacion, descripcion_presentacion,
                codigoRelacionado, alias
            FROM folios_temp
        """
        )

        # 4. Eliminar tabla temporal
        cursor.execute("DROP TABLE folios_temp")

        conn.commit()
        print("Columna ID agregada exitosamente")

    except sqlite3.Error as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    add_id_column()
