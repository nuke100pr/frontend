"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";

const CreateResourceDialog = ({ open, handleClose, handleSubmit }) => {
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    expiry_date: "",
    external_link: "",
    status: "active",
    category: "my clubs",
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity({
      ...newOpportunity,
      [name]: value,
    });
  };

  const handleAddKeyword = () => {
    if (keywordInput && !newOpportunity.keywords.includes(keywordInput)) {
      setNewOpportunity({
        ...newOpportunity,
        keywords: [...newOpportunity.keywords, keywordInput],
      });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setNewOpportunity({
      ...newOpportunity,
      keywords: newOpportunity.keywords.filter((k) => k !== keyword),
    });
  };

  const onSubmit = () => {
    handleSubmit(newOpportunity);
    // Reset form
    setNewOpportunity({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      expiry_date: "",
      external_link: "",
      status: "active",
      category: "my clubs",
      keywords: [],
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Create New Opportunity
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newOpportunity.title}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newOpportunity.description}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newOpportunity.start_date}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newOpportunity.end_date}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiry_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newOpportunity.expiry_date}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="External Link"
              name="external_link"
              value={newOpportunity.external_link}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={newOpportunity.category}
                onChange={handleFormChange}
              >
                <MenuItem value="my clubs">My Clubs</MenuItem>
                <MenuItem value="my boards">My Boards</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                label="Add Keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddKeyword}>
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newOpportunity.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateResourceDialog;