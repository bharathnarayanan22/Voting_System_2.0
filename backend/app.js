// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');
// const faceRoutes = require('./routes/faceRoutes');
// const partyRoutes = require('./routes/partyRoutes');
// const voterRoutes = require('./routes/voterRoutes');
// const regionRoutes = require('./routes/regionRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());

// mongoose.connect('mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/voting_system', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   app.listen(3000);
//   console.log("DB connected and server is running.");
// })

// app.use('/faces', faceRoutes);
// app.use('/', partyRoutes);
// app.use('/', voterRoutes);
// app.use('/', regionRoutes);


// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// Import routes
const authRoutes = require('./routes/fingerPrintRoute');
const faceRoutes = require('./routes/faceRoutes');
const partyRoutes = require('./routes/partyRoutes');
const voterRoutes = require('./routes/voterRoutes');
const regionRoutes = require('./routes/regionRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// app.use('/face_dataset', express.static(path.join(__dirname, 'face_dataset')));

// MongoDB Connection
mongoose.connect('mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/voting_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB connected and server is running.");
});

// Use routes
app.use('/', authRoutes);
app.use('/faces', faceRoutes);
app.use('/', partyRoutes);
app.use('/', voterRoutes);
app.use('/', regionRoutes);

const Port = 3000;

// Start the Server
app.listen(Port, () => {
    console.log(`Server started on PORT:${Port}`);
});

