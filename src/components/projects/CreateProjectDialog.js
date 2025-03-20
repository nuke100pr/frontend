"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
} from "@mui/material";

const CreateProjectDialog = ({ open, onClose, onSubmit }) => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    club_id: "",
    board_id: "",
    start_date: "",
    end_date: "",
    status: "Running",
    members: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(newProject);
    // Reset form
    setNewProject({
      title: "",
      description: "",
      club_id: "",
      board_id: "",
      start_date: "",
      end_date: "",
      status: "Running",
      members: [],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Project Title"
            name="title"
            value={newProject.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newProject.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="subtitle1">Club</Typography>
              <RadioGroup
                name="club_id"
                value={newProject.club_id}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="club123"
                  control={<Radio />}
                  label="Club 123"
                />
                <FormControlLabel
                  value="club789"
                  control={<Radio />}
                  label="Club 789"
                />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="subtitle1">Board</Typography>
              <RadioGroup
                name="board_id"
                value={newProject.board_id}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="board456"
                  control={<Radio />}
                  label="Board 456"
                />
                <FormControlLabel
                  value="board012"
                  control={<Radio />}
                  label="Board 012"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              name="start_date"
              type="date"
              value={newProject.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              name="end_date"
              type="date"
              value={newProject.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          <FormControl fullWidth>
            <Typography variant="subtitle1">Status</Typography>
            <RadioGroup
              name="status"
              value={newProject.status}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Running"
                control={<Radio />}
                label="Running"
              />
              <FormControlLabel
                value="Standby"
                control={<Radio />}
                label="Standby"
              />
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectDialog;