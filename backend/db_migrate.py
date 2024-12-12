import pandas as pd
from database.mssql_connection import get_mssql_connection
from database.sqlite_connection import get_sqlite_connection


def migrate_data():
    try:
        # Obtener datos del SQL Server
        mssql_conn = get_mssql_connection()
        query = """SELECT 
            folioPedido, cantidadPedida, cantidadVerificada,
            existencia, localizacion, descripcion_producto,
            codigoFamiliaUno, descripcion_laboratorio,
            descripcion_clasificacion, descripcion_presentacion,
            codigoRelacionado
        FROM vista_folios"""
        new_data = pd.read_sql(query, mssql_conn)
        mssql_conn.close()

        # Conectar a SQLite
        sqlite_conn = get_sqlite_connection()

        # Obtener registros existentes en SQLite
        existing_data = pd.read_sql("SELECT * FROM folios", sqlite_conn)

        # Crear una clave compuesta para comparación
        def create_composite_key(row):
            return f"{row['folioPedido']}_{row['cantidadPedida']}_{row['cantidadVerificada']}_\
                    {row['existencia']}_{row['localizacion']}_{row['codigoRelacionado']}"

        # Crear claves compuestas para ambos conjuntos de datos
        existing_keys = set(existing_data.apply(create_composite_key, axis=1))
        new_keys = new_data.apply(create_composite_key, axis=1)

        # Filtrar solo los registros realmente nuevos
        mask = ~new_keys.isin(existing_keys)
        records_to_insert = new_data[mask]

        if len(records_to_insert) > 0:
            # Insertar solo los nuevos registros
            records_to_insert.to_sql(
                "folios", sqlite_conn, if_exists="append", index=False
            )
            print(f"Se agregaron {len(records_to_insert)} nuevos registros")
        else:
            print("No hay nuevos registros para agregar")

        sqlite_conn.close()
        return True, "Sincronización completada exitosamente"

    except Exception as e:
        return False, f"Error durante la sincronización: {str(e)}"


if __name__ == "__main__":
    migrate_data()
