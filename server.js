const app = require('./app.js');
const mongoose = require('mongoose');
require("dotenv").config();
const port = process.env.PORT;
(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
})

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
})