import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

const app = express();
//------------------------GLOBAL MIDDLEWARES-----------------------
// Implement CORS

// Access-Control-Allow-Origin *
app.use(cors());
// app.use(cors({
//   origin: 'https://www.your-domaincom'
// }))
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//------------------------Body parser,----------------------
// app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use('/', (req, res) => {
  const method = req.method;
  console.log(`Received a ${method} request`);
  res.send('Hello world!');
});

app.all('*', (req, res) => {
  res.send(`Can't find ${req.originalUrl} on this server!`);
});

export default app;
