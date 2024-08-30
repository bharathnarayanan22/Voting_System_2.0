const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const faceRoutes = require('./routes/faceRoutes');
const partyRoutes = require('./routes/partyRoutes');
const voterRoutes = require('./routes/voterRoutes');
const regionRoutes = require('./routes/regionRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

mongoose.connect('mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/voting_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(3000);
  console.log("DB connected and server is running.");
})

app.use('/faces', faceRoutes);
app.use('/', partyRoutes);
app.use('/', voterRoutes);
app.use('/', regionRoutes);


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');
// const { 
//     generateRegistrationOptions, 
//     verifyRegistrationResponse 
// } = require('@simplewebauthn/server');
// const crypto = require('node:crypto');

// const faceRoutes = require('./routes/faceRoutes');
// const partyRoutes = require('./routes/partyRoutes');
// const voterRoutes = require('./routes/voterRoutes');
// const regionRoutes = require('./routes/regionRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());

// // MongoDB Connection
// mongoose.connect('mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/voting_system', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("DB connected and server is running.");
// });

// // In-Memory Stores
// const userStore = {}; // Temporary in-memory store for users
// const challengeStore = {}; // Temporary in-memory store for challenges

// // WebAuthn Registration Challenge Route
// app.post('/register-challenge', async (req, res) => {
//     const { userId } = req.body;

//     if (!userStore[userId]) return res.status(404).json({ error: 'User not found!' });

//     const user = userStore[userId];

//     const challengePayload = await generateRegistrationOptions({
//         rpID: 'localhost',
//         rpName: 'My Localhost Machine',
//         attestationType: 'none',
//         userName: user.username,
//         timeout: 30_000,
//     });

//     challengeStore[userId] = challengePayload.challenge;

//     return res.json({ options: challengePayload });
// });

// // WebAuthn Registration Verification Route
// app.post('/register-verify', async (req, res) => {
//     const { userId, cred } = req.body;

//     if (!userStore[userId]) return res.status(404).json({ error: 'User not found!' });

//     const challenge = challengeStore[userId];

//     const verificationResult = await verifyRegistrationResponse({
//         expectedChallenge: challenge,
//         expectedOrigin: 'http://localhost:3000',
//         expectedRPID: 'localhost',
//         response: cred,
//     });

//     if (!verificationResult.verified) return res.json({ verified: false });

//     userStore[userId].passkey = verificationResult.registrationInfo;
//     return res.json({ verified: true });
// });

// // Existing Routes
// app.use('/faces', faceRoutes);
// app.use('/', partyRoutes);
// app.use('/', voterRoutes);
// app.use('/', regionRoutes);
// const Port = 3000
// // Start the Server
// app.listen(Port, () => {
//     console.log(`Server started on PORT:${Port}`);
// });
