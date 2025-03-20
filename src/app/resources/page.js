"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Box, Container, Grid, Typography, Card, CardContent, Button, Chip,
  IconButton, Tooltip, Fab, Tabs, Tab
} from "@mui/material";
import {
  Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon, Add as AddIcon
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import noteContext from "../../contexts/noteContext";
import SearchAndFilterBar from "../../components/resources/SearchAndFilterBar";
import CreateResourceDialog from "../../components/resources/CreateResourceDialog";

// Mock data
const mockResources = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    description: "A comprehensive guide to building applications with Next.js",
    keywords: ["Next.js", "React", "Web Development"],
    publishedBy: "Vercel Team",
    publishedAt: "2025-01-15T12:00:00Z",
    url: "https://nextjs.org/docs",
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    description: "Understand the power and potential of React Hooks",
    keywords: ["React", "Hooks", "Frontend"],
    publishedBy: "React Community",
    publishedAt: "2025-02-20T15:30:00Z",
    url: "https://reactjs.org/docs/hooks-intro.html",
  },
  {
    id: "3",
    title: "Tailwind CSS Tutorial",
    description: "Learn how to quickly build modern websites with Tailwind CSS",
    keywords: ["CSS", "Tailwind", "Styling"],
    publishedBy: "Tailwind Labs",
    publishedAt: "2025-03-05T09:45:00Z",
    url: "https://tailwindcss.com/docs",
  },
];

const ResourceCards = () => {
  const [allResources, setAllResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { info: value2 } = useContext(noteContext);

  // Extract unique keywords
  const allKeywords = [...new Set(allResources.flatMap(resource => resource.keywords))];

  // Initialize resources
  useEffect(() => {
    setAllResources(mockResources);
    const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
    setSavedResources(mockResources.filter(resource => savedIds.includes(resource.id)));
  }, []);

  // Filter resources when dependencies change
  useEffect(() => {
    const baseResources = activeTab === "all" ? allResources : savedResources;
    let result = baseResources;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search) ||
        resource.keywords.some(keyword => keyword.toLowerCase().includes(search))
      );
    }

    // Apply keyword filters
    if (selectedKeywords.length > 0) {
      result = result.filter(resource => 
        resource.keywords.some(keyword => selectedKeywords.includes(keyword))
      );
    }

    setFilteredResources(result);
  }, [searchTerm, activeTab, allResources, savedResources, selectedKeywords]);

  // Resource management functions
  const saveResource = (resourceId) => {
    const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
    if (!savedIds.includes(resourceId)) {
      const newSavedIds = [...savedIds, resourceId];
      localStorage.setItem("savedResources", JSON.stringify(newSavedIds));
      setSavedResources(prev => [...prev, allResources.find(r => r.id === resourceId)]);
    }
  };

  const unsaveResource = (resourceId) => {
    const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
    const newSavedIds = savedIds.filter(id => id !== resourceId);
    localStorage.setItem("savedResources", JSON.stringify(newSavedIds));
    setSavedResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  const shareResource = (resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url,
      }).catch(error => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(resource.url)
        .then(() => alert("Link copied to clipboard: " + resource.url))
        .catch(err => console.error("Failed to copy link: ", err));
    }
  };

  const handleEdit = (resourceId) => console.log(`Edit resource ${resourceId}`);
  const handleDelete = (resourceId) => console.log(`Delete resource ${resourceId}`);

  const handleCreateResource = (newResource) => {
    // Create new resource with unique ID and current date
    const createdResource = {
      ...newResource,
      id: (Date.now().toString(36) + Math.random().toString(36).substring(2)),
      publishedAt: new Date().toISOString()
    };

    // Add to resources
    setAllResources(prev => [...prev, createdResource]);
    setCreateDialogOpen(false);
  };

  const handleFilterReset = () => {
    setSelectedKeywords([]);
    setFilterActive(false);
  };

  return (
    <Box>
      {/* Search and Filter Bar */}
      <SearchAndFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allKeywords={allKeywords}
        selectedKeywords={selectedKeywords}
        setSelectedKeywords={setSelectedKeywords}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        handleFilterReset={handleFilterReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allResourcesCount={allResources.length}
        savedResourcesCount={savedResources.length}
      />

      {/* Resource Grid */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => {
              const isSaved = savedResources.some(r => r.id === resource.id);
              
              return (
                <Grid item key={resource.id} xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                    {value2.user_role === "super_admin" && (
                      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                        <IconButton onClick={() => handleEdit(resource.id)} color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(resource.id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {resource.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>

                      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {resource.keywords.map((keyword, index) => (
                          <Chip key={index} label={keyword} size="small" />
                        ))}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Published by: {resource.publishedBy}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Published at: {new Date(resource.publishedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        View Resource
                      </Button>

                      <Box display="flex" alignItems="center">
                        <Tooltip title="Share resource">
                          <IconButton onClick={() => shareResource(resource)} color="primary">
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant="contained"
                          color={isSaved ? "error" : "success"}
                          startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                          onClick={() => isSaved ? unsaveResource(resource.id) : saveResource(resource.id)}
                          size="medium"
                        >
                          {isSaved ? "Unsave" : "Save"}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", width: "100%", mt: 4 }}>
              No resources found
            </Typography>
          )}
        </Grid>
      </Container>

      {/* Create Resource Dialog */}
      <CreateResourceDialog 
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateResource={handleCreateResource}
      />

      {/* Floating Action Button for Creating Resources */}
      {value2.user_role === "super_admin" && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ResourceCards;