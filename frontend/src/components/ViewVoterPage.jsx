import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Typography,
  IconButton,
  Box,
  Skeleton,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";

const ViewVoterPage = () => {
  const [voters, setVoters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  useEffect(() => {
    fetchVoters();
    fetchRegions();
  }, []);

  useEffect(() => {
    filterVoters();
  }, [searchQuery, filterRegion, voters]);

  const fetchVoters = async () => {
    try {
      const response = await fetch("http://localhost:3000/voters");
      if (response.ok) {
        const data = await response.json();
        setVoters(data.voters);
      } else {
        console.error("Failed to fetch voters:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await fetch("http://localhost:3000/regions");
      if (response.ok) {
        const data = await response.json();
        setRegions(data.regions);
      } else {
        console.error("Failed to fetch regions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const filterVoters = () => {
    let updatedVoters = voters;

    if (searchQuery) {
      updatedVoters = updatedVoters.filter((voter) =>
        voter.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRegion) {
      updatedVoters = updatedVoters.filter(
        (voter) => voter.regionId === filterRegion
      );
    }

    setFilteredVoters(updatedVoters);
  };

  const handleDeleteVoter = async (voterId) => {
    try {
      const response = await fetch(`http://localhost:3000/voters/${voterId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove the deleted voter from the state
        setVoters(voters.filter((voter) => voter._id !== voterId));
        console.log("Voter deleted successfully");
      } else {
        console.error("Failed to delete voter:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Playfair Display",
          fontStyle: "italic",
          fontWeight: 900,
          color: "#121481",
        }}
      >
        Voters Registered
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Search by Voter Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
        />
        <Select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          displayEmpty
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="">
            <em>All Regions</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region._id} value={region._id}>
              {region.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="voters table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#138808" }}>
              <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Voter
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Mobile Number
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Region
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
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
              filteredVoters.map((voter) => (
                <TableRow key={voter._id}>
                  <TableCell component="th" scope="row">
                    {voter.label}
                  </TableCell>
                  <TableCell align="center">{voter.mobile_number}</TableCell>
                  <TableCell align="center">
                    {regions.find((region) => region._id === voter.regionId)
                      ?.name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteVoter(voter._id)}
                      style={{ color: "#FF9933" }}
                      sx={{ "&:hover": { color: "blue" } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewVoterPage;
