from database import get_connection

connection = get_connection()

connection.execute(
    "ALTER TABLE tasks ADD COLUMN due_date TEXT"
)

connection.commit()
connection.close()

print("Due date column added")