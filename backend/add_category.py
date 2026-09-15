from database import get_connection

connection = get_connection()

connection.execute(
    "ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT 'General'"
)

connection.commit()
connection.close()

print("Category column added")