const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// For Image Or PDF Upload On Couldinary
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Routes
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');

// Database connection
require('./config/database').connectDB();

// Cloudinary connection
require('./config/cloudinary').cloudinaryConnection();

app.use(cors({ origin: "*" }));

app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
    res.send("This is Home Page...");
});

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});