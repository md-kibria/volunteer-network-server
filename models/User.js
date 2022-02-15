const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        rquire: true,
        trim: true
    },

    img: {
        type: String,
        require: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true
    },

    isVolunteer: {
        type: Boolean,
        require: true
    },

    password: {
        type: String,
        require: true,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },

    bio: {
        type: String,
        trim: true
    },
})

userSchema.index({
    name: 'text',
    bio: 'text',
    address: 'text'
}, {
    weights: {
        name: 5,
        bio: 5,
        address: 2
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User