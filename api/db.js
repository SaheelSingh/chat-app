const mongoose = require('mongoose');

const connectDb = () => {
    try {
        mongoose.connect('mongodb+srv://saheel:AEYsnczm5e4PQTZY@cluster0.kbhniia.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to database...")
    } catch (err) {
        console.log("Something went wrong can't connect to database")
    }
}

module.exports = connectDb;