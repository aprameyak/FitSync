import { Box, Button, Typography, Paper, TextField, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";

interface ChatSectionProps {
  messages: ChatMessage[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatSection = ({
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isLoading = false,
}: ChatSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoadingState) {
      setIsLoadingState(true);
      onSendMessage(inputMessage);
      setIsLoadingState(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        AI Fitness Coach
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 2,
          p: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          minHeight: "400px",
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: message.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: "70%",
                backgroundColor: message.role === "user" ? "primary.main" : "white",
                color: message.role === "user" ? "white" : "text.primary",
                wordBreak: "break-word",
              }}
            >
              <Typography>{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
        {isLoadingState && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 1,
          mt: "auto",
        }}
      >
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          disabled={isLoadingState}
          multiline
          maxRows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
        <Button type="submit" variant="contained" disabled={!inputMessage.trim() || isLoadingState}>
          {isLoadingState ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </Box>
    </Paper>
  );
};