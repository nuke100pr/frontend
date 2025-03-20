"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Typography, Card, CardContent, CircularProgress } from "@mui/material";

export default function EventDetails() {
  const params = useParams();
  const eventId = params.event_id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        console.log("ndjdkv");
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">Event not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {event.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}