const express = require('express');

const router = express.Router();

const { authenticateUser, autorizedUser } = require('../middleware/authentication')

const { getAllUsers,
    getCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword
} = require('../controller/userController');

router.route('/').get(authenticateUser, autorizedUser('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, getCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;