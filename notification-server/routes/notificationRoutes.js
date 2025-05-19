const express = require('express');
const router = express.Router();
const { sendNoti,getUserNoti}=require('../controllers/notiController');

router.post('/notifications',sendNoti);
router.get('/users/:id/notifications',getUserNoti);

module.exports = router;