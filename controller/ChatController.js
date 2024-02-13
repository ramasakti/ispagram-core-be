const response = require('../Response')
const ChatModel = require('../Model/ChatModel')
const Moment = require('../utilities/Moment')

const chat = async (req, res) => {
    try {
        const username = req.params.username
        const chat = await ChatModel.getAllChatByUser(username)

        return response(200, chat, `All Chat`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const detailBySenderAndReceiver = async (req, res) => {
    try {
        const { sender, receiver } = req.params
        const detail = await ChatModel.getChatBySenderAndReceiver(sender, receiver)

        return response(200, detail, `Detail Chat`, res)
    } catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const detailByID = async (req, res) => {
    try {
        const id_chat = req.params.id_chat
        const detail = await ChatModel.getChatByID(id_chat)

        return response(200, detail, `Detail`, res)
    }catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

const store = async (req, res) => {
    try {
        const { from, to, message } = req.body
        
        await ChatModel.storeChat({
            from, to, message, waktu: Moment().format('YYYY-MM-DD HH:mm:ss')
        })

        return response(201, {}, `Chat successfully`, res)
    }catch (error) {
        console.error(error)
        return response(500, null, `Internal server error!`, res)
    }
}

module.exports = {
    chat,
    detailBySenderAndReceiver,
    detailByID,
    store
};
