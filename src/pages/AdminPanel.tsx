import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
  TextField,
  MenuItem,
  InputAdornment,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import axios from "../utils/axios";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleRoleSelect = (value: "USER" | "ADMIN" | "ALL") => {
    setRoleFilter(value);
    handleFilterClose();
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 200, flex: 1 },
    { field: "role", headerName: "Role", width: 120, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const currentRole = params.row.role;
        const newRole = currentRole === "USER" ? "ADMIN" : "USER";

        const handleToggle = async () => {
          try {
            const res = await axios.patch(`/users/${params.row.id}/role`, {
              role: newRole,
            });
            setUsers((prev) =>
              prev.map((u) => (u.id === res.data.id ? res.data : u))
            );
            toast.success(`Role changed to ${newRole}`);
          } catch (err) {
            console.error("Failed to update role", err);
            toast.error("Error updating role");
          }
        };

        return (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleToggle}
          >
            Make {newRole}
          </Button>
        );
      },
    },
    {
      field: "deleteUser",
      headerName: "",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const handleDeleteUser = async () => {
          if (!confirm("Are you sure you want to delete this user?")) return;

          try {
            await axios.delete(`/users/${params.row.id}`);
            setUsers((prev) => prev.filter((u) => u.id !== params.row.id));
            toast.success("User deleted successfully");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete user");
          }
        };

        return (
          <Tooltip title="Delete user">
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
            >
              Delete Account
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        fontSize={40}
        fontFamily="roboto serif"
        fontWeight="bold"
        mb={3}
      >
        Registered Users
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          size="medium"
          onClick={handleFilterClick}
          startIcon={<FilterAltIcon />}
          endIcon={<ArrowDropDownIcon />}
          sx={{ textTransform: "capitalize", borderRadius: 1 }}
        >
          Filter
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleFilterClose}>
          <MenuItem onClick={() => handleRoleSelect("ALL")}>All</MenuItem>
          <MenuItem onClick={() => handleRoleSelect("USER")}>User</MenuItem>
          <MenuItem onClick={() => handleRoleSelect("ADMIN")}>Admin</MenuItem>
        </Menu>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 460, width: "100%" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.id}
            disableColumnResize
            disableColumnMenu
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
