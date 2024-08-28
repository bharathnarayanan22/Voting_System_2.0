import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Button, Skeleton, Modal } from '@mui/material';
import img from '../assets/government.png';
import { PieChart, Pie, Cell, Tooltip } from 'recharts'; // Importing Recharts components

const ViewLiveResultPage = () => {
  const [parties, setParties] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchParties();
    fetchVoters();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('http://localhost:3000/parties/ViewResults');
      if (response.ok) {
        const data = await response.json();
        setParties(data.parties);
        const totalVotesCount = data.parties.reduce((acc, party) => acc + party.VoteCount, 0);
        setTotalVotes(totalVotesCount);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoters = async () => {
    try {
      const response = await fetch('http://localhost:3000/voters');
      if (response.ok) {
        const data = await response.json();
        setTotalVoters(data.voters.length);
      } else {
        console.error('Failed to fetch voters:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching voters:', error);
    }
  };

  const votePercentage = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <Box sx={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 5, padding: 3, maxWidth: 1200, marginLeft: '9%', marginRight: '9%' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#000080', fontWeight: 'bold', textAlign: 'center' }}>
          Overall Vote Count: {totalVotes}
        </Typography>
        <Button variant="contained" onClick={handleOpen} sx={{ float: 'right', marginBottom: 2, backgroundColor: '#138808', color: '#fff', '&:hover': {
                        backgroundColor: '#ff9933',
                      }, }}>
          View Vote Percentage
        </Button>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ff9933' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Vote Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              parties.map((party) => (
                <TableRow key={party._id}>
                  <TableCell style={{ textAlign: 'center' }}>{party.partyName}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{party.partySymbol}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{party.VoteCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Modal for displaying vote percentage */}
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 300, bgcolor: 'white', p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom style={{ color: '#000080', fontWeight: 'bold', textAlign: 'center' }}>
            Overall Vote Percentage
          </Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={[{ name: 'Voted', value: votePercentage }, { name: 'Not Voted', value: 100 - votePercentage }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              <Cell key="cell-1" fill="#138808" />
              <Cell key="cell-2" fill="#ffc658" />
            </Pie>
            <Tooltip />
          </PieChart>
          <Button variant="contained" onClick={handleClose} align="left" sx={{
            mt: 2, backgroundColor: '#ff9933', color: '#fff', '&:hover': {
              backgroundColor: '#138808',
            },
          }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewLiveResultPage;
