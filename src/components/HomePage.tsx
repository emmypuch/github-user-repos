import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!username) {
      toast.error("Please enter a GitHub username!");
      return;
    }

    setLoading(true);

    try {
      // Making an API call to check if the username exists
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );

      // And if the user exists, I navigate to the result page
      toast.success("Search successful!");
      navigate(`/results?username=${username}`);
    } catch (error) {
      // Handle error if the user is does not exist or if there is an issue with the API call
      toast.error("No results found for this username!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container>
        <Typography variant="h3" gutterBottom>
          GitHub User Repositories and Organizations
        </Typography>
        <TextField
          label="GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={!username || loading}
        >
          Search
        </Button>
        {loading && <CircularProgress style={{ margin: "20px" }} />}
        <ToastContainer />
      </Container>
    </Box>
  );
};

export default HomePage;
