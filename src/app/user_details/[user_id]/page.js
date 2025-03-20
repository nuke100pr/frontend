"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";

export default function UserProfile() {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch(`/api/users/${user_id}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUser(data && Object.keys(data).length > 0 ? data : null);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (user_id) fetchUserDetails();
  }, [user_id]);

  return loading ? (
    <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress />
    </Container>
  ) : !user ? (
    <Container sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6" color="error">
        User not found
      </Typography>
    </Container>
  ) : (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.bio || "No bio available"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Phone: {user.phone || "Not available"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Email: {user.email || "Not available"}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
