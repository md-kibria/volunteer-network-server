const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const passport = require('passport')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./utils/passport')(passport)

// User Router
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.send('<i>Server is running!</i>')
})

app.use(express.static('./uploads'))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    mongoose.connect('mongodb://localhost/volunteer-network', {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('Database is connected!')
    })
})