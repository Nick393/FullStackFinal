const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://focustools-backend-nick393.onrender.com';


 //Get auth headers with token if available
 
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};


 //Fetch all messages from backend
 
export const getMessages = async () => {
  const response = await fetch(`${API_URL}/api/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};


 // Create a new message
 
 
export const createMessage = async (messageData) => {
  const response = await fetch(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) {
    throw new Error('Failed to create message');
  }
  return response.json();
};

 //Delete a message
 
export const deleteMessage = async (id) => {
  const response = await fetch(`${API_URL}/api/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
  return response.json();
};
