/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('transaksi', function (table) {
        table.increments('id_transaksi');
        table.text('kwitansi');
        table.datetime('waktu_transaksi');
        table.string('siswa_id');
        table.integer('pembayaran_id').unsigned();
        table.integer('terbayar');
        table.string('metode');
        table.string('token');
        table.timestamps(true, true);

        table.foreign('pembayaran_id').references('id_pembayaran').inTable('pembayaran').onDelete('cascade').onUpdate('cascade');
        table.foreign('siswa_id').references('id_siswa').inTable('detail_siswa').onDelete('cascade').onUpdate('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('transaksi');
};
