// BlogCard.js
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";


// Common card styles
const cardStyles = {
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: 3,
  },
  viewsBox: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    borderRadius: 4,
    px: 1,
    py: 0.5,
  },
  cardContent: {
    flexGrow: 1,
    bgcolor: "#000",
    color: "#fff",
    p: 2,
  },
  publisher: {
    backgroundColor: "#947b61",
    color: "white",
    fontSize: "0.7rem",
    height: 22,
    mb: 1,
  },
  cardActions: {
    bgcolor: "#000",
    p: 1,
    pt: 0,
  },
};

// Helper functions
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatViewCount = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1) + "k" : count;

const BlogCard = ({ blog, userRole, onEdit, onDelete }) => {
  const handleEdit = () => onEdit(blog.id);
  const handleDelete = () => onDelete(blog.id);

  return (
    <Card sx={cardStyles.card}>
      <CardMedia
        component="img"
        height="180"
        image="./img1.jpg"
        alt={blog.title}
      />
      <Box sx={cardStyles.viewsBox}>
        <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} />
        <Typography variant="caption">{formatViewCount(blog.views)}</Typography>
      </Box>
      <CardContent sx={cardStyles.cardContent}>
        <Box sx={{ mb: 1 }}>
          <Chip label={blog.publisher} size="small" sx={cardStyles.publisher} />
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.8, mb: 1 }}
          >
            {formatDate(blog.publishDate)}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 1, fontWeight: "bold", fontSize: "1rem" }}
        >
          {blog.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: "#333", mr: 1 }}>
            I
          </Avatar>
          <Box>
            <Typography variant="body2">{blog.creator}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {blog.creatorType}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={cardStyles.cardActions}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
          {userRole === "super_admin" && (
            <Box>
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
