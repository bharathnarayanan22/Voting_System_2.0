import React, { useState } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MapIcon from "@mui/icons-material/Map";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ListItemText from "@mui/material/ListItemText";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EnrollVoterForm from "./EnrollVoterForm";
import EnrollPartyForm from "./EnrollPartyForm";
import ViewPartyPage from "./ViewPartyPage";
import ViewVoterPage from "./ViewVoterPage";
import RegionForm from "./RegionForm";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import p1 from "../assets/pngegg (7).png";
import p2 from "../assets/pngegg (6).png";
import p3 from "../assets/pngegg (9).png";
import p4 from "../assets/pngegg (4).png";
import p5 from "../assets/pngegg (12).png";
import p6 from "../assets/pngegg (2).png";
import chakra from "../assets/chakra.png";
import ViewRegions from "./ViewRegions";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const StyledList = styled(List)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

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

export default function OrganizerDashboard() {
  const [open, setOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (view) => {
    setSelectedView(view);
  };

  const handleCardClick = (view) => {
    setSelectedView(view);
    setOpen(false);
  };
  const handleHomeClick = () => {
    navigate("/home");
  };
  const selectedStyle = {
    backgroundColor: "#138808",
    color: "white",
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${chakra})`,
            backgroundPosition: "center",
            backgroundSize: "contain", // Adjust 'contain' or 'cover' as per your preference
            backgroundRepeat: "no-repeat",
            opacity: 0.5, // Adjust opacity as needed (0.0 to 1.0)
            height: "100%", // Adjust the height of the background image
            width: "100%", // Adjust the width of the background image
            position: "absolute",
            // Adjust left position to center horizontally
            zIndex: -1, // Ensure the background image is behind the content
          }}
        />

        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="white">
              Organizer Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <Box>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose} color="inherit">
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <StyledList>
              <ListItemButton
                onClick={() => handleMenuItemClick("createRegion")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "createRegion" && selectedStyle),
                }}
              >
                <AddLocationIcon />
                <ListItemText primary="Create Region" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuItemClick("enrollVoter")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "enrollVoter" && selectedStyle),
                }}
              >
                <PersonAddIcon />
                <ListItemText primary="Enroll Voter" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuItemClick("enrollParty")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "enrollParty" && selectedStyle),
                }}
              >
                <GroupAddIcon />
                <ListItemText primary="Enroll Party" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuItemClick("viewRegions")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "viewRegions" && selectedStyle),
                }}
              >
                <MapIcon />
                <ListItemText primary="View Regions" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuItemClick("viewVoters")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "viewVoters" && selectedStyle),
                }}
              >
                <PeopleAltIcon />
                <ListItemText primary="View Voters" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuItemClick("viewParties")}
                sx={{
                  "&:hover": { backgroundColor: "#138808", color: "white" },
                  gap: "15%",
                  ...(selectedView === "viewParties" && selectedStyle),
                }}
              >
                <GroupsIcon />
                <ListItemText primary="View Parties" />
              </ListItemButton>
            </StyledList>
          </Box>
          <Box sx={{ marginTop: "auto" }}>
            <Divider />
            <ListItemButton
              onClick={handleHomeClick}
              sx={{
                "&:hover": { backgroundColor: "#138808", color: "white" },
                gap: "15%",
              }}
            >
              <ExitToAppIcon />

              <ListItemText primary="Back to Home" />
            </ListItemButton>
          </Box>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />
          {selectedView === null && (
            <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              gap: 12,
              padding: 5,
            }}
          >
            {/* Create Region Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("createRegion")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p6} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  Create Region
                </Typography>
              </CardContent>
            </Card>
          
            {/* Enroll Voter Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("enrollVoter")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p2} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  Enroll Voter
                </Typography>
              </CardContent>
            </Card>
          
            {/* Enroll Party Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("enrollParty")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p3} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  Enroll Party
                </Typography>
              </CardContent>
            </Card>
          
            {/* View Regions Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("viewRegions")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p5} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  View Regions
                </Typography>
              </CardContent>
            </Card>
          
            {/* View Voters Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("viewVoters")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p1} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  View Voters
                </Typography>
              </CardContent>
            </Card>
          
            {/* View Parties Card */}
            <Card
              sx={{
                backgroundColor: "#138808",
                width: { xs: "100%", sm: "50%", md: "30%", lg: "20%" },
                borderRadius: 5,
                padding: 2,
              }}
              onClick={() => handleCardClick("viewParties")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 50, sm: 75, md: 100 },
                      width: { xs: "33%", sm: "44%", md: "100%" },
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                    image={p4} // Same image used for all cards
                    alt="Icon"
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="white"
                  textAlign="center"
                  sx={{ marginTop: 2 }}
                >
                  View Parties
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          )}
          {selectedView === "createRegion" && <RegionForm />}
          {selectedView === "enrollVoter" && <EnrollVoterForm />}
          {selectedView === "enrollParty" && <EnrollPartyForm />}
          {selectedView === "viewRegions" && <ViewRegions />}
          {selectedView === "viewVoters" && <ViewVoterPage />}
          {selectedView === "viewParties" && <ViewPartyPage />}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
