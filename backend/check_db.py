import sqlite3
from database.sqlite_connection import get_sqlite_connection


def check_database():
    conn = get_sqlite_connection()
    cursor = conn.cursor()

    # Verificar estructura de la tabla
    cursor.execute("PRAGMA table_info(folios)")
    columns = cursor.fetchall()
    print("\nEstructura de la tabla:")
    for col in columns:
        print(col)

    # Verificar un registro específico
    cursor.execute("SELECT * FROM folios WHERE id = 1")
    row = cursor.fetchone()
    print("\nRegistro con ID 1:")
    print(row)

    conn.close()


if __name__ == "__main__":
    check_database()
