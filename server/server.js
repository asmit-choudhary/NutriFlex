require('dotenv').config(); // load .env into process.env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();  // connect to mongoDB when server starts

const app = express();
app.use(cors()); // allows request from the REACT app
app.use(express.json());  // lets us read JSON in request bodies

// a simple test route to confirm the server is alive 
app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'NutriFlex server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port  ${PORT}`));