
export const profileApi = {
    fetchProfile: async (userId: string) => {
      const response = await fetch(`/api/profile/${userId}`);
      if (response.status === 404) {
        return [];
      }
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  
    updateProfile: async (profileData: any, userId: string) => {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileData, userId }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    }
  };
  

  
  