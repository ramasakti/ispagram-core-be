const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: process.env.DB_USERNAME ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? 'parlaungan'
    }
});

module.exports = db