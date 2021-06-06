const mongoose = require("mongoose");
const db = mongoose.connection;
require('dotenv').config();
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("DataBase: We are connected");
});

module.exports = db