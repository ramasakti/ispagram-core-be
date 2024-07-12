/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('blog', function (table) {
        table.increments('id_blog').primary();
        table.string('slug');
        table.text('banner', 'longtext');
        table.string('title');
        table.string('description');
        table.text('content');
        table.string('uploader');
        table.timestamps(true, true);

        table.foreign('uploader').references('username').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('blog');
};
