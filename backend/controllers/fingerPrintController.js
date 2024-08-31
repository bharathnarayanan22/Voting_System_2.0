const { 
    generateRegistrationOptions, 
    verifyRegistrationResponse ,
    generateAuthenticationOptions, 
    verifyAuthenticationResponse 
} = require('@simplewebauthn/server');

const userStore = {};
const challengeStore = {}; 

exports.registerUser = async (req, res) => {
    const { userId, username } = req.body;
    console.log('Registering user:', { userId, username });

    userStore[userId] = { username };
    console.log('Current userStore:', userStore);

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

exports.loginChallenge = async (req, res) => {
    const { userId } = req.body
    console.log('Received userId for login challenge:', userId);
    console.log('Current userStore:', userStore);

    // if (!userStore[userId]) {
    //     console.log('User not found for ID:', userId);
    //     return res.status(404).json({ error: 'user not found!' });
    // }
    

            const opts = await generateAuthenticationOptions({
                rpID: 'localhost',
            });
            console.log('Generated options:', opts)
        

    challengeStore[userId] = opts.challenge

    return res.json({ options: opts })
}


exports.loginVerify =  async (req, res) => {
    const { userId, cred }  = req.body

    // if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })
    const user = userStore[userId]
    const challenge = challengeStore[userId]

    const result = await verifyAuthenticationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:5173',
        expectedRPID: 'localhost',
        response: cred,
        authenticator: user.passkey
    })

    if (!result.verified) return res.json({ error: 'something went wrong' })
    
    // Login the user: Session, Cookies, JWT
    return res.json({ success: true, userId })
}