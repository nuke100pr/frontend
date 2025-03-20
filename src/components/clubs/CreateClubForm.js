"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreateClubForm = ({ open, onClose, boards, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    board_id: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        board_id: "",
        image: null
      });
      setImagePreview(null);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Club</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              label="Club Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              required
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            
            <FormControl fullWidth required>
              <InputLabel id="board-select-label">Board</InputLabel>
              <Select
                labelId="board-select-label"
                name="board_id"
                value={formData.board_id}
                onChange={handleChange}
                label="Board"
              >
                {Object.entries(boards).map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Club Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img 
                    src={imagePreview} 
                    alt="Club preview" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "200px", 
                      borderRadius: "8px"
                    }} 
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Create Club</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClubForm;