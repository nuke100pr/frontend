"use client";

import React, { useState, useContext, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  IconButton,
  Box,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const sampleBlogs = [
  {
    _id: "1",
    title: "The Rise of AI in Everyday Life",
    introduction: "Artificial Intelligence is shaping the world around us...",
    main_content:
      "AI is integrated into multiple domains, including healthcare, finance, and automation...",
    conclusion: "The future of AI looks promising as technology advances.",
    author_info: "John Doe, AI Researcher",
    published_at: "2024-03-10",
    published_by: "Tech Weekly",
    keywords: ["AI", "Machine Learning", "Future Tech"],
    images: ["/ai1.jpg", "/ai2.jpg"],
  },
  {
    _id: "2",
    title: "Web 3.0: The Future of Internet",
    introduction: "Web 3.0 promises decentralization and better user control...",
    main_content: "Blockchain and smart contracts play a significant role in Web 3.0...",
    conclusion: "It is essential to understand how Web 3.0 will impact our digital interactions.",
    author_info: "Jane Smith, Blockchain Developer",
    published_at: "2024-02-15",
    published_by: "Blockchain Insights",
    keywords: ["Blockchain", "Web 3.0", "Decentralization"],
    images: ["/web3.jpg"],
  },
];

const BLOGS = () => {
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const info = useContext(noteContext);
  const value2 = info.info;

  useEffect(() => {
    console.log("User Role from Context:", info.user_role);
  }, [info]);

  const handleOpen = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
  };

  // Filter blogs dynamically based on search query
  const filteredBlogs = sampleBlogs.filter((blog) =>
    [blog.title, blog.introduction, blog.main_content, ...blog.keywords]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {/* Left Panel - Search Bar (Fixed, Non-Scrollable) */}
      <Grid item xs={12} sm={3}>
        <Paper
          sx={{
            p: 2,
            position: "sticky",
            top: 80, // Ensures it stays below any navbar
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: 3, // Moderate elevation
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Search Blogs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Blog Cards */}
      <Grid item xs={12} sm={9}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} style={{ flex: "1 1 300px", maxWidth: "400px" }}>
                <Card>
                  <CardHeader
                    title={blog.title}
                    subheader={`By ${blog.published_by} on ${blog.published_at}`}
                    action={
                      value2.user_role === "super_admin" && (
                        <Box>
                          <IconButton onClick={handleEdit} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={handleDelete} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  />
                  {blog.images.length > 0 && (
                    <Image
                      src={blog.images[0]}
                      alt={blog.title}
                      width={400}
                      height={250}
                      style={{ objectFit: "cover", width: "100%" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {blog.introduction}
                    </Typography>
                    <div style={{ marginTop: 8 }}>
                      {blog.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} style={{ marginRight: 4 }} />
                      ))}
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary" onClick={() => handleOpen(blog)}>
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No blogs found.
            </Typography>
          )}
        </div>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>{selectedBlog?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              {selectedBlog?.introduction}
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedBlog?.main_content}
            </Typography>
            <Typography variant="subtitle1" fontStyle="italic">
              {selectedBlog?.conclusion}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Author: {selectedBlog?.author_info} | Published by {selectedBlog?.published_by} on {selectedBlog?.published_at}
            </Typography>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default BLOGS;