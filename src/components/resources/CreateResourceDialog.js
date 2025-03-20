import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Button, Chip
} from "@mui/material";

const CreateResourceDialog = ({ open, onClose, onCreateResource }) => {
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    keywords: [],
    publishedBy: "",
    url: "",
  });
  const [newKeyword, setNewKeyword] = useState("");

  const handleNewResourceChange = (field) => (event) => {
    setNewResource({ ...newResource, [field]: event.target.value });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !newResource.keywords.includes(newKeyword.trim())) {
      setNewResource({
        ...newResource,
        keywords: [...newResource.keywords, newKeyword.trim()]
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setNewResource({
      ...newResource,
      keywords: newResource.keywords.filter(k => k !== keyword)
    });
  };

  const handleCreateResource = () => {
    // Form validation
    if (!newResource.title || !newResource.description || !newResource.url) {
      alert("Please fill in all required fields.");
      return;
    }

    // Submit the new resource
    onCreateResource(newResource);
    
    // Reset form
    setNewResource({
      title: "",
      description: "",
      keywords: [],
      publishedBy: "",
      url: "",
    });
    setNewKeyword("");
  };

  const handleClose = () => {
    // Reset form on close
    setNewResource({
      title: "",
      description: "",
      keywords: [],
      publishedBy: "",
      url: "",
    });
    setNewKeyword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Resource</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            value={newResource.title}
            onChange={handleNewResourceChange("title")}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={newResource.description}
            onChange={handleNewResourceChange("description")}
            fullWidth
            required
            multiline
            rows={4}
          />
          <TextField
            label="Published By"
            value={newResource.publishedBy}
            onChange={handleNewResourceChange("publishedBy")}
            fullWidth
            required
          />
          <TextField
            label="URL"
            value={newResource.url}
            onChange={handleNewResourceChange("url")}
            fullWidth
            required
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              label="Add Keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
            <Button variant="contained" onClick={handleAddKeyword}>Add</Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {newResource.keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => handleRemoveKeyword(keyword)}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateResource} variant="contained" color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateResourceDialog;