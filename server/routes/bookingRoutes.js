import express from 'express';
import { getRoomAvailability, createBooking, getRoomBookings, getUserBookings, stripePayment, cancelBooking, confirmBookingPayment } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.get('/availability', getRoomAvailability);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/room', protect, getRoomBookings);

bookingRouter.post('/stripe-payment', protect, stripePayment);
bookingRouter.post('/:id/confirm-payment', protect, confirmBookingPayment);
bookingRouter.delete('/:id', protect, cancelBooking);

export default bookingRouter;
