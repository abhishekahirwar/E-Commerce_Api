const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDB = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Database connect Successfully');
        })
        .catch((error) => {
            console.log('Database connection problem');
            console.log(error);
            process.exit(1);
        });
};