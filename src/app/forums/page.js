"use client";
import React, { useState, useContext } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Tooltip,
  Fab,
  CardMedia,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchAndFilter from "../../components/forums/SearchAndFilter";
import ForumCreateDialog from "../../components/forums/ForumCreateDialog";
import Navbar from "../../components/Navbar";

const ForumCard = ({ forum, boardName, clubName, onViewForum, value2 }) => {
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const handleEdit = (forumId) => {
    console.log(`Edit forum ${forumId}`);
  };

  const handleDelete = (forumId) => {
    console.log(`Delete forum ${forumId}`);
  };

  return (
    <Card
      sx={{
        width: 350,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        borderRadius: 2,
        mb: 2,
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={forum.imageUrl || "https://via.placeholder.com/350x140"}
        alt={forum.title}
      />
      <Box p={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {forum.title}
          </Typography>
          {value2 && value2.user_role === "super_admin" && (
            <Box>
              <IconButton
                onClick={() => handleEdit(forum._id)}
                color="primary"
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(forum._id)}
                color="error"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Tooltip
            title={forum.public_or_private === "private" ? "Private" : "Public"}
          >
            <IconButton size="small" sx={{ ml: 1 }}>
              {forum.public_or_private === "private" ? (
                <LockIcon fontSize="small" />
              ) : (
                <PublicIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", mb: 2 }}>
          {boardName && (
            <Chip
              label={boardName}
              size="small"
              sx={{
                mr: 1,
                backgroundColor: "#4CAF50",
                color: "white",
              }}
            />
          )}
          {clubName && (
            <Chip
              label={clubName}
              size="small"
              sx={{
                backgroundColor: "#FF5722",
                color: "white",
              }}
            />
          )}
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {truncateText(forum.description)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #eee",
            pt: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <VisibilityIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {forum.number_of_views}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CommentIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {forum.number_of_replies}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          color="primary"
          onClick={() => onViewForum(forum._id)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            py: 1.5,
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#1976d2",
              opacity: 0.8,
            },
          }}
        >
          VIEW DISCUSSION
        </Button>
      </Box>
    </Card>
  );
};

const ForumList = ({ forums: propForums = [], boards: propBoards = {}, clubs: propClubs = {}, onViewForum }) => {
  const [search, setSearch] = useState("");
  const [createForumOpen, setCreateForumOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [privacyFilter, setPrivacyFilter] = useState(null);
  const info = useContext(noteContext);
  const value2 = info.info;

  const sampleForums = [
    {
      _id: "f1",
      title: "Photography Exhibition Discussion",
      description:
        "Let's discuss ideas for our upcoming photography exhibition. We need to decide on themes, venue, and dates.",
      number_of_views: "156",
      number_of_replies: "23",
      event_id: "e1",
      club_id: "1",
      board_id: "b1",
      user_id: "u1",
      public_or_private: "public",
      imageUrl: "https://via.placeholder.com/350x140?text=Photography",
    },
    {
      _id: "f2",
      title: "Coding Challenge Preparation",
      description:
        "This thread is for preparing for the annual coding competition. Share resources, tips, and let's form teams.",
      number_of_views: "342",
      number_of_replies: "56",
      event_id: "e2",
      club_id: "2",
      board_id: "b2",
      user_id: "u2",
      public_or_private: "public",
      imageUrl: "https://via.placeholder.com/350x140?text=Coding",
    },
    {
      _id: "f3",
      title: "Music Club Private Meeting Notes",
      description:
        "Private discussion for members only about our next performance and practice schedule.",
      number_of_views: "78",
      number_of_replies: "12",
      event_id: "e3",
      club_id: "3",
      board_id: "b1",
      user_id: "u3",
      public_or_private: "private",
      imageUrl: "https://via.placeholder.com/350x140?text=Music",
    },
  ];

  const sampleBoards = {
    b1: "Arts & Culture",
    b2: "Technology & Innovation",
  };

  const sampleClubs = {
    1: "Photography Club",
    2: "Coding Club",
    3: "Music Club",
  };

  const handleCreateForumToggle = () => {
    setCreateForumOpen(!createForumOpen);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (filters) => {
    setSelectedBoard(filters.board);
    setSelectedClub(filters.club);
    setPrivacyFilter(filters.privacy);
  };

  const availableForums = propForums.length ? propForums : sampleForums;
  const availableBoards = Object.keys(propBoards).length ? propBoards : sampleBoards;
  const availableClubs = Object.keys(propClubs).length ? propClubs : sampleClubs;

  const filteredForums = availableForums.filter(
    (forum) =>
      forum.title.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedBoard || forum.board_id === selectedBoard) &&
      (!selectedClub || forum.club_id === selectedClub) &&
      (!privacyFilter || forum.public_or_private === privacyFilter)
  );

  return (
    <div>
      <Navbar/>
      <>
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 8 }}>
      <SearchAndFilter 
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        availableBoards={availableBoards}
        availableClubs={availableClubs}
      />

      <Grid container spacing={3} sx={{ px: 2 }}>
        {filteredForums.map((forum) => (
          <Grid item key={forum._id}>
            <ForumCard
              forum={forum}
              boardName={availableBoards[forum.board_id]}
              clubName={availableClubs[forum.club_id]}
              onViewForum={onViewForum}
              value2={value2}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateForumToggle}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      {/* ForumCreateDialog component would be imported and used here */}
      {createForumOpen && (
        <ForumCreateDialog
          open={createForumOpen}
          onClose={handleCreateForumToggle}
          availableBoards={availableBoards}
          availableClubs={availableClubs}
        />
      )}
    </Box>
    </>
    </div>
  );
};

export default ForumList;