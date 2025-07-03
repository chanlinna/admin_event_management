// Create and configure Express app; register middleware and routes
//Start Express server and listen on a port
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import roleRoutes from './routes/roleRoute.js';
import permissionRoutes from './routes/permissionRoute.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));