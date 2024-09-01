import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import styles from "./VoterVerification.module.css";
import loadingSpinner from "./loading-spinner.gif";

const VoterVerification = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const webcamRef = React.useRef(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/regions');
        console.log(response.data)
        setRegions(response.data.regions);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []);


  const verifyUser = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc && selectedRegion) {
      setLoading(true);
      try {
        const response = await axios.post('http://127.0.0.1:5000/recognize', {
          image: imageSrc.split(',')[1],
          regionId: selectedRegion,
        });
        console.log(response.data);

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        if (response.data.name) {
          if (response.data.message === 'Already voted') {
            setResult('You have already voted. No further actions required.');
          } else if (response.data.message === 'Region mismatch') {
            setResult('Voter does not belong to the selected region.');
          } else {
            // setMobileNumber(response.data.mobileNumber);
            // setShowOtpPopup(true);
            // setResult('Face recognized. OTP sent to your mobile number.');
            console.log(selectedRegion);
            navigate("/voter", { state: { region: selectedRegion } });
          }
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        setResult('Error verifying user. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setResult('Please select a region.');
    }
  };

  const verifyOtp = async () => {
    console.log(`Verifying OTP: ${otp} for mobile: ${mobileNumber}`);
    try {
      const response = await axios.post("http://127.0.0.1:5000/verify-otp", {
        mobile: mobileNumber,
        otp,
      });
      console.log("OTP verification response:", response.data);
      if (response.data.success) {
        navigate("/voter", { state: { region: selectedRegion } });
      } else {
        setResult("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setResult(
        `Error verifying OTP: ${
          error.response ? error.response.data.message : error.message
        }. Please try again.`
      );
    }
  };

  const handleDetectUser = (event) => {
    event.preventDefault();
    verifyUser();
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (!otp || otp.length !== 6) {
      setResult("Please enter a valid 6-digit OTP.");
      return;
    }
    verifyOtp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel} />

      <div className={styles.rightPanel}>
        <h1 className={styles.heading}>Verification Page</h1>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className={styles.video} />
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
              <p className={styles.otpPrompt}>
                Enter the OTP sent to your mobile number {mobileNumber}
              </p>
              <form onSubmit={handleOtpSubmit}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className={styles.otpInput}
                  required
                />
                <button type="submit" className={styles.otpButton}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
        <label htmlFor="regionSelect" className={styles.regionLabel}>
          Select Region:
        </label>
        <select
          id="regionSelect"
          className={styles.regionSelect}
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">--Select Region--</option>
          {regions.map((region) => (
            <option key={region._id} value={region._id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VoterVerification;
