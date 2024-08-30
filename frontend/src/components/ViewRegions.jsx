import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Box,
  TableContainer,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewRegions = () => {
  const [regions, setRegions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRegion, setEditRegion] = useState(null);
  const [regionName, setRegionName] = useState('');
  const [numberOfVoters, setNumberOfVoters] = useState('');
  const [numberOfParties, setNumberOfParties] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch('http://localhost:3000/regions');
      if (response.ok) {
        const data = await response.json();
        setRegions(data.regions);
      } else {
        console.error('Failed to fetch regions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRegion = (region) => {
    setIsEditing(true);
    setEditRegion(region);
    setRegionName(region.name);
    setNumberOfVoters(region.voters.length);
    setNumberOfParties(region.parties.length); 
  };

  const handleUpdateRegion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${editRegion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regionName,
          voters: numberOfVoters,
          parties: numberOfParties
        }),
      });

      if (response.ok) {
        const updatedRegion = await response.json();
        setRegions(regions.map(region => region._id === updatedRegion._id ? updatedRegion : region));
        console.log('Region updated successfully');
        handleDialogClose(); // Close the dialog after updating
      } else {
        console.error('Failed to update region:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating region:', error);
    }
  };

  const handleDeleteRegion = async (regionId) => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${regionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRegions(regions.filter(region => region._id !== regionId));
        console.log('Region deleted successfully');
      } else {
        console.error('Failed to delete region:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting region:', error);
    }
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    setEditRegion(null);
    setRegionName('');
    setNumberOfVoters('');
    setNumberOfParties('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ color: '#121481', fontWeight: 'bold' }}>
        Regions Registered
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#138808' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Region Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Number of Voters</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Number of Parties</TableCell>
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
              regions.map((region) => (
                <TableRow key={region._id}>
                  <TableCell>{region.name}</TableCell>
                  <TableCell>{region.voters.length}</TableCell>
                  <TableCell>{region.parties.length}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditRegion(region)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteRegion(region._id)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isEditing} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Region</DialogTitle>
        <DialogContent>
          <TextField
            label="Region Name"
            variant="outlined"
            fullWidth
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            margin="normal"
            required
          />
          {/* <TextField
            label="Number of Voters"
            variant="outlined"
            fullWidth
            type="number"
            value={numberOfVoters}
            onChange={(e) => setNumberOfVoters(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Number of Parties"
            variant="outlined"
            fullWidth
            type="number"
            value={numberOfParties}
            onChange={(e) => setNumberOfParties(e.target.value)}
            margin="normal"
            required
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateRegion} variant="contained" color="primary">
            Update Region
          </Button>
          <Button onClick={handleDialogClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewRegions;
