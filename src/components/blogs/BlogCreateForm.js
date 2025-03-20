// BlogCreateForm.js
import React, { useState } from "react";
import {
  Box, TextField, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions
} from "@mui/material";

const BlogCreateForm = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    content: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      imagePreview: imagePreview
    });
    
    // Reset form after submission
    setFormData({
      title: "",
      publisher: "",
      content: "",
      image: ""
    });
    setImagePreview("");
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      title: "",
      publisher: "",
      content: "",
      image: ""
    });
    setImagePreview("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Create New Blog</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.title || !formData.publisher}
        >
          Create Blog
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogCreateForm;