const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkStatusMiddleware = require('../middleware/checkStatusMiddleware')

router.post('/signup', userController.registration)
router.post('/login',checkStatusMiddleware, userController.login)
router.get('/auth', authMiddleware, checkStatusMiddleware, userController.check)
router.get('/', authMiddleware, checkStatusMiddleware, userController.getAllUsers)
router.post('/change', authMiddleware, checkStatusMiddleware, userController.changeUsersStatus)
router.delete('/delete', authMiddleware, checkStatusMiddleware, userController.deleteUsers)
// router.patch('/change', authMiddleware, userController.changeUserDetails)
// router.patch('/password', authMiddleware, userController.changePassword)




module.exports = router
