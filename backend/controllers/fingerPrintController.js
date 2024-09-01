// const User = require('../model/user');
// const Challenge = require('../model/challenge');
// const { 
//     generateRegistrationOptions, 
//     verifyRegistrationResponse,
//     generateAuthenticationOptions, 
//     verifyAuthenticationResponse 
// } = require('@simplewebauthn/server');

// exports.registerUser = async (req, res) => {
//     const { userId, username } = req.body;
//     console.log('Registering user:', { userId, username });

//     try {
//         await User.create({ userId, username });
//         return res.status(201).json({ message: 'User registered successfully', userId });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// exports.registerChallenge = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ error: 'User not found!' });

//         const challengePayload = await generateRegistrationOptions({
//             rpID: 'localhost',
//             rpName: 'My Localhost Machine',
//             attestationType: 'none',
//             userName: user.username,
//             timeout: 60_000,
//         });

//         // Update or create the challenge document
//         const existingChallenge = await Challenge.findOneAndUpdate(
//             { userId },
//             { challenge: challengePayload.challenge },
//             { new: true, upsert: true } // `upsert` creates a new document if one does not exist
//         );

//         return res.json({ options: challengePayload });
//     } catch (error) {
//         console.error('Error generating challenge:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.registerVerify = async (req, res) => {
//     const { userId, cred } = req.body;

//     try {
//         // Retrieve the user
//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ error: 'User not found!' });

//         // Retrieve the challenge for the user
//         const challengeDoc = await Challenge.findOne({ userId });
//         if (!challengeDoc) {
//             console.error('No challenge found for user:', userId);
//             return res.status(404).json({ error: 'Challenge not found!' });
//         }

//         // Extract the current challenge from the retrieved document
//         const currentChallenge = challengeDoc.challenge;

//         // Verify the registration response
//         const verificationResult = await verifyRegistrationResponse({
//             expectedChallenge: currentChallenge,
//             expectedOrigin: 'http://localhost:5173',
//             expectedRPID: 'localhost',
//             response: cred,
//         });

//         if (!verificationResult.verified) return res.json({ error: 'Could not verify' });

//         // Store the registration information
//         user.passkey = verificationResult.registrationInfo;
//         await user.save();

//         return res.json({ verified: true });
//     } catch (error) {
//         console.error('Error verifying registration:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.loginChallenge = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ error: 'User not found!' });

//         const opts = await generateAuthenticationOptions({
//             rpID: 'localhost',
//         });

//         // Update existing challenge if present, otherwise create a new one
//         const existingChallenge = await Challenge.findOneAndUpdate(
//             { userId },
//             { challenge: opts.challenge },
//             { new: true, upsert: true }
//         );

//         return res.json({ options: opts });
//     } catch (error) {
//         console.error('Error generating login challenge:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };



// exports.loginVerify = async (req, res) => {
//     const { userId, cred } = req.body;
//     console.log('Received userId and cred for login verify:', userId, cred);

//     try {
//         // Retrieve the user
//         const user = await User.findOne({ userId });
//         if (!user) return res.status(404).json({ error: 'User not found!' });

//         // Retrieve the challenge for the user
//         const challengeDoc = await Challenge.findOne({ userId });
//         if (!challengeDoc) {
//             console.error('No challenge found for user:', userId);
//             return res.status(404).json({ error: 'Challenge not found!' });
//         }

//         // Extract the current challenge from the retrieved document
//         const currentChallenge = challengeDoc.challenge;
//         console.log('Challenge from DB:', currentChallenge);

//         // Verify the authentication response
//         const result = await verifyAuthenticationResponse({
//             expectedChallenge: currentChallenge,
//             expectedOrigin: 'http://localhost:5173',
//             expectedRPID: 'localhost',
//             response: cred,
//             authenticator: user.passkey
//         });

//         if (!result.verified) return res.json({ error: 'Authentication failed' });

//         // Handle successful authentication
//         return res.json({ success: true });
//     } catch (error) {
//         console.error('Error verifying authentication:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };


const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { v4: uuidv4 } = require('uuid');
const { storeUser, updateUserCredential, getUserById } = require('../services/userService');

const uuidToUint8Array = (uuid) => {
    const hex = uuid.replace(/-/g, '');
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
};

exports.register = async (req, res) => {
    const { name } = req.body;
    const userId = uuidv4();
    const userIdUint8Array = uuidToUint8Array(userId);

    console.log(userId)
    // const options = generateRegistrationOptions({
    //   rpName: 'My Localhost Machine',
    //   rpID: "localhost", 
    //   userName: name,
    //   userID: userIdUint8Array,
    //   attestation: "direct"   
    // });

    const options = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'My Localhost Machine',
        attestationType: 'none',
        userName: name,
        timeout: 60_000,
    });
    console.log(options)

    await storeUser({ name, options });

    res.json(options);
};

exports.registerComplete = async (req, res) => {
    const { credential } = req.body;
    const user = await getUserById(credential.user.id);

    const verification = verifyRegistrationResponse({
        credential,
        expectedChallenge: user.challenge,
        expectedOrigin: "http://localhost:5173",
        expectedRPID: "localhost",
    });

    if (verification.verified) {
        await updateUserCredential(credential);
    }

    res.json(verification);
};

exports.authenticate = async (req, res) => {
    const { userId } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const options = generateAuthenticationOptions({
        allowCredentials: user.credentials,
        rpID: "localhost",
        userVerification: 'preferred',
    });

    res.json(options);
};

exports.authenticateComplete = async (req, res) => {
    const { credential } = req.body;
    const user = await getUserById(credential.user.id);

    const verification = verifyAuthenticationResponse({
        credential,
        expectedChallenge: user.challenge,
        expectedOrigin: "http://localhost:5173",
        expectedRPID: "localhost",
    });

    res.json(verification);
};
