/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('chat', function (table) {
        table.increments('id_chat').primary();
        table.string('from');
        table.string('to');
        table.text('message')
        table.datetime('waktu');
        table.foreign('from').references('username').inTable('users').onDelete('cascade').onUpdate('cascade');
        table.foreign('to').references('username').inTable('users').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('chat');
};
