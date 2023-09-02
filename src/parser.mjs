export class Parser {
  constructor() {
    this.commands = new Map();
    this.commands.set("create", /create table\s([a-z0-9]+)\s\((.+)\)/);
    this.commands.set(
      "insert",
      /insert into ([a-z0-9]+) \(([a-z0-9\s,]+)\) values \(([a-zA-Z0-9\s,]+)\)/
    );
    this.commands.set(
      "select",
      /select ([a-z0-9 ,*]+) from ([a-z0-9]+)(?: where ([a-z0-9\s=]+))?/
    );
    this.commands.set("delete", /delete from ([a-z0-9]+)(?: where ([a-z0-9\s=]+))?/);
  }
  parse(statement) {
    for (let [command, pattern] of this.commands) {
      const parsedStatement = statement.match(pattern);
      if (parsedStatement) {
        return {
          command,
          parsedStatement,
        };
      }
    }
  }
}
