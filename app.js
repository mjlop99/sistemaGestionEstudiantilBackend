const express = require('express');
const connectDB = require('./config/config');
const cors = require('cors');
const app = express();
connectDB();

app.use(cors())
app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/public/apis'));
app.use('/api/', require('./routes/protected/apis'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
