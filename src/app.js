import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
//import handleErrors from './utils/errorHandlers.js';
//import loginRequired from './controllers/usersController.js';
import userRoutes from './routes/routes.js';
import routes from './routes/routes.js';
// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

routes(app);


// app.use((req, res, next) => {
//     if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
//         jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
//             if (err) req.user = undefined;
//             req.user = decode;
//             next();
//         });
//     } else {
//         req.user = undefined;
//         next();
//     }
// });

export default app;
