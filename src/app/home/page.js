"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  useMediaQuery,
  useTheme,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Badge,
  InputAdornment,
  Paper,
  Collapse,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Favorite as FavoriteIcon,
  Event as EventIcon,
  Work as WorkIcon,
  BusinessCenter as BusinessCenterIcon,
  CalendarToday as CalendarTodayIcon,
  LibraryBooks as LibraryBooksIcon,
  Description as DescriptionIcon,
  Forum as ForumIcon,
  Settings as SettingsIcon,
  Groups as GroupsIcon,
  AdminPanelSettings as AdminIcon,
  WorkOutline as WorkOutlineIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PostAdd as PostAddIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import NOTIFICATIONS from "../../components/home_page/NOTIFICATIONS";
import noteContext from "../../contexts/noteContext";

const API_URL = "http://localhost:5000/api";
const API_URL2 = "http://localhost:5000/uploads";

const drawerWidth = 250;
const rightPanelWidth = 350;

const BASE_SECTIONS = [
  { label: "Events", path: "/events", icon: <EventIcon /> },
  { label: "Projects", path: "/projects", icon: <WorkIcon /> },
  {
    label: "Opportunities",
    path: "/opportunities",
    icon: <BusinessCenterIcon />,
  },
  { label: "Calendar", path: "/calendar", icon: <CalendarTodayIcon /> },
  { label: "Resources", path: "/resources", icon: <LibraryBooksIcon /> },
  { label: "Blogs", path: "/blogs", icon: <DescriptionIcon /> },
  { label: "Forums", path: "/forums", icon: <ForumIcon /> },
  { label: "Clubs", path: "/clubs", icon: <GroupsIcon /> },
  { label: "Admin Panel", path: "/admin_panel", icon: <AdminIcon /> },
  { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
];

const CREATE_POST_SECTION = {
  label: "Create Post",
  path: "/create_post",
  icon: <PostAddIcon />,
};

const ClubBoard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [eventsCollapsed, setEventsCollapsed] = useState(false);
  const [resourcesCollapsed, setResourcesCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const info = useContext(noteContext);
  const value2 = info.info;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Access the posts array from the data object
      const postsArray = data.posts;

      if (Array.isArray(postsArray)) {
        setPosts(postsArray);

        // Initialize likes state from fetched posts
        const likesObj = {};
        postsArray.forEach((post) => {
          likesObj[post._id] = post.likeCount || 0; // Notice: using likeCount from your data
        });
        setLikes(likesObj);
      } else {
        console.error("Unexpected data format:", data);
        setError("Failed to load posts: Unexpected data format");
        setPosts([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (path) => {
    setIsNavigating(true);
    // Simulate a small delay before navigation to ensure the loading bar is visible
    setTimeout(() => {
      router.push(path);
      if (isMobile) setMobileOpen(false);
      // The loading state will be reset when the new page component mounts
    }, 500);
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]: (prevLikes[id] || 0) + 1,
      }));

      setNotification({
        open: true,
        message: "Post liked successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error liking post:", err);
      setNotification({
        open: true,
        message: "Failed to like post. Please try again.",
        severity: "error",
      });
    }
  };

  const handleUnlike = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]: Math.max(0, (prevLikes[id] || 0) - 1),
      }));

      setNotification({
        open: true,
        message: "Post unliked successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error unliking post:", err);
      setNotification({
        open: true,
        message: "Failed to unlike post. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted post from state
      setPosts(posts.filter((post) => post._id !== id));

      setNotification({
        open: true,
        message: "Post deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      setNotification({
        open: true,
        message: "Failed to delete post. Please try again.",
        severity: "error",
      });
    }
  };

  const toggleEventsCollapse = () => setEventsCollapsed(!eventsCollapsed);
  const toggleResourcesCollapse = () =>
    setResourcesCollapsed(!resourcesCollapsed);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Common styling objects to reduce redundancy
  const sidebarStyles = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#0a1929",
      color: "white",
      boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    },
  };

  const cardStyles = {
    marginBottom: 3,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const isSuperAdmin = value2?.user_role === "super_admin";

  // Create the sections array based on user role
  const SECTIONS = isSuperAdmin
    ? [CREATE_POST_SECTION, ...BASE_SECTIONS]
    : [...BASE_SECTIONS];

  const handleEdit = (postId) => {
    router.push(`/edit_post/${postId}`);
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />

      {/* Navigation Loading Bar */}
      {isNavigating && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 4,
            backgroundColor: "#e0f7fa",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#1976d2",
            },
          }}
        />
      )}

      {/* Left Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={sidebarStyles}
      >
        <Box sx={{ height: "100vh", padding: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginBottom: 2,
              fontWeight: "bold",
              letterSpacing: "0.5px",
              borderBottom: "2px solid #1976d2",
              paddingBottom: 1,
            }}
          >
            Club Board
          </Typography>
          <Divider
            sx={{ borderColor: "rgba(255, 255, 255, 0.1)", marginBottom: 2 }}
          />
          <List>
            {SECTIONS.map((section, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleNavigation(section.path)}
                sx={{
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.12)" },
                  borderRadius: "4px",
                  mb: 0.5,
                  position: "relative",
                }}
                disabled={isNavigating}
              >
                <ListItemIcon sx={{ color: "#90caf9" }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText primary={section.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f8f9fa",
          padding: 3,
          overflowY: "auto",
          backgroundImage: "linear-gradient(to bottom, #f8f9fa, #f0f2f5)",
          width: `calc(100% - ${drawerWidth}px - ${rightPanelWidth}px - 200px)`, // Subtract extra 200px for margin
          marginX: "100px", // Adds margin of 100px on both sides
        }}
      >
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: "#0a1929",
              width: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Club Board
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box
          sx={{
            marginTop: isMobile ? 8 : 0,
            padding: 2,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "auto", // Allows scrolling
            scrollbarWidth: "none", // Hides scrollbar in Firefox
            msOverflowStyle: "none", // Hides scrollbar in IE/Edge
            "&::-webkit-scrollbar": {
              display: "none", // Hides scrollbar in Chrome, Safari, Edge
            },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
                color: "#0a1929",
                borderLeft: "4px solid #1976d2",
                paddingLeft: 2,
              }}
            >
              Welcome to the Club Board
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 1, color: "#546e7a" }}
            >
              Select an option from the left panel to get started.
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              textAlign: "center",
              my: 4,
              p: 2,
              bgcolor: "#ffebee",
              borderRadius: 1,
            }}
          >
            <Typography color="error">{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={fetchPosts}
            >
              Try Again
            </Button>
          </Box>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              my: 4,
              p: 3,
              bgcolor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">No posts available</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Be the first to create a post!
            </Typography>
            {isSuperAdmin && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleNavigation("/create_post")}
                startIcon={<PostAddIcon />}
                disabled={isNavigating}
              >
                Create Post
              </Button>
            )}
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={post._id} sx={cardStyles}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={post.user?.avatar || "/default-avatar.jpg"}
                      sx={{ border: "2px solid #e0e0e0" }}
                    >
                      {post.user?.name ? post.user.name.charAt(0) : "U"}
                    </Avatar>
                  }
                  title={post.user?.name || "Prakhar Maurya"}
                  subheader={new Date().toLocaleString()}
                  sx={{ padding: 0 }}
                />

                {value2?.user_role === "super_admin" && (
                  <Box>
                    <IconButton
                      onClick={() => handleEdit(post._id)}
                      color="primary"
                      disabled={isNavigating}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(post._id)}
                      color="error"
                      disabled={isNavigating}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
              </CardContent>

              <CardContent>
                <Typography
                  sx={{ color: "#37474f" }}
                  component="div"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
              {post.files && post.files.length > 0 && (
                <Carousel
                  showArrows={true}
                  showThumbs={false}
                  infiniteLoop={true}
                >
                  {post.files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      {file.fileType === "image" ? (
                        <CardMedia
                          component="img"
                          height="300"
                          width="500"
                          image={`${API_URL2}/${file.filename}`}
                          alt={file.originalName}
                          sx={{
                            objectFit: "contain", // Use "contain" instead of "cover" if you want full visibility
                            width: "100%",
                            height: "300px", // Match the height explicitly
                          }}
                        />
                      ) : file.fileType === "video" ? (
                        <video
                          width="100%"
                          height="100%"
                          controls
                          src={`${API_URL2}/${file.filename}`}
                          style={{ objectFit: "cover" }}
                        />
                      ) : null}
                    </div>
                  ))}
                </Carousel>
              )}
              <CardActions sx={{ borderTop: "1px solid #f0f0f0" }}>
                <Button
                  onClick={() => handleLike(post._id)}
                  startIcon={<FavoriteIcon color="error" />}
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                  disabled={isNavigating}
                >
                  {likes[post._id] || 0} Likes
                </Button>
              </CardActions>
            </Card>
          ))
        )}

        {/* Collapsible Sections for Mobile */}
        {isMobile && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#f8f9fa",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleEventsCollapse}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Upcoming Events
                </Typography>
                {eventsCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              <Collapse in={eventsCollapsed}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      fontWeight="bold"
                    >
                      Web Development Workshop
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      March 18, 2025 • 3:00 PM
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      fontWeight="bold"
                    >
                      Design Thinking Meetup
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      March 22, 2025 • 2:00 PM
                    </Typography>
                  </CardContent>
                </Card>
              </Collapse>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#f8f9fa",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={toggleResourcesCollapse}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Popular Resources
                </Typography>
                {resourcesCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              <Collapse in={resourcesCollapsed}>
                <List disablePadding>
                  <ListItem dense button>
                    <ListItemText
                      primary="Getting Started Guide"
                      secondary="PDF • 245 KB"
                    />
                  </ListItem>
                  <ListItem dense button>
                    <ListItemText
                      primary="Club Guidelines"
                      secondary="PDF • 180 KB"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </Box>
          </Box>
        )}
      </Box>

      {/* Right Panel (Static for Laptop) */}
      {!isMobile && (
        <Box
          sx={{
            width: rightPanelWidth,
            backgroundColor: "#f8f9fa",
            borderLeft: "1px solid #e0e0e0",
            padding: 2,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Upcoming Events
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                Web Development Workshop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                March 18, 2025 • 3:00 PM
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                Design Thinking Meetup
              </Typography>
              <Typography variant="body2" color="text.secondary">
                March 22, 2025 • 2:00 PM
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Popular Resources
          </Typography>

          <List disablePadding>
            <ListItem dense button>
              <ListItemText
                primary="Getting Started Guide"
                secondary="PDF • 245 KB"
              />
            </ListItem>
            <ListItem dense button>
              <ListItemText
                primary="Club Guidelines"
                secondary="PDF • 180 KB"
              />
            </ListItem>
          </List>
        </Box>
      )}

      <NOTIFICATIONS />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClubBoard;