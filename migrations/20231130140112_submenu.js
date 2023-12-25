/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('submenu', function (table) {
        table.increments('id_submenu').primary();
        table.string('name');
        table.string('route');
        table.integer('menu_id').unsigned();
        table.integer('order');
        table.foreign('menu_id').references('id_menu').inTable('menu').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('submenu');
};
