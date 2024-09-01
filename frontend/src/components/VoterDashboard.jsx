import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import img from '../assets/government.png';

const ViewVoterPage = () => {
  const [parties, setParties] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [votedParty, setVotedParty] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { region } = location.state || {};

  useEffect(() => {
    console.log("Dash==> ",region)
    if (region) {
      fetchParties(region);
    }
  }, [region]);

  const fetchParties = async (region) => {
    try {
      const response = await fetch(`http://localhost:3000/parties/${region}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setParties(data.parties);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  

  const handleVote = async (partyId, partyName) => {
    try {
      const response = await fetch(`http://localhost:3000/voters/vote/${partyId}`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedParty = await response.json();
        console.log('Voted successfully', updatedParty);

        setParties((prevParties) =>
          prevParties.map((party) =>
            party._id === partyId ? { ...party, VoteCount: updatedParty.VoteCount } : party
          )
        );

        setVotedParty(partyName);
        setShowConfirmation(true);

        setTimeout(() => {
          setShowConfirmation(false);
          navigate('/voterVerification');
        }, 5000);
      } else {
        console.error('Failed to vote:', response.statusText);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 2,
      backgroundImage: `linear-gradient(to bottom, #ff9933, #ffffff, #138808)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        height: '80%',
        backgroundImage: `url(${img})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.2,
        zIndex: 1,
      }} />
      <Box sx={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, padding: 3, maxWidth: '80%', marginLeft: '9%', marginRight: '9%' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#000080', fontWeight: 'bold', textAlign: 'center' }}>
          Vote for Your Preferred Party
        </Typography>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ff9933' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party._id}>
                <TableCell style={{ textAlign: 'center' }}>{party.partyName}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{party.partySymbol}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ff9933',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#138808',
                      },
                    }}
                    onClick={() => handleVote(party._id, party.partyName)}
                  >
                    Vote
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      
      {showConfirmation && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 128, 0, 0.8)',
          color: '#FFFFFF',
          borderRadius: 5,
          padding: 3,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 3,
        }}>
          <CheckCircleIcon sx={{ fontSize: 50, marginBottom: 2 }} />
          <Typography variant="h5" gutterBottom>
            You have voted for {votedParty}!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewVoterPage;
