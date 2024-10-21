const SendWhatsappMessage = async (target, message) => {
    const data = new FormData()
    data.append('target', target)
    data.append('message', message)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
        body: data,
    })

    const result = await response.json()

    return result
}

module.exports = { SendWhatsappMessage }