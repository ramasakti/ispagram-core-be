// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME ?? 'root',
            password: process.env.DB_PASSWORD ?? 'root',
            database: process.env.DB_PROD ?? 'smas5845_ispagram',
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	staging: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_PROD,
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'mysql2',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_PROD,
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};
