const router = require('express').Router()
const userControllers = require('../controllers/user')
const authenticate = require('../utils/authenticate')
const upload = require('../utils/fileUpload')

router.get('/', userControllers.allUsers)
router.get('/:id', userControllers.singleUser)
router.post('/signup', upload.single('img'), userControllers.createUser)
router.post('/login', userControllers.loginUser)
router.put('/:id', upload.single('img'), authenticate, userControllers.updateUser)
router.delete('/:id', authenticate, userControllers.deleteUser)
router.delete('/', authenticate, userControllers.bulkDelete)
router.get('/search/:term', userControllers.search)

module.exports = router