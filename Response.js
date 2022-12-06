const response = (code, data, message, res) => {
    res.json(code, [
        {
            payload: data,
            message,
            metadata: {
                prev: "",
                next: "",
                current: ""
            }
        }
    ])
}

module.exports = response