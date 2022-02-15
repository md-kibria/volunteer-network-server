const validator = require('validator')

const validate = user => {
    let error = {}

    if(!user.email) {
        error.email = "Please provide your email"
    }

    if(!user.password) {
        error.password = "Please provide your password"
    }

    return {
        isValid: Object.keys(error).length === 0,
        error
    }
}

module.exports = validate