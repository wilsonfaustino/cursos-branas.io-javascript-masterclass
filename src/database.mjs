import { DatabaseError } from "./database-error.mjs";
import { Parser } from "./parser.mjs";

export class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }
  create(parsedStatement) {
    const [_, tableName, list] = parsedStatement;
    const columns = list.split(",").map((item) => item.trim());
    this.tables[tableName] = {
      columns: {},
      data: [],
    };
    for (const col of columns) {
      const [key, value] = col.split(" ");
      this.tables[tableName].columns[key] = value;
    }
  }
  insert(parsedStatement) {
    let [statement, tableName, columns, values] = parsedStatement;
    columns = columns.split(",").map((item) => item.trim());
    values = values.split(",").map((item) => item.trim());
    if (columns.length < values.length) {
      throw new DatabaseError(
        statement,
        "Column count does not match value count"
      );
    }
    const data = columns.reduce((acc, el, i) => {
      acc[el] = values[i];
      return acc;
    }, {});

    this.tables[tableName].data.push(data);
  }
  select(parsedStatement) {
    let [statement, columns, tableName, condition] = parsedStatement;
    columns = columns.split(",").map((col) => col.trim());
    let rows = this.tables[tableName].data;
    if (!statement.includes("where")) {
      rows = rows.map((row) => {
        return columns.reduce((acc, col) => {
          acc[col] = row[col];
          return acc;
        }, {});
      });
      return rows;
    }
    const [col, val] = condition.split("=").map((c) => c.trim());
    rows = rows
      .filter((row) => row[col] === val)
      .map((row) =>
        columns.reduce((acc, col) => {
          acc[col] = row[col];
          return acc;
        }, {})
      );
    return rows;
  }
  delete(parsedStatement) {
    let [_, tableName, condition] = parsedStatement;
    let [column, value] = condition.split("=").map((c) => c.trim());
    let rows = this.tables[tableName].data;
    rows = rows.filter((row) => row[column] != value);
    this.tables[tableName].data = rows;
  }
  execute(statement) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.parser.parse(statement);
        if (!result) {
          const message = `Syntax error: ${statement}`;
          reject(new DatabaseError(statement, message));
          return
        }
        resolve(this[result.command](result.parsedStatement));
      }, 100);
    });
  }
}
