/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('menu', function (table) {
        table.increments('id_menu').primary();
        table.tinyint('type');
        table.string('name');
        table.string('route').nullable();
        table.integer('section_id').unsigned().nullable();
        table.integer('order');
        table.foreign('section_id').references('id_section').inTable('section').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('menu');
};
