  // app/apis/chat.ts
  export const chatApi = {
    sendMessage: async (message: string, userId: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    }
  };