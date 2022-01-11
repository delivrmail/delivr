function response(statusCode, body){
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: stringify(body)
    }
}

function stringify(value) {
    if (value !== undefined) {
        return JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    }
}

exports.response = response