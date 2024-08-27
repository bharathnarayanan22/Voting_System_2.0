import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box, TableContainer, Paper, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ViewPartyPage = () => {
  const [parties, setParties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editParty, setEditParty] = useState(null);
  const [partyName, setPartyName] = useState('');
  const [partyLeader, setPartyLeader] = useState('');
  const [partySymbol, setPartySymbol] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('http://localhost:3000/parties');
      if (response.ok) {
        const data = await response.json();
        setParties(data.parties);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditParty = (party) => {
    setIsEditing(true);
    setEditParty(party);
    setPartyName(party.partyName);
    setPartyLeader(party.partyLeader);
    setPartySymbol(party.partySymbol);
  };

  const handleUpdateParty = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${editParty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ editParty: { partyName, partyLeader, partySymbol } }),
      });

      if (response.ok) {
        const updatedParty = await response.json();
        setParties(parties.map(party => party._id === updatedParty.party._id ? updatedParty.party : party));
        console.log('Party updated successfully');
        handleDialogClose(); // Close the dialog after updating
      } else {
        console.error('Failed to update party:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };

  const handleDeleteParty = async (partyId) => {
    try {
      const response = await fetch(`http://localhost:3000/parties/${partyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setParties(parties.filter(party => party._id !== partyId));
        console.log('Party deleted successfully');
      } else {
        console.error('Failed to delete party:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting party:', error);
    }
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    setEditParty(null);
    setPartyName('');
    setPartyLeader('');
    setPartySymbol('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ color: '#121481', fontWeight: 'bold' }}>
        Parties Registered
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#138808' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Leader</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              parties.map((party) => (
                <TableRow key={party._id}>
                  <TableCell>{party.partyName}</TableCell>
                  <TableCell>{party.partyLeader}</TableCell>
                  <TableCell>{party.partySymbol}</TableCell>
                  <TableCell >
                    <IconButton onClick={() => handleEditParty(party)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteParty(party._id)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isEditing} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Party</DialogTitle>
        <DialogContent>
          <TextField
            label="Party Name"
            variant="outlined"
            fullWidth
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Party Leader"
            variant="outlined"
            fullWidth
            value={partyLeader}
            onChange={(e) => setPartyLeader(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Party Symbol"
            variant="outlined"
            fullWidth
            value={partySymbol}
            onChange={(e) => setPartySymbol(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateParty} variant="contained" color="primary">
            Update Party
          </Button>
          <Button onClick={handleDialogClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewPartyPage;
