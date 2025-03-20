"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Container, Grid, Typography, Box, FormControl, FormControlLabel, 
  Radio, RadioGroup, Button, Fab, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import noteContext from "../../contexts/noteContext";
import BlogCard from "../../components/blogs/BlogCard"; // Import the BlogCard component
import SearchBar from "../../components/blogs/SearchBar"; // Import the SearchBar component
import BlogCreateForm from "../../components/blogs/BlogCreateForm"; // Import the BlogCreateForm component

// Sample blog data
const sampleBlogs = [
  { id: 1, title: "E-Cell Alumni in Forbes 30 under 30", image: "/images/forbes.jpg", publisher: "E-Cell IIT Ropar", publishDate: "2024-02-15", views: 1542 },
  { id: 2, title: "Everything about Tesla entering India", image: "/images/tesla.jpg", publisher: "Business Times", publishDate: "2024-03-02", views: 2378 },
  // ... other blog data
].map(blog => ({...blog, creator: "IIT ROPAR", creatorType: "Creating Job Creators"}));

export default function Blogs() {
  const { info } = useContext(noteContext);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [newBlogOpen, setNewBlogOpen] = useState(false);

  // Extract unique publishers for filter
  const uniquePublishers = React.useMemo(() => 
    [...new Set(blogs.map(blog => blog.publisher))], 
    [blogs]
  );

  useEffect(() => {
    // Set initial blogs
    setBlogs(sampleBlogs);
  }, []);

  useEffect(() => {
    // Filter blogs when search query or filters change
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = blogs.filter(blog => {
      // Text search
      const matchesSearchQuery = query === "" || 
        blog.title.toLowerCase().includes(query) || 
        blog.publisher.toLowerCase().includes(query);
      
      // Publisher filter
      const matchesPublisher = !selectedPublisher || blog.publisher === selectedPublisher;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter) {
        const blogDate = new Date(blog.publishDate);
        const now = new Date();
        
        if (dateFilter === "lastWeek") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          matchesDate = blogDate >= weekAgo;
        } else if (dateFilter === "lastMonth") {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          matchesDate = blogDate >= monthAgo;
        } else if (dateFilter === "last3Months") {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          matchesDate = blogDate >= threeMonthsAgo;
        }
      }
      
      return matchesSearchQuery && matchesPublisher && matchesDate;
    });
    
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs, selectedPublisher, dateFilter]);

  const handleFilterToggle = () => setFilterOpen(!filterOpen);
  const handleResetFilters = () => {
    setSelectedPublisher(null);
    setDateFilter(null);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCreateBlogSubmit = (blogData) => {
    // Create new blog with current date and default values
    const newBlogEntry = {
      id: blogs.length + 1,
      title: blogData.title,
      publisher: blogData.publisher,
      image: blogData.imagePreview || "/images/placeholder.jpg", // In a real app, you'd upload the image
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      creator: "IIT ROPAR",
      creatorType: "Creating Job Creators"
    };
    
    setBlogs([newBlogEntry, ...blogs]);
    setNewBlogOpen(false);
  };

  const handleEditBlog = (blogId) => {
    console.log(`Edit blog ${blogId}`);
    // Implement edit functionality here
  };

  const handleDeleteBlog = (blogId) => {
    console.log(`Delete blog ${blogId}`);
    // Implement delete functionality here
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Bar Component */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterToggle={handleFilterToggle}
      />

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onClose={handleFilterToggle}>
        <DialogTitle>Filter Blogs</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Publisher</Typography>
            <RadioGroup
              value={selectedPublisher || ""}
              onChange={(e) => setSelectedPublisher(e.target.value)}
            >
              {uniquePublishers.map((publisher) => (
                <FormControlLabel
                  key={publisher}
                  value={publisher}
                  control={<Radio />}
                  label={publisher}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Date</Typography>
            <RadioGroup
              value={dateFilter || ""}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <FormControlLabel value="lastWeek" control={<Radio />} label="Last Week" />
              <FormControlLabel value="lastMonth" control={<Radio />} label="Last Month" />
              <FormControlLabel value="last3Months" control={<Radio />} label="Last 3 Months" />
            </RadioGroup>
          </FormControl>
          <Button onClick={handleResetFilters} sx={{ mt: 2 }}>Reset Filters</Button>
        </DialogContent>
      </Dialog>

      {/* Blog Create Form Component */}
      <BlogCreateForm 
        open={newBlogOpen}
        onClose={() => setNewBlogOpen(false)}
        onSubmit={handleCreateBlogSubmit}
      />

      {/* Blog Grid */}
      <Grid container spacing={4}>
        {filteredBlogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4} lg={3}>
            <BlogCard 
              blog={blog} 
              userRole={info.user_role}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
            />
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setNewBlogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}