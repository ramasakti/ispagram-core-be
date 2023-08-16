const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'laravel'
    }
});

module.exports = db