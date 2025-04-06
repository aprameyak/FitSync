export const chatApi = {
  sendMessage: async (message: string, chatHistory: any[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, chatHistory }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }
};
