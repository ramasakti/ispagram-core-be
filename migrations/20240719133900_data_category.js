/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('data_category', function (table) {
        table.increments('id').primary();
        table.integer('blog_id').unsigned().nullable();
        table.integer('category_id').unsigned().nullable();

        table.foreign('blog_id').references('id_blog').inTable('blog').onDelete('cascade').onUpdate('cascade');
        table.foreign('category_id').references('id_category').inTable('master_category').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('data_category');
};
