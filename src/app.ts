import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// rotas 
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/', (_req, res) => res.json({ status: 'ok' }));

export default app;
