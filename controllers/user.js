const User = require('../models/User')
const signupValidator = require('../utils/signupValidator')
const loginValidator = require('../utils/loginValidator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');

const createUser = (req, res) => {
    const { name, email, password, confirmPassword, img, isVolunteer } = req.body

    const validator = signupValidator({ name, email, password, confirmPassword })

    if (!validator.isValid) {
        return res.status(400).json(validator.error)
    }

    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: "Email is already exist"
                })
            }

            bcrypt.hash(password, 11, (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        msg: `Server error occured! Error: ${error}`
                    })
                }

                const addUser = new User({
                    name,
                    email,
                    phone: '',
                    img: req.file ? req.file.filename : null,
                    address: '',
                    bio: '',
                    isVolunteer: isVolunteer || false,
                    password: hash
                })

                addUser.save()
                    .then(user => {

                        const token = jwt.sign({
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            img: user.img
                        }, 'SECRET', { expiresIn: '24h' })

                        res.status(201).json({
                            msg: "Successfully signup",
                            user,
                            token: `Bearer ${token}`
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: `Server error occured! Error: ${error}`
                        })
                    })
            })

        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! Error: ${error}`
            })
        })
}

const loginUser = (req, res) => {
    const { email, password } = req.body

    const validator = loginValidator({ email, password })

    if (!validator.isValid) {
        return res.status(400).json(validator.error)
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    msg: "User dosen\'t found"
                })
            }

            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    return res.status(500).json({
                        msg: `Server error occured! Error: ${error}`
                    })
                }

                if (!result) {
                    res.status(400).json({
                        password: "Password dosent match"
                    })
                } else {
                    const token = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        img: user.img
                    }, 'SECRET', { expiresIn: '24h' })

                    res.status(200).json({
                        msg: 'Login successfull',
                        token: `Bearer ${token}`
                    })
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! Error: ${error}`
            })
        })
}

const allUsers = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({
                msg: 'All users',
                total: users.length,
                users
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! Error: ${error}`
            })
        })
}

const singleUser = (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            res.status(200).json({
                msg: 'Single user',
                user
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! ${error}`
            })
        })
}

const updateUser = (req, res) => {
    const id = req.params.id
    const { name, email, phone, address, bio, isVolunteer } = req.body

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    msg: 'User not found'
                })
            }

            if (req.file) {
                if (user.img) {
                    fs.unlink(`./uploads/${user.img}`, function (err) {
                        if (err) throw err;
                        console.log('File deleted!');
                    });
                }
            }

            const updatedUser = {
                name: name || user.name,
                email: email || user.email,
                phone: phone || user.phone,
                address: address || user.address,
                bio: bio || user.bio,
                isVolunteer: isVolunteer || user.isVolunteer,
                img: req.file ? req.file.filename : user.img
            }

            User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true })
                .then(updUser => {
                    res.status(200).json({
                        msg: 'User updated  successfully',
                        user: updUser
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        msg: `Server error occured! ${error}`
                    })
                })

        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! ${error}`
            })
        })
}

const deleteUser = (req, res) => {
    const id = req.params.id

    User.findByIdAndDelete(id)
        .then(user => {

            if (!user) {
                return res.status(400).json({
                    msg: 'User not found'
                })
            }

            fs.unlink(`./uploads/${user.img}`, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });

            res.status(200).json({
                msg: 'User deleted',
                user
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! ${error}`
            })
        })
}

const bulkDelete = (req, res) => {
    const ids = req.body.ids

    ids.map(id => {
        User.findByIdAndDelete(id)
            .then(user => {

                if (!user) {
                    return res.status(400).json({
                        msg: 'User not found'
                    })
                }

                if (user.img !== null) {
                    fs.unlink(`./uploads/${user.img}`, function (err) {
                        if (err) throw err;
                        console.log('File deleted!');
                    });
                }

                res.status(200).json({
                    msg: 'Selected users deleted',
                    usersId: ids
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: `Server error occured! ${error}`
                })
            })
    })
}

const search = (req, res) => {
    const term = req.params.term

    User.find({ $text: { $search: term } })
        .then(response => {
            res.status(200).json({
                users: response
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: `Server error occured! ${error}`
            })
        })
}

module.exports = {
    createUser,
    loginUser,
    allUsers,
    singleUser,
    updateUser,
    deleteUser,
    bulkDelete,
    search
}