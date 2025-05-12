/**
 * 预约路由
 * 定义预约相关的API端点
 */

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const bookingController = require('../../controllers/consultant/bookingController');

const router = express.Router();

router.get('/:userId', verifyToken, bookingController.getUserBookings);

router.get('/:userId/:bookingId', verifyToken, bookingController.getBookingById);

router.post('/:userId', verifyToken, bookingController.createBooking);

router.put('/:userId/:bookingId', verifyToken, bookingController.updateBooking);

router.post('/:userId/:bookingId/cancel', verifyToken, bookingController.cancelBooking);

router.get('/availability/:consultantId', bookingController.checkAvailability);

router.post('/:consultantId/:bookingId/meeting-link', verifyToken, bookingController.addMeetingLink);

router.post('/:userId/:bookingId/feedback', verifyToken, bookingController.addBookingFeedback);

module.exports = router;
