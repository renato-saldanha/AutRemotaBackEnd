const knexFirebirdDialect = require("knex-firebird-dialect").default;

module.exports = {
  client: knexFirebirdDialect,
  connection: {
    host: "10.1.11.77",
    port: 3050,
    user: "SYSDBA",
    password: "vectordba",
    database: "C:/FDB/DENTALPRADO.fdb",
    schemaName: "Denta_Prado",
    lowercase_keys: true,
  },
  createDatabaseIfNoExists: true,
  debug: false,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
