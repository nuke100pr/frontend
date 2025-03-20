"use client";
import React, { useState, useEffect, useContext } from "react";
import noteContext from "../../contexts/noteContext";
import SearchAndFilter from "../../components/opportunities/SearchAndFilter";
import CreateResourceDialog from "../../components/opportunities/CreateResourceDialog";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Chip,
  Box,
  IconButton,
  Paper,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../../components/Navbar";

const sampleOpportunities = [
  {
    _id: "1",
    title: "Hackathon 2025",
    description: "A nationwide hackathon for students.",
    expiry_date: "2025-05-20",
    status: "active",
    external_link: "https://hackathon.com",
    start_date: "2025-04-15",
    end_date: "2025-05-15",
    keywords: ["coding", "AI", "development"],
    category: "my clubs",
  },
  {
    _id: "2",
    title: "Research Internship",
    description: "A summer internship in AI research.",
    expiry_date: "2025-06-30",
    status: "active",
    external_link: "https://research-intern.com",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    keywords: ["ML", "research", "internship"],
    category: "my boards",
  },
];

// Extract all unique keywords for filter
const allKeywords = Array.from(
  new Set(sampleOpportunities.flatMap((opportunity) => opportunity.keywords))
);

const OPPORTUNITIES = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const info = useContext(noteContext);
  const value2 = info.info;

  // Load opportunities on mount
  useEffect(() => {
    setOpportunities(sampleOpportunities);
  }, []);

  const handleEdit = (id) => {
    console.log("Edit opportunity with ID:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete opportunity with ID:", id);
  };

  const handleCreate = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleSubmitDialog = (newOpportunity) => {
    // Add new opportunity to the list with a unique ID
    const newOpportunityWithId = {
      ...newOpportunity,
      _id: `${opportunities.length + 1}`,
    };

    setOpportunities([...opportunities, newOpportunityWithId]);
    setOpenCreateDialog(false);
  };

  // Filter opportunities based on search term, category and keywords
  const filteredOpportunities = opportunities.filter((opportunity) => {
    // Text search filter
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryFilter === "all" || opportunity.category === categoryFilter;

    // Keywords filter
    const matchesKeywords =
      selectedKeywords.length === 0 ||
      opportunity.keywords.some((keyword) =>
        selectedKeywords.includes(keyword)
      );

    return matchesSearch && matchesCategory && matchesKeywords;
  });

  return (
    <div>
      <Navbar/>
    <Box>
      {/* Search and Filter Component */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        selectedKeywords={selectedKeywords}
        setSelectedKeywords={setSelectedKeywords}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        allKeywords={allKeywords}
      />

      {/* Content Container */}
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {/* Opportunities Grid */}
        <Grid container spacing={3} justifyContent="center">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <Grid item key={opportunity._id} xs={12} sm={6} md={4}>
                <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6">{opportunity.title}</Typography>
                      {value2.user_role === "super_admin" && (
                        <Box>
                          <IconButton
                            onClick={() => handleEdit(opportunity._id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(opportunity._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {opportunity.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Start:</strong> {opportunity.start_date}
                    </Typography>
                    <Typography variant="body2">
                      <strong>End:</strong> {opportunity.end_date}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Status:</strong>{" "}
                      {opportunity.status.toUpperCase()}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, flexWrap: "wrap" }}
                    >
                      {opportunity.keywords.map((keyword) => (
                        <Chip
                          key={keyword}
                          label={keyword}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Stack>
                    <Button
                      variant="contained"
                      color="primary"
                      href={opportunity.external_link}
                      target="_blank"
                      sx={{ mt: 2, width: "100%" }}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No opportunities matching your search criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Add Opportunity FAB */}
      {value2.user_role === "super_admin" && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreate}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create Opportunity Dialog Component */}
      <CreateResourceDialog
        open={openCreateDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmitDialog}
      />
    </Box>
    </div>
  );
};

export default OPPORTUNITIES;