import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box, TableContainer, Paper, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPartyForm from './EditPartyForm';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ViewPartyPage = () => {
  const [parties, setParties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editParty, setEditParty] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  // const [partyName, setPartyName] = useState(partyName);
  // const [partyLeader, setPartyLeader] = useState(partyLeader);
  // const [partySymbol, setPartySymbol] = useState(partySymbol);

  useEffect(() => {
    fetchParties();
  }, []);

  const handleUpdateParty = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${party._id}`, editParty, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //   partyName,
        //   partyLeader,
        //   partySymbol,
        // }),
      });

      if (response.ok) {
        const updatedParty = await response.json();
        onUpdate(updatedParty);
        console.log('Party updated successfully');
      } else {
        console.error('Failed to update party:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };

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
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const handleEditParty = (party) => {
    setIsEditing(true);
    setEditParty(party);
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

  // const handleUpdateParty = (updatedParty) => {
  //   setParties(parties.map(party => party._id === updatedParty._id ? updatedParty : party));
  //   setEditingParty(null); // Close the edit form
  // };

  const handleDialogClose = () => {
    setIsEditing(false);
    setEditParty(null);
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
              // Display Skeletons while loading
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
                  <TableCell sx={{ fontSize: "" }}>{party.partySymbol}</TableCell>
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
      {/* {editingParty && <EditPartyForm party={editingParty} onUpdate={handleUpdateParty} />} */}

      <Dialog open={isEditing} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Party</DialogTitle>
        <DialogContent>
          {/* <TextField
            fullWidth
            margin="normal"
            label="Resource Type"
            value={editResource?.type || ''}
            onChange={(e) => setEditResource({ ...editResource, type: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            type="number"
            value={editResource?.quantity || ''}
            onChange={(e) => setEditResource({ ...editResource, quantity: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            value={editResource?.location || ''}
            onChange={(e) => setEditResource({ ...editResource, location: e.target.value })}
          /> */}
          <TextField
            label="Party Name"
            variant="outlined"
            fullWidth
            value={editParty?.partyName || ''}
            onChange={(e) => setPartyName(e.target.value)}
            margin="normal"
            required={true}
          />
          <TextField
            label="Party Leader"
            variant="outlined"
            fullWidth
            value={editParty?.partyLeader || ''}
            onChange={(e) => setPartyLeader(e.target.value)}
            margin="normal"
            required={true}
          />
          <TextField
            label="Party Symbol"
            variant="outlined"
            fullWidth
            value={editParty?.partySymbol || ''}
            onChange={(e) => setPartySymbol(e.target.value)}
            margin="normal"
            required={true}
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
