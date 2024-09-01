// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import styles from './VoterVerification.module.css';
// import loadingSpinner from './loading-spinner.gif';
// import axios from 'axios';

// const VoterVerification = () => {
//   const navigate = useNavigate();
//   const [result, setResult] = useState('');
//   const [loading, setLoading] = useState(false);
//   const webcamRef = React.useRef(null);



//   const verifyUser = async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (imageSrc) {

//       try {
//         const response = await axios.post('http://127.0.0.1:5000/recognize', {
//           image: imageSrc.split(',')[1],  
//         });
//         console.log(response.data)

//         if (!response) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         console.log('Server response:', response.data);
//         displayResult(response.data);
//       } catch (error) {
//         console.error('Error sending snapshot:', error);
//       }
//     }
//   };


//   const displayResult = (data) => {
//     if (data.error) {
//       setResult(data.error);
//     } else if (data.message === "Already voted") {
//       setResult("You have already voted.");
//       alert("You have already voted.");  // Show an alert to the user
//     } else {
//       setResult(`Detected face: ${data.name}`);
//       navigate('/voter');  // Redirect to the voter page after successful verification
//     }
//     setLoading(false);
//   };


//   const handleDetectUser = (event) => {
//     event.preventDefault();
//     verifyUser();
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.leftPanel}></div>
//       <div className={styles.rightPanel}>
//         <h1 className={styles.heading}>Verification Page</h1>

//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className={styles.video}
//         />
//         <form className={styles.form} onSubmit={handleDetectUser}>
//           <button className={styles.button} type="submit" disabled={loading}>
//             Verify
//           </button>
//         </form>
//         {loading && (
//           <div className={styles.loadingOverlay}>
//             <img src={loadingSpinner} alt="Loading..." className={styles.loadingSpinner} />
//           </div>
//         )}
//         <p className={styles.result}>{result}</p>
//       </div>
//     </div>
//   );
// };

// export default VoterVerification;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import styles from './VoterVerification.module.css';
import loadingSpinner from './loading-spinner.gif';
import { startAuthentication } from '@simplewebauthn/browser';

const VoterVerification = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const webcamRef = React.useRef(null);


    const verifyUser = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
          setLoading(true);
          try {
              const response = await axios.post('http://127.0.0.1:5000/recognize', {
                  image: imageSrc.split(',')[1],
              });
              console.log(response.data);

              if (response.data.error) {
                  throw new Error(response.data.error);
              }

              if (response.data.name) {
                  if (response.data.message === "Already voted") {
                      setResult("You have already voted. No further actions required.");
                  } else {
                      setMobileNumber(response.data.mobileNumber);
                      setShowOtpPopup(true);
                      setResult('Face recognized. OTP sent to your mobile number.');
                  }
              }
          } catch (error) {
              console.error('Error verifying user:', error);
              setResult('Error verifying user. Please try again.');
          } finally {
              setLoading(false);
          }
      }
  };

  // const verifyUser = async () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   if (imageSrc) {
  //     setLoading(true);
  //     try {
  //       const faceRecognitionResponse = await axios.post('http://127.0.0.1:5000/recognize', {
  //         image: imageSrc.split(',')[1],
  //       });

  //       if (faceRecognitionResponse.data.error) {
  //         throw new Error(faceRecognitionResponse.data.error);
  //       }

  //       console.log(faceRecognitionResponse.data)

  //       const userId = faceRecognitionResponse.data.id;
  //       console.log(userId)

  //       if (faceRecognitionResponse.data.name) {
  //         if (faceRecognitionResponse.data.message === "Already voted") {
  //           setResult("You have already voted. No further actions required.");
  //         } else {
  //           // Proceed with WebAuthn fingerprint authentication
  //           const challengeResponse = await axios.post('http://localhost:3000/loginChallenge', {
  //             userId,
  //           });

  //           const { options } = challengeResponse.data;


  //           const authenticationResult = await startAuthentication(options)
  //           console.log('Authentication result:', authenticationResult);


  //           // Send the authentication result back to the server for verification
  //           const verifyResponse = await axios.post('http://localhost:3000/loginVerify', {
  //             userId,
  //             cred: authenticationResult,
  //           });

  //           if (verifyResponse.status === 200) {
  //             setMobileNumber(faceRecognitionResponse.data.mobileNumber);
  //             setShowOtpPopup(true);
  //             setResult('Face recognized. OTP sent to your mobile number.');
  //           } else {
  //             throw new Error('WebAuthn verification failed.');
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error verifying user:', error);
  //       setResult(`Error verifying user: ${error.message}. Please try again.`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const verifyOtp = async () => {
    console.log(`Verifying OTP: ${otp} for mobile: ${mobileNumber}`);
    try {
      const response = await axios.post('http://127.0.0.1:5000/verify-otp', { mobile: mobileNumber, otp });
      console.log('OTP verification response:', response.data);
      if (response.data.success) {
        navigate('/voter');
      } else {
        setResult('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setResult(`Error verifying OTP: ${error.response ? error.response.data.message : error.message}. Please try again.`);
    }
  };

  const handleDetectUser = (event) => {
    event.preventDefault();
    verifyUser();
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (!otp || otp.length !== 6) {
      setResult('Please enter a valid 6-digit OTP.');
      return;
    }
    verifyOtp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}></div>
      <div className={styles.rightPanel}>
        <h1 className={styles.heading}>Verification Page</h1>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.video}
        />
        <form className={styles.form} onSubmit={handleDetectUser}>
          <button className={styles.button} type="submit" disabled={loading}>
            Verify
          </button>
        </form>
        {loading && (
          <div className={styles.loadingOverlay}>
            <img src={loadingSpinner} alt="Loading..." className={styles.loadingSpinner} />
          </div>
        )}
        <p className={styles.result}>{result}</p>

        {showOtpPopup && (
          <div className={styles.otpPopupOverlay}>
            <div className={styles.otpPopup}>
              <h2 className={styles.otpHeading}>Enter OTP</h2>
              <p className={styles.otpPrompt}>Enter the OTP sent to your mobile number {mobileNumber}</p>
              <form onSubmit={handleOtpSubmit}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className={styles.otpInput}
                  required
                />
                <button type="submit" className={styles.otpButton}>Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterVerification;

