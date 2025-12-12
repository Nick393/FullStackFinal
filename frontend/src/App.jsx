import { useState, useEffect } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import AuthForm from './components/AuthForm';
import { getMessages, createMessage, deleteMessage } from './api/messages';
import { useAuth } from './contexts/AuthContext';

function App() {
  //state management
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  //load messages from database
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch all messages from backend
   */
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  
   //add a new message
   
  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!newMessageContent.trim()) return;

    try {
      //save to database
      const newMessage = await createMessage({ content: newMessageContent });

      //update React state (add to beginning of list)
      setMessages([newMessage, ...messages]);

      //Clear input
      setNewMessageContent('');
    } catch (err) {
      console.error('Error creating message:', err);
      setError('Failed to post message. Please try again.');
    }
  };

  
  //Delete a message
   
  const handleDeleteMessage = async (messageId) => {
    try {
      //delete from database
      await deleteMessage(messageId);

      //remove from React state
      setMessages(messages.filter(m => m._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message. Please try again.');
    }
  };

  if (authLoading) {//display loading while verify authentication
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {//if not logged in, show auth page
    return (
      <div className="app auth">
        <header>
          <h1>Message Board</h1>
          <p>Share your thoughts with the world</p>
        </header>

        <div className="auth-container">
          <div className="auth-tabs">
            <button
              className={showLogin ? 'active' : ''}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={!showLogin ? 'active' : ''}
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <AuthForm isLogin={showLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div>
            <h1>Message Board</h1>
            <p>Welcome back, {user.username}!</p>
          </div>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="main-content">
        <div className="message-section">
          <h2>Messages</h2>

          {/* Add Message Form */}
          <form onSubmit={handleAddMessage} className="add-message-form">
            <textarea
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder="What's on your mind?"
              className="message-input"
              rows="3"
              maxLength="1000"
            />
            <button type="submit" className="post-button">
              Post Message
            </button>
          </form>

          {/* Message List */}
          <MessageList
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
