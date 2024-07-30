// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: 'mysql',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME ?? 'root',
			password: process.env.DB_PASSWORD ?? 'root',
			database: process.env.DB_NAME ?? 'parlaungan'
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	staging: {
		client: 'mysql',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME ?? 'root',
			password: process.env.DB_PASSWORD ?? 'root',
			database: process.env.DB_NAME ?? 'parlaungan'
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'mysql',
		connection: {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USERNAME ?? 'root',
			password: process.env.DB_PASSWORD ?? 'root',
			database: process.env.DB_NAME ?? 'parlaungan'
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};
