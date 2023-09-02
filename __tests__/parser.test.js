import { Parser } from "../src/parser.mjs";
// Tests that the Parser can parse a 'create table' statement
it("should parse a 'create table' statement correctly", () => {
  const parser = new Parser();
  const statement = "create table users (id int, name string)";
  const result = parser.parse(statement);
  expect(JSON.stringify(result)).toEqual(
    JSON.stringify({
      command: "create",
      parsedStatement: [
        "create table users (id int, name string)",
        "users",
        "id int, name string",
      ],
    })
  );
});
// Tests that the Parser can parse a 'insert' statement
it("should parse a 'insert' statement correctly", () => {
  const parser = new Parser();
  const statement =
    "insert into users (id, name, age) values (1, Wilson Faustino, 46)";
  const result = parser.parse(statement);
  expect(JSON.stringify(result)).toEqual(
    JSON.stringify({
      command: "insert",
      parsedStatement: [
        "insert into users (id, name, age) values (1, Wilson Faustino, 46)",
        "users",
        "id, name, age",
        "1, Wilson Faustino, 46",
      ],
    })
  );
});
// Tests that the Parser can parse a 'select' statement
it("should parse a 'select' statement correctly", () => {
  const parser = new Parser();
  const statement = "select name, age from author where id = 1";
  const result = parser.parse(statement);
  expect(JSON.stringify(result)).toEqual(
    JSON.stringify({
      command: "select",
      parsedStatement: [
        "select name, age from author where id = 1",
        "name, age",
        "author",
        "id = 1",
      ],
    })
  );
});
// Tests that the Parser can parse a 'delete' statement
it("should parse a 'delete' statement correctly", () => {
  const parser = new Parser();
  const statement =
    "delete from author where id = 2";
  const result = parser.parse(statement);
  expect(JSON.stringify(result)).toEqual(
    JSON.stringify({
      command: "delete",
      parsedStatement: [
        "delete from author where id = 2",
        "author",
        "id = 2",
      ],
    })
  );
});
