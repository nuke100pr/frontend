"use client";
import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const EventForm = ({
  open,
  onClose,
  onSubmit,
  initialData = {
    name: "",
    owner: "",
    date: "",
    venue: "",
    type: "Session",
    description: "",
  },
  title = "Add New Event",
  submitButtonText = "Create Event",
  eventTypes = ["Session", "Competition", "Workshop", "Meeting"],
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [videoPreview, setVideoPreview] = useState(initialData.video || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setVideoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setImagePreview(initialData.image || null);
    setVideoPreview(initialData.video || null);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      image: imagePreview,
      video: videoPreview,
    });
    resetForm();
  };

  const isFormValid = () => {
    // Customize validation requirements as needed
    return formData.name && formData.venue;
  };

  return (
    <Dialog open={open} onClose={resetForm} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Event Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="owner"
              label="Organizer/Club"
              fullWidth
              value={formData.owner}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="venue"
              label="Venue"
              fullWidth
              value={formData.venue}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="event-type-label">Event Type</InputLabel>
              <Select
                labelId="event-type-label"
                name="type"
                value={formData.type}
                label="Event Type"
                onChange={handleInputChange}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 1 }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <FormHelperText>
              Upload an image for the event (optional)
            </FormHelperText>

            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Grid>

          {/* Video Upload */}
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 1 }}
            >
              Upload Video
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoChange}
              />
            </Button>
            <FormHelperText>
              Upload a video for the event (optional)
            </FormHelperText>

            {videoPreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <video
                  controls
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                >
                  <source src={videoPreview} />
                  Your browser does not support the video tag.
                </video>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetForm}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid()}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;
