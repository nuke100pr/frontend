"use client";
import { useState, useContext } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EventsSearchBar from "../../components/events/EventsSearchBar"; // Import the new component
import EventForm from "../../components/events/EventForm";

//Hello

const filters = [
  "My Clubs",
  "My Boards",
  "Week",
  "Month",
  "Year",
  "My Registered Events",
];
const eventTypes = ["Session", "Competition", "Workshop", "Meeting"];
const typeColors = {
  Session: "#4CAF50",
  Competition: "#FF5722",
  Workshop: "#9C27B0",
  Meeting: "#2196F3",
};

export default function EVENTS() {
  const {
    info: { user_role },
  } = useContext(noteContext);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Event 1",
      owner: "Club A",
      date: "13/3/25",
      venue: "Hall 1",
      registered: false,
      type: "Session",
      image: null,
    },
    {
      id: 2,
      name: "Event 2",
      owner: "Club B",
      date: "13/3/25",
      venue: "Hall 2",
      registered: true,
      type: "Competition",
      image: null,
    },
    {
      id: 3,
      name: "Event 3",
      owner: "Club C",
      date: "14/3/25",
      venue: "Online",
      registered: false,
      type: "Session",
      image: null,
    },
  ]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFilterChange = (event) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setCurrentEvent(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleFormSubmit = (formData) => {
    if (isEditing && currentEvent) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === currentEvent.id ? { ...formData, id: event.id, registered: event.registered } : event
        )
      );
    } else {
      // Add new event
      const newId = Math.max(0, ...events.map((event) => event.id)) + 1;
      setEvents([
        ...events,
        { ...formData, id: newId, registered: false },
      ]);
    }
  };

  // Apply filters and search
  const filteredEvents = events.filter((event) => {
    // Text search filter
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply additional filters if any are selected
    const hasActiveFilters = Object.values(selectedFilters).some(Boolean);
    
    if (!hasActiveFilters) {
      return matchesSearch;
    }
    
    // Example of handling specific filters
    const matchesRegisteredFilter = selectedFilters["My Registered Events"] ? event.registered : true;
    
    // You'd need to implement additional filter logic based on your requirements
    // For example, filtering by date for Week/Month/Year filters
    
    return matchesSearch && matchesRegisteredFilter;
  });

  const isAdmin = user_role === "super_admin" || user_role === "club_admin";

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 2, position: "relative", minHeight: "80vh" }}
    >
      {/* New Search Bar Component */}
      <EventsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        filters={filters}
        clearFilters={clearFilters}
      />

      <Grid container spacing={2}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card elevation={1} sx={{ height: "100%" }}>
              {event.image && (
                <Box sx={{ height: 140, overflow: "hidden" }}>
                  <img
                    src={event.image}
                    alt={event.name}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                </Box>
              )}
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{event.name}</Typography>
                  {user_role === "super_admin" && (
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(event)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(event.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Chip
                  label={event.type}
                  size="small"
                  sx={{
                    backgroundColor: typeColors[event.type],
                    color: "white",
                    mt: 0.5,
                  }}
                />
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Owner:</strong> {event.owner}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {event.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Venue:</strong> {event.venue}
                  </Typography>
                </Box>
                <Button
                  variant={event.registered ? "contained" : "outlined"}
                  fullWidth
                  color={event.registered ? "success" : "primary"}
                >
                  {event.registered ? "Registered" : "Register"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Button */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNew}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 3,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Event Form Dialog */}
      <EventForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleFormSubmit}
        initialData={currentEvent || {
          name: "",
          owner: "",
          date: "",
          venue: "",
          type: "Session",
          description: "",
        }}
        title={isEditing ? "Edit Event" : "Add New Event"}
        submitButtonText={isEditing ? "Update Event" : "Create Event"}
        eventTypes={eventTypes}
      />
    </Container>
  );
}