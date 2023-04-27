const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const path = require('path');
dotenv.config();

const db = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api', apiRouter);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

// Catch-all to serve the React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));