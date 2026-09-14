from database import get_connection

connection = get_connection()

connection.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
)
""")

connection.commit()
connection.close()

print("Database created")