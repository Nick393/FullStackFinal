// Base URL for all API calls - change this for deployment
const API_URL = 'http://localhost:3001/api';

/**
 * Get auth headers with token if available
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};


 //Fetch all messages from backend
 
export const getMessages = async () => {
  const response = await fetch(`${API_URL}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};


 // Create a new message
 //@param {Object} messageData //- { content: string }
 
export const createMessage = async (messageData) => {
  const response = await fetch(`${API_URL}/messages`, {
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
  const response = await fetch(`${API_URL}/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
  return response.json();
};
