import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", to: "/dashboard", show: !!user },
    { label: "Check Symptoms", to: "/symptom", show: !!user },
    { label: "Profile", to: "/profile", show: !!user },
    { label: "Admin Panel", to: "/admin", show: user?.role === "ADMIN" },
    { label: "Login", to: "/login", show: !user },
    { label: "Register", to: "/register", show: !user },
  ];

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "primary.main",
          fontFamily: "'Roboto Slab', serif",
        }}
      >
        MediMock
      </Typography>
      <List>
        {navLinks.map(
          (link) =>
            link.show && (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  selected={location.pathname === link.to}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            )
        )}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          borderBottom: "3px solid #1976d2",
          fontFamily: "'Roboto Slab', serif",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontFamily: "'Roboto Slab', serif",
            }}
          >
            MediMock
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navLinks.map(
                (link) =>
                  link.show && (
                    <Button
                      key={link.to}
                      component={Link}
                      to={link.to}
                      color="inherit"
                      sx={{
                        borderRadius: "5px",
                        textTransform: "none",
                        fontFamily: "serif",
                        fontSize: 16,
                        fontWeight: 500,
                        backgroundColor:
                          location.pathname === link.to
                            ? "#ffffff33"
                            : "transparent",
                        color: location.pathname === link.to ? "#fff" : "#eee",
                        "&:hover": {
                          backgroundColor: "#ffffff22",
                          color: "#fff",
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  )
              )}
              {user && (
                <Button
                  onClick={handleLogout}
                  color="inherit"
                  sx={{
                    borderRadius: "5px",
                    textTransform: "none",
                    fontFamily: "serif",
                    fontSize: 16,
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#ff174433",
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
