import React, { useState, useRef, useEffect } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuItem from "@mui/material/MenuItem";
import Select from 'react-select';
import Webcam from "react-webcam";
import axios from "axios";

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff9933",
    },
    secondary: {
      main: "#138808",
    },
  },
});

const EnrollVoterForm = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [mobile_number, setMobileNumber] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]); // Store regions data
  const [selectedRegion, setSelectedRegion] = useState(""); // Store selected region

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('http://localhost:3000/regions');
        if (response.ok) {
          const data = await response.json();
          setRegions(data.regions.map(region => ({
            value: region._id,
            label: region.name
          })));
        } else {
          console.error('Failed to fetch regions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  const captureImages = async () => {
    const capturedPhotos = [];
    for (let i = 0; i < 20; i++) {
      const imageSrc = webcamRef.current.getScreenshot();
      capturedPhotos.push(imageSrc);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setPhotos(capturedPhotos);
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      console.log(selectedRegion.value)
      const response = await axios.post("http://127.0.0.1:5000/capture", {
        name: name,
        mobile_number: mobile_number,
        regionId: selectedRegion ? selectedRegion.value : null,
        image: photos.map((photo) => photo.split(",")[1]),
      });

      alert("Voter enrolled successfully!");
    } catch (error) {
      console.error("Error enrolling voter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Enroll Voter
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              value={mobile_number}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              inputProps={{ pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <Select
          options={regions}
          value={selectedRegion}
          onChange={setSelectedRegion}
          placeholder="Select Region"
          isClearable
          isSearchable
        />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Capture Photo
          </Typography>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
          />
          <Grid container spacing={2} mt={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <img
                  src={photo}
                  alt={`Photo ${index}`}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={captureImages}
            startIcon={<PhotoCameraIcon />}
            disabled={loading}
          >
            Capture Images
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEnroll}
            disabled={loading || photos.length < 20 || !selectedRegion}
          >
            {loading ? "Enrolling..." : "Enroll Voter"}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EnrollVoterForm;

// import React, { useState, useRef, useEffect } from "react";
// import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import Select from 'react-select';
// import Webcam from "react-webcam";
// import axios from "axios";
// import { v4 as uuidv4 } from 'uuid';
// import { startRegistration } from '@simplewebauthn/browser';

// const theme = createTheme({
//   palette: {
//     primary: { main: "#ff9933" },
//     secondary: { main: "#138808" },
//   },
// });

// const EnrollVoterForm = () => {
//   const webcamRef = useRef(null);
//   const [name, setName] = useState("");
//   const [mobile_number, setMobileNumber] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [regions, setRegions] = useState([]);
//   const [selectedRegion, setSelectedRegion] = useState("");

//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/regions');
//         if (response.ok) {
//           const data = await response.json();
//           setRegions(data.regions.map(region => ({
//             value: region._id,
//             label: region.name
//           })));
//         } else {
//           console.error('Failed to fetch regions:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching regions:', error);
//       }
//     };

//     fetchRegions();
//   }, []);

//   const captureImages = async () => {
//     const capturedPhotos = [];
//     for (let i = 0; i < 20; i++) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       capturedPhotos.push(imageSrc);
//       await new Promise((resolve) => setTimeout(resolve, 500));
//     }
//     setPhotos(capturedPhotos);
//   };

// const handleEnroll = async () => {
//   try {
//       setLoading(true);

//       const userId = uuidv4();
//       console.log(userId);

//       await axios.post('http://localhost:3000/register-user', {
//           userId,
//           username: name,
//       });

//       const challengeResponse = await axios.post('http://localhost:3000/register-challenge', {
//           userId,
//       });
//       console.log(challengeResponse);

//       const { options } = challengeResponse.data;
//       console.log(options);

//       // Start WebAuthn registration
//       const authenticationResult = await startRegistration({
//           ...options,
//       });
//       console.log(authenticationResult);

//       const verifyResponse = await axios.post('http://localhost:3000/register', {
//           userId,
//           cred: authenticationResult,
//       });

//       if (!verifyResponse.data.verified) {
//           alert('Fingerprint registration failed.');
//           return;
//       }

//       await axios.post("http://127.0.0.1:5000/capture", {
//           id: userId,
//           name,
//           mobile_number,
//           regionId: selectedRegion ? selectedRegion.value : null,
//           image: photos.map((photo) => photo.split(",")[1]),
//           fingerprintData: authenticationResult, // Use authenticationResult directly
//       });

//       alert("Voter enrolled successfully!");
//   } catch (error) {
//       console.error("Error enrolling voter:", error);
//   } finally {
//       setLoading(false);
//   }
// };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box>
//         <Typography variant="h4" gutterBottom>Enroll Voter</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Mobile Number"
//               variant="outlined"
//               fullWidth
//               value={mobile_number}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               required
//               inputProps={{ pattern: "[0-9]*" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Select
//               options={regions}
//               value={selectedRegion}
//               onChange={setSelectedRegion}
//               placeholder="Select Region"
//               isClearable
//               isSearchable
//             />
//           </Grid>
//         </Grid>
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>Capture Photo</Typography>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={640}
//             height={480}
//           />
//           <Grid container spacing={2} mt={2}>
//             {photos.map((photo, index) => (
//               <Grid item xs={6} sm={3} key={index}>
//                 <img
//                   src={photo}
//                   alt={`Photo ${index}`}
//                   style={{ width: "100%", borderRadius: "5px" }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//         <Box mt={2} display="flex" justifyContent="space-between">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={captureImages}
//             startIcon={<PhotoCameraIcon />}
//             disabled={loading}
//           >
//             Capture Images
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleEnroll}
//             disabled={loading || photos.length < 20 || !selectedRegion}
//           >
//             {loading ? "Enrolling..." : "Enroll Voter"}
//           </Button>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EnrollVoterForm;

// import React, { useState, useRef, useEffect } from "react";
// import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "react-select";
// import Webcam from "react-webcam";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import { startRegistration } from "@simplewebauthn/browser";

// // Define custom theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#ff9933",
//     },
//     secondary: {
//       main: "#138808",
//     },
//   },
// });

// const EnrollVoterForm = () => {
//   const webcamRef = useRef(null);
//   const [name, setName] = useState("");
//   const [mobile_number, setMobileNumber] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [regions, setRegions] = useState([]);
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [webauthnOptions, setWebauthnOptions] = useState(null);

//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/regions");
//         if (response.ok) {
//           const data = await response.json();
//           setRegions(
//             data.regions.map((region) => ({
//               value: region._id,
//               label: region.name,
//             }))
//           );
//         } else {
//           console.error("Failed to fetch regions:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching regions:", error);
//       }
//     };

//     fetchRegions();
//   }, []);

//   const captureImages = async () => {
//     const capturedPhotos = [];
//     for (let i = 0; i < 20; i++) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       capturedPhotos.push(imageSrc);
//       await new Promise((resolve) => setTimeout(resolve, 500));
//     }
//     setPhotos(capturedPhotos);
//   };

//   // const handleEnroll = async () => {
//   //   try {
//   //       setLoading(true);

//   //       const userId = uuidv4();
//   //       console.log(userId);

//   //       await axios.post('http://localhost:3000/register-user', {
//   //           userId,
//   //           username: name,
//   //       });

//   //       const challengeResponse = await axios.post('http://localhost:3000/register-challenge', {
//   //           userId,
//   //       });
//   //       console.log(challengeResponse);

//   //       const { options } = challengeResponse.data;
//   //       console.log(options);

//   //       // Start WebAuthn registration
//   //       const authenticationResult = await startRegistration({
//   //           ...options,
//   //       });
//   //       console.log(authenticationResult);

//   //       const verifyResponse = await axios.post('http://localhost:3000/register', {
//   //           userId,
//   //           cred: authenticationResult,
//   //       });

//   //       if (!verifyResponse.data.verified) {
//   //           alert('Fingerprint registration failed.');
//   //           return;
//   //       }

//   //       await axios.post("http://127.0.0.1:5000/capture", {
//   //           id: userId,
//   //           name,
//   //           mobile_number,
//   //           regionId: selectedRegion ? selectedRegion.value : null,
//   //           image: photos.map((photo) => photo.split(",")[1]),
//   //           fingerprintData: authenticationResult, // Use authenticationResult directly
//   //       });

//   //       alert("Voter enrolled successfully!");
//   //   } catch (error) {
//   //       console.error("Error enrolling voter:", error);
//   //   } finally {
//   //       setLoading(false);
//   //   }
//   // };

//   const handleEnroll = async () => {
//     try {
//       setLoading(true);

//       const userId = uuidv4();

//       const response = await axios.post("http://localhost:3000/register", {
//         name: name,
//         userId,
//       });

//       const options = response.data;
//       console.log("Received WebAuthn options:", options);

      

//       // Start WebAuthn registration process
//       // const credential = await navigator.credentials.create({
//       //   publicKey: {
//       //     challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
//       //     rp: options.rp,
//       //     user: options.user,
//       //     pubKeyCredParams: options.pubKeyCredParams,
//       //     timeout: options.timeout,
//       //     attestation: options.attestation,
//       //     excludeCredentials: options.excludeCredentials || []
//       //   }
//       // });
//       // await axios.post("http://localhost:3000/register/complete", {
//       //   credential,
//       // });

//       const authenticationResult = await startRegistration({
//         ...options,
//       });
//       console.log(authenticationResult);

//       const verifyResponse = await axios.post(
//         "http://localhost:3000/register",
//         {
//           userId,
//           cred: authenticationResult,
//         }
//       );

//       if (!verifyResponse.data.verified) {
//         alert("Fingerprint registration failed.");
//         return;
//       }

//       await axios.post("http://127.0.0.1:5000/capture", {
//         name,
//         mobile_number,
//         regionId: selectedRegion ? selectedRegion.value : null,
//         image: photos.map((photo) => photo.split(",")[1]),
//       });

//       alert("Voter enrolled successfully!");
//     } catch (error) {
//       console.error("Error enrolling voter:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box>
//         <Typography variant="h4" gutterBottom>
//           Enroll Voter
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Mobile Number"
//               variant="outlined"
//               fullWidth
//               value={mobile_number}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               required
//               inputProps={{ pattern: "[0-9]*" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Select
//               options={regions}
//               value={selectedRegion}
//               onChange={setSelectedRegion}
//               placeholder="Select Region"
//               isClearable
//               isSearchable
//             />
//           </Grid>
//         </Grid>
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             Capture Photo
//           </Typography>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={640}
//             height={480}
//           />
//           <Grid container spacing={2} mt={2}>
//             {photos.map((photo, index) => (
//               <Grid item xs={6} sm={3} key={index}>
//                 <img
//                   src={photo}
//                   alt={`Photo ${index}`}
//                   style={{ width: "100%", borderRadius: "5px" }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//         <Box mt={2} display="flex" justifyContent="space-between">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={captureImages}
//             startIcon={<PhotoCameraIcon />}
//             disabled={loading}
//           >
//             Capture Images
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleEnroll}
//             disabled={loading || photos.length < 20 || !selectedRegion}
//           >
//             {loading ? "Enrolling..." : "Enroll Voter"}
//           </Button>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EnrollVoterForm;
