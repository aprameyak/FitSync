import { Box, Button, Typography, Paper, TextField } from "@mui/material";
import { ChatMessage } from "../types";

interface ChatSectionProps {
  messages: ChatMessage[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
}

export const ChatSection = ({ messages, inputMessage, onInputChange, onSendMessage }: ChatSectionProps) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* ... chat section content ... */}
    </Paper>
  );
};