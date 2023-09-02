import { Database } from "../src/database.mjs";
import { DatabaseError } from "../src/database-error.mjs";

// Tests that execute method throws a DatabaseError for an invalid statement
it("should throw a DatabaseError for an invalid statement", async () => {
  const database = new Database();
  const statement = "invalid statement";
  try {
    await database.execute(statement);
  } catch (error) {
    expect(error.message).toEqual("Syntax error: invalid statement")
  }
});

// Tests that the create table statement creates a new table with columns and no data
it("should create a new table with columns and no data", async () => {
  const database = new Database();
  const statement = "create table users (id int, name varchar)";
  await database.execute(statement);
  expect(database.tables.users).toEqual({
    columns: { id: "int", name: "varchar" },
    data: [],
  });
});

// Tests that the method can insert a single row with all columns specified
it("should insert a single row with all columns specified", async () => {
  const database = new Database();
  await database.execute(
    "create table test (column1 type1, column2 type2, column3 type3)"
  );
  await database.execute(
    "insert into test (column1, column2, column3) values (value1, value2, value3)"
  );

  expect(database.tables["test"].data).toEqual([
    { column1: "value1", column2: "value2", column3: "value3" },
  ]);
});
// Tests that the method can insert wrong values
it("should throw an error if length of columns is wrong", async () => {
  const database = new Database();
  await database.execute(
    "create table test (column1 type1, column2 type2, column3 type3)"
  );

  const wrongStatement =
    "insert into test (column1) values (value1, value2)";

  try {
    await database.execute(wrongStatement)
  } catch (error) {
    expect(error.message).toEqual("Column count does not match value count");
    
  }

});

// Tests that the select method returns all columns and rows when no 'where' condition is provided
it("should return all columns and rows when no 'where' condition is provided", async () => {
  // Arrange
  const database = new Database();
  await database.execute("create table table1 (col1 type1, col2 type2, col3 type3)");
  await database.execute(
    "insert into table1 (col1, col2, col3) values (value1, value2, value3)"
  );
  await database.execute(
    "insert into table1 (col1, col2, col3) values (value4, value5, value6)"
  );
  const data = [
    { col1: "value1", col2: "value2", col3: "value3" },
    { col1: "value4", col2: "value5", col3: "value6" },
  ];

  // Act
  const statement = "select col1, col2, col3 from table1";
  const result = await database.execute(statement);

  // Assert
  expect(result).toEqual(data);
});
// Tests that the select method returns all columns and rows when no 'where' condition is provided
it("should return some columns and rows when 'where' condition is provided", async () => {
  // Arrange
  const database = new Database();
  await database.execute("create table table1 (col1 type1, col2 type2, col3 type3)");
  await database.execute(
    "insert into table1 (col1, col2, col3) values (value1, value2, value3)"
  );
  await database.execute(
    "insert into table1 (col1, col2, col3) values (value4, value5, value6)"
  );
  const data = [{ col1: "value4", col2: "value5" }];

  // Act
  const statement = "select col1, col2 from table1 where col2 = value5";
  const result = await database.execute(statement);

  // Assert
  expect(result).toEqual(data);
});

// Tests that the method deletes a single row with a matching value in a single column
it("should delete a single row with a matching value in a single column", () => {
  const database = new Database();
  database.tables = {
    table1: {
      columns: {
        id: "number",
        name: "string",
      },
      data: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ],
    },
  };
  database.delete(["delete", "table1", "id = 2"]);
  const result = JSON.stringify(database.tables.table1.data);
  const data = JSON.stringify([
    { id: 1, name: "John" },
    { id: 3, name: "Bob" },
  ]);
  expect(result).toEqual(data);
});
