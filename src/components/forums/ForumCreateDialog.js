import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  OutlinedInput,
  IconButton,
  Box,
  Chip,
  Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ForumCreateDialog = ({ open, onClose, availableBoards, availableClubs }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newForum, setNewForum] = useState({
    title: "",
    category_id: "",
    tags: [],
    public_or_private: "public",
    linked_id: "",
    description: "",
    board_id: "",
    club_id: "",
    imageUrl: "",
  });

  const handleAddTag = (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (newTag.trim() !== "") {
      setNewForum(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag(""); // Clear input field after adding
    }
  };
  
  const handleRemoveTag = (index) => {
    const updatedTags = [...newForum.tags];
    updatedTags.splice(index, 1);
    setNewForum(prev => ({
      ...prev,
      tags: updatedTags
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNewForumChange = (e) => {
    const { name, value } = e.target;
    setNewForum((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateForum = () => {
    console.log("Creating new forum:", newForum);
    // Here you would typically submit the data to your API
    onClose();
  };

  // Sample categories - in a real app, these would come from props or an API
  const categories = [
    { id: "cat1", name: "General Discussion" },
    { id: "cat2", name: "Announcements" },
    { id: "cat3", name: "Q&A" },
  ];

  // Sample events - in a real app, these would come from props or an API
  const events = [
    { id: "e1", name: "Annual Hackathon" },
    { id: "e2", name: "Photography Exhibition" },
    { id: "e3", name: "Music Festival" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create New Discussion</DialogTitle>
      <DialogContent>
        {/* Title */}
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={newForum.title}
          onChange={handleNewForumChange}
          sx={{ mb: 2, mt: 1 }}
        />

        {/* Description */}
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newForum.description}
          onChange={handleNewForumChange}
          sx={{ mb: 2 }}
        />

        {/* Category Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category_id"
            value={newForum.category_id}
            onChange={handleNewForumChange}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          {imagePreview && (
            <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}
        </Grid>

        {/* Tags */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tags</InputLabel>
          <OutlinedInput
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
            label="Tags"
            endAdornment={
              <IconButton onClick={handleAddTag}>
                <AddIcon />
              </IconButton>
            }
          />
          <Box sx={{ mt: 1 }}>
            {newForum.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(index)}
                sx={{ mr: 1, mt: 1 }}
              />
            ))}
          </Box>
        </FormControl>

        {/* Privacy Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Privacy</FormLabel>
          <RadioGroup
            name="public_or_private"
            value={newForum.public_or_private}
            onChange={handleNewForumChange}
            row
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>

        {/* Event/Club/Board Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Link To</InputLabel>
          <Select
            name="linked_id"
            value={newForum.linked_id}
            onChange={handleNewForumChange}
            label="Link To"
          >
            <ListSubheader>Events</ListSubheader>
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
            
            <ListSubheader>Clubs</ListSubheader>
            {Object.entries(availableClubs || {}).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
            
            <ListSubheader>Boards</ListSubheader>
            {Object.entries(availableBoards || {}).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleCreateForum}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForumCreateDialog;