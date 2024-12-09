import pandas as pd
from database.mssql_connection import get_mssql_connection
from database.sqlite_connection import get_sqlite_connection


def migrate_data():
    # Conectar a MSSQL
    mssql_conn = get_mssql_connection()
    query = """select vp.*,
        c.alias,
        p.descripcion as descripcion_producto,
        p.codigoFamiliaUno, 
        e.existencia,
        e.localizacion, 
        l.descripcion as descripcion_laboratorio,
        cl.descripcion as descripcion_clasificacion,
        pr.descripcion as descripcion_presentacion
    from venPedidosDet vp
    inner join genProductosCat p on vp.codigoProducto = p.codigoProducto
    inner join invControlExistenciasReg e on vp.codigoProducto = e.codigoProducto
    inner join genLaboratoriosCat l on p.codigoLaboratorio = l.codigoLaboratorio
    inner join genClasificacionesSsaCat cl on p.codigoClasificacionUno = cl.codigoClasificacionUno 
        and p.codigoClasificacionDos = cl.codigoClasificacionDos
    inner join imePresentacionesCat pr on p.codigoPresentacion = pr.codigoPresentacion
    inner join cxcClientesCat c on vp.codigoCliente = c.codigoCliente"""

    data = pd.read_sql(query, mssql_conn)
    mssql_conn.close()

    # Conectar a SQLite y Migrar Datos
    sqlite_conn = get_sqlite_connection()
    data.to_sql("folios", sqlite_conn, if_exists="append", index=True, index_label="id")
    sqlite_conn.close()
    print("Migración completada.")


if __name__ == "__main__":
    migrate_data()
