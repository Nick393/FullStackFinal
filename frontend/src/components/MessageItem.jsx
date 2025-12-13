import { useState } from 'react';

function MessageItem({ message, onDelete, onUpdate, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    //format the date display
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOwnMessage = message.user && message.user._id === currentUserId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== message.content) {
      onUpdate(editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div className="message-item">
      <div className="message-content">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="message-input edit-input"
            rows="3"
            maxLength="1000"
            autoFocus
          />
        ) : (
          <p className="message-text">{message.content}</p>
        )}
        <div className="message-meta">
          <span className="message-author">{message.user?.username || 'Anonymous'}</span>
          <span className="message-time">{formatDate(message.createdAt)}</span>
        </div>
      </div>

      {/* Only show action buttons for user's own messages */}
      {isOwnMessage && (
        <div className="message-actions">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="save-button"
                aria-label="Save message"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="cancel-button"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="edit-button"
                aria-label="Edit message"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="delete-button"
                aria-label="Delete message"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageItem;
