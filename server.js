const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRouter = require('./routes/addressRouter');
const couponRouter = require('./routes/couponRouter');
const { errorHandler } = require('./middlewares/errorMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const wishListsRoutes = require('./routes/wishListsRoutes');

const pageRoutes = require('./routes/pageRoutes');
const expressLayouts = require('express-ejs-layouts');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// EJS SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout/main');

// PAGE ROUTES (SSR)
app.use('/', pageRoutes);

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // users & admin
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishListsRoutes);

// ERROR HANDLER MUST BE LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));
