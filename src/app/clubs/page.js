"use client";
import React, { useState, useContext, useMemo } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Box,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Import the separated components
import SearchAndFilter from "../../components/clubs/SearchAndFilter";
import CreateClubForm from "../../components/clubs/CreateClubForm";
import Navbar from "../../components/Navbar";

// Club Card Component 
const ClubCard = ({ club, boardName, onFollow, onEdit, onDelete }) => {
  const info = useContext(noteContext);
  const value2 = info.info;
  
  // Determine tag color based on board
  const getTagColor = (boardId) => {
    return boardId === "b1" ? "#4CAF50" : "#FF5722";
  };

  return (

    <Card sx={{ width: 350, m: 1, boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", borderRadius: 2 }}>
      <Box p={2}>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            {club.name}
          </Typography>
          {value2?.user_role === "super_admin" && (
            <Box>
              <IconButton onClick={() => onEdit(club._id)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(club._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          disableElevation
          sx={{ 
            borderRadius: 20, 
            backgroundColor: getTagColor(club.board_id),
            textTransform: "none",
            mb: 2,
            px: 2,
            py: 0.5,
            "&:hover": {
              backgroundColor: getTagColor(club.board_id),
            }
          }}
        >
          {boardName}
        </Button>

        <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
          <Typography component="div" sx={{ display: 'flex', mb: 1 }}>
            <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>Owner:</Typography>
            <Typography component="span">{club.name}</Typography>
          </Typography>
          
          <Typography component="div" sx={{ display: 'flex', mb: 2 }}>
            <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>Description:</Typography>
            <Typography component="span" sx={{ maxHeight: "60px", overflow: "hidden" }}>
              {club.description}
            </Typography>
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          fullWidth
          color="primary" 
          onClick={() => onFollow(club._id)}
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
            }
          }}
        >
          FOLLOW
        </Button>
      </Box>
    </Card>
  );
};

const ClubList = ({ clubs = [], boards = {}, onFollow }) => {
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const info = useContext(noteContext);
  const value2 = info.info;

  const sampleClubs = [
    {
      _id: "1",
      board_id: "b1",
      name: "Photography Club",
      description: "A club for photography enthusiasts to share and learn.",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      board_id: "b2",
      name: "Coding Club",
      description: "Join us to explore coding, hackathons, and projects.",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      board_id: "b1",
      name: "Music Club",
      description: "A place for music lovers to jam and perform.",
      image: "https://via.placeholder.com/150",
    },
  ];

  const sampleBoards = {
    b1: "Arts & Culture",
    b2: "Technology & Innovation",
  };

  // Combine provided boards with sample boards for the form
  const availableBoards = Object.keys(boards).length ? boards : sampleBoards;
  
  const handleEdit = (clubId) => {
    console.log(`Edit club ${clubId}`);
  };

  const handleDelete = (clubId) => {
    console.log(`Delete club ${clubId}`);
  };
  
  const handleCreateClub = (formData) => {
    console.log("Creating new club:", formData);
    // Here you would typically make an API call to create the club
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleBoardFilterChange = (boardId) => {
    setSelectedBoard(boardId);
  };

  const filteredClubs = useMemo(() => {
    return (clubs.length ? clubs : sampleClubs).filter(
      (club) =>
        club.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedBoard || club.board_id === selectedBoard)
    );
  }, [clubs, search, selectedBoard]);
  
  // Group clubs by board
  const groupedClubs = useMemo(() => {
    return filteredClubs.reduce((acc, club) => {
      const boardId = club.board_id;
      const boardName = boards[boardId] || sampleBoards[boardId] || "Unknown Board";
      
      if (!acc[boardName]) {
        acc[boardName] = [];
      }
      
      acc[boardName].push(club);
      return acc;
    }, {});
  }, [filteredClubs, boards]);
  
  // Sort board names
  const sortedBoardNames = Object.keys(groupedClubs).sort();

  return (
    <div>
      <Navbar/>
    <Box sx={{ position: "relative", pb: 10 }}>
      {/* Search and Filter Component */}
      <SearchAndFilter 
        onSearchChange={handleSearchChange}
        onBoardFilterChange={handleBoardFilterChange}
        availableBoards={availableBoards}
      />
      
      {sortedBoardNames.map((boardName) => (
        <Box key={boardName} sx={{ mb: 4 }}>
          {/* Board header bar */}
          <Box 
            sx={{ 
              backgroundColor: "#f5f5f5", 
              p: 1.5, 
              borderRadius: "4px 4px 0 0",
              borderBottom: "1px solid #e0e0e0",
              mb: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {boardName}
            </Typography>
          </Box>
          
          {/* Clubs in this board */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {groupedClubs[boardName].map((club) => (
              <ClubCard 
                key={club._id}
                club={club} 
                boardName={boardName} 
                onFollow={onFollow}
                onEdit={handleEdit}
                onDelete={handleDelete} 
              />
            ))}
          </Box>
        </Box>
      ))}
      
      {/* Floating Action Button for creating new club */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setCreateDialogOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
        }}
      >
        <AddIcon />
      </Fab>
      
      {/* Create Club Dialog Component */}
      <CreateClubForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        boards={availableBoards}
        onSave={handleCreateClub}
      />
    </Box>
    </div>
  );
};

export default ClubList;