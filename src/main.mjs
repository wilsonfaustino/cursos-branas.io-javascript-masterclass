import { Database } from "./database.mjs";

const buildDatabase = async () => {
  try {
    const database = new Database();

    await database.execute("create table users (id int, name varchar)");
    await Promise.all([
      database.execute("insert into users (id, name) values (1, Wilson)"),
      database.execute("insert into users (id, name) values (2, Erica)"),
      database.execute("insert into users (id, name) values (3, Luiza)"),
    ]);
    const result = await database.execute("select id, name from users");
    console.log(result);
    await database.execute("delete from users where id = 1");

    console.log(JSON.stringify(database, null, 2));
  } catch (error) {
    console.log(error.message);
  }
};
buildDatabase();
