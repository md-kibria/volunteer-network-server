const validator = require('validator')

const validate = user => {
    let error = {}

    if(!user.name) {
        error.name = "Please provide your name"
    }

    if(!user.email) {
        error.email = "Please provide your email"
    } else if (!validator.isEmail(user.email)) {
        error.email = "Please provide a valid email"
    } 

    if(!user.password) {
        error.password = "Please provide your password"
    } else if(user.password.length < 6) {
        error.password = "Password mustbe or greater than 6 chracters"
    } 

    if(!user.confirmPassword) {
        error.confirmPassword = "Please provide your confirmation password"
        
    } else if(user.password !== user.confirmPassword) {
        error.confirmPassword = "Password password dosen\'t match"
    } else if (user.password !== user.confirmPassword) {
        error.password = "Password dosen\'t match"
    }
    
    return {
        isValid: Object.keys(error).length === 0,
        error
    }
}

module.exports = validate