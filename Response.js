const response = (code, data, message, res) => {
    res.json(code, [
        {
            payload: {
                data,
                message
            }
        }
    ])
}

module.exports = response