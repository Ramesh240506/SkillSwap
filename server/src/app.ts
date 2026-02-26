import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import skillOfferingRoutes from './routes/skillOffering.routes';
import BookingRoutes from './routes/serviceBooking';
import MyBookingsRoutes from './routes/booking.routes';
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", skillOfferingRoutes);
app.use("/api",BookingRoutes);
app.use("/api", MyBookingsRoutes);
export default app;