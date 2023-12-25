// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'smas5845_admin',
      password: '',
      database: 'smas5845_ispagram'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'smas5845_admin',
      password: '',
      database: 'smas5845_ispagram'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'smas5845_admin',
      password: '',
      database: 'smas5845_ispagram'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
