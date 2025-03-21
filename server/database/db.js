require('dotenv').config();  // Add this line

const database = require('mongoose');

function connecttodb() {
    database.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('Database connection error:', err); 
        });
}

module.exports = connecttodb;
