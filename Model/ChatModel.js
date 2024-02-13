const db = require('../Config')

const getAllChatByUser = (username) => {
    return db('chat')
        .select('chat.*', db.raw('CASE WHEN guru.id_guru IS NOT NULL THEN guru.nama_guru ELSE siswa.nama_siswa END AS receiver'))
        .join('users', 'users.username', '=', 'chat.to')
        .leftJoin('guru', 'guru.id_guru', '=', 'users.username')
        .leftJoin('siswa', 'siswa.id_siswa', '=', 'users.username')
        .whereIn('chat.id_chat', function () {
            this.select(db.raw('MIN(id_chat)'))
                .from('chat')
                .groupBy('to');
        })
        .whereNotNull('guru.id_guru', 'siswa.id_siswa')
        .where('from', username)
        .orderBy('waktu', 'desc');
}

const getChatBySenderAndReceiver = (sender, receiver) => {
    return db('chat')
        .where('from', sender)
        .where('to', receiver)
        .orWhere('from', receiver)
        .orWhere('to', sender)
}

const getChatByID = (id_chat) => {
    return db('chat').where('id_chat', id_chat)
}

const storeChat = (data) => {
    return db('chat').insert(data)
}

module.exports = {
    getAllChatByUser,
    getChatBySenderAndReceiver,
    getChatByID,
    storeChat
};