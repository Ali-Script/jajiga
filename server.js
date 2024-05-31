const app = require('./app');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const node_env = process.env.NODE_ENV == 'production'
if (!node_env) dotenv.config();


async function connectToServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to :${mongoose.connection.host}`);

    } catch (err) { console.log(err.message); }
}

function srartServer() {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    })
}

async function run() {
    await connectToServer();
    srartServer();
}

run();