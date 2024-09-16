require('dotenv').config()
const mongoose = require('mongoose').default;

const mongoString = process.env.DATABASE_URL_LOCAL
mongoose.connect(mongoString)
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;
