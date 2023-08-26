/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('user', function (table) {
        table.string('username').primary();
        table.text('password');
        table.string('name');
        table.string('email').nullable();
        table.text('avatar', 'longtext').nullable();
        table.string('role');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user')
};
