/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('detail_guru', function (table) {
        table.string('guru_id').primary();
        table.json('pendidikan').nullable();
        table.string('sk_pengangkatan').nullable();
        table.string('nik').nullable();
        table.string('no_kk').nullable();
        table.text('scan_kk', 'longtext').nullable();
        table.string('bank').nullable();
        table.string('norek').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('detail_guru');
};
