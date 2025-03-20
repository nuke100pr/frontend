"use client";
import { useState, useContext } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchAndFilter from "../../components/projects/SearchAndFilter";
import CreateProjectDialog from "../../components/projects/CreateProjectDialog";
import Navbar from "../../components/Navbar";

const sampleProjects = [
  {
    _id: "1",
    club_id: "club123",
    board_id: "board456",
    start_date: "2024-01-10",
    status: "Running",
    end_date: "2024-06-30",
    created_on: "2024-01-01",
    title: "AI Research Project",
    description: "Developing an AI model for image recognition.",
    members: ["Alice", "Bob", "Charlie"],
  },
  {
    _id: "2",
    club_id: "club789",
    board_id: "board012",
    start_date: "2023-09-15",
    status: "Completed",
    end_date: "2024-02-10",
    created_on: "2023-09-01",
    title: "Web App Development",
    description: "Building a full-stack web application for students.",
    members: ["David", "Eve", "Frank"],
  },
];

const PROJECTS = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    club: null,
    board: null,
    status: null,
  });
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  
  const info = useContext(noteContext);
  const value2 = info.info;

  const handleEdit = (id) => {
    console.log("Edit project with ID:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete project with ID:", id);
  };
  
  const handleAddProjectOpen = () => {
    setAddProjectOpen(true);
  };
  
  const handleAddProjectClose = () => {
    setAddProjectOpen(false);
  };
  
  const handleAddProjectSubmit = (project) => {
    console.log("Adding new project:", project);
    // Here you would add logic to save the new project
    handleAddProjectClose();
  };

  const handleSearchChange = (searchText) => {
    setSearch(searchText);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProjects = sampleProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.club || project.club_id === filters.club) &&
      (!filters.board || project.board_id === filters.board) &&
      (!filters.status || project.status === filters.status)
  );

  return (
    <div>
      <Navbar/>
    <>
      <SearchAndFilter 
        onSearchChange={handleSearchChange} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Project Cards */}
      <Grid container spacing={2}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{project.title}</Typography>
                  {value2.user_role === "super_admin" && (
                    <Box>
                      <IconButton onClick={() => handleEdit(project._id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(project._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Status: {project.status}
                </Typography>
                <Typography variant="body2">{project.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Add Project Dialog Component */}
      <CreateProjectDialog 
        open={addProjectOpen}
        onClose={handleAddProjectClose}
        onSubmit={handleAddProjectSubmit}
      />
      
      {/* Floating Action Button for adding a new project */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddProjectOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </>
    </div>
  );
};

export default PROJECTS;