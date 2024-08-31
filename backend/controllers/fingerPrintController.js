const { 
    generateRegistrationOptions, 
    verifyRegistrationResponse 
} = require('@simplewebauthn/server');

const userStore = {};
const challengeStore = {}; 

exports.registerUser = async (req, res) => {
    const { userId, username } = req.body;
    userStore[userId] = { username };
    return res.status(201).json({ message: 'User registered successfully', userId });
};

exports.registerChallenge = async (req, res) => {
    const { userId } = req.body

    if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

    const user = userStore[userId]

    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'My Localhost Machine',
        attestationType: 'none',
        userName: user.username,
        timeout: 60_000,
    })

    //challengePayload.challenge = Buffer.from(challengePayload.challenge).toString('base64');

    challengeStore[userId] = challengePayload.challenge;
    return res.json({ options: challengePayload })

};


// exports.registerVerify = async (req, res) => {
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
// };


exports.registerVerify = async (req, res) => {
    const { userId, cred }  = req.body
    console.log(cred)
    console.log(userId)
    
    if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

    const user = userStore[userId]
    const challenge = challengeStore[userId]

    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:5173',
        expectedRPID: 'localhost',
        response: cred,
    })


    if (!verificationResult.verified) return res.json({ error: 'could not verify' });
    userStore[userId].passkey = verificationResult.registrationInfo

    return res.json({ verified: true })
};