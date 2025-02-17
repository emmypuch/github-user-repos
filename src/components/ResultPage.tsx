import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";

interface Repo {
  id: number;
  name: string;
  description: string;
}

interface Org {
  id: number;
  login: string;
}

const ResultPage = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgMessage, setOrgMessage] = useState("");
  const [repoPage, setRepoPage] = useState(0);
  const [repoRowsPerPage, setRepoRowsPerPage] = useState(5);
  const [orgPage, setOrgPage] = useState(0);
  const [orgRowsPerPage, setOrgRowsPerPage] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get("username");

    if (username) {
      setLoading(true);
      // Fetch repositories and organizations
      Promise.all([
        axios.get(`https://api.github.com/users/${username}/repos`),
        axios.get(`https://api.github.com/users/${username}/orgs`),
      ])
        .then(([reposResponse, orgsResponse]) => {
          setRepos(reposResponse.data);
          setOrgs(orgsResponse.data);
          if (orgsResponse.data.length === 0) {
            setOrgMessage("No public organizations found for this user.");
          } else {
            setOrgMessage("");
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setOrgMessage("An error occurred while fetching data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  const handleRepoChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setRepoPage(newPage);
  };

  const handleRepoChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRepoRowsPerPage(parseInt(event.target.value, 10));
    setRepoPage(0);
  };

  const handleOrgChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setOrgPage(newPage);
  };

  const handleOrgChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrgRowsPerPage(parseInt(event.target.value, 10));
    setOrgPage(0);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress style={{ margin: "20px" }} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Repositories
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repos
                  .slice(
                    repoPage * repoRowsPerPage,
                    repoPage * repoRowsPerPage + repoRowsPerPage
                  )
                  .map((repo) => (
                    <TableRow key={repo.id}>
                      <TableCell>{repo.name}</TableCell>
                      <TableCell>
                        {repo.description || "No description"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={repos.length}
            rowsPerPage={repoRowsPerPage}
            page={repoPage}
            onPageChange={handleRepoChangePage}
            onRowsPerPageChange={handleRepoChangeRowsPerPage}
          />
          <Typography variant="h4" gutterBottom>
            Organizations
          </Typography>
          {orgMessage && <Typography>{orgMessage}</Typography>}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orgs
                  .slice(
                    orgPage * orgRowsPerPage,
                    orgPage * orgRowsPerPage + orgRowsPerPage
                  )
                  .map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>{org.login}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orgs.length}
            rowsPerPage={orgRowsPerPage}
            page={orgPage}
            onPageChange={handleOrgChangePage}
            onRowsPerPageChange={handleOrgChangeRowsPerPage}
          />
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackClick}
        style={{ marginBottom: "20px" }}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default ResultPage;
