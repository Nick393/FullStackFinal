function MessageItem({ message, onDelete, currentUserId }) {
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

  return (
    <div className="message-item">
      <div className="message-content">
        <p className="message-text">{message.content}</p>
        <div className="message-meta">
          <span className="message-author">{message.user?.username || 'Anonymous'}</span>
          <span className="message-time">{formatDate(message.createdAt)}</span>
        </div>
      </div>

      {/* Only show delete button for user's own messages */}
      {isOwnMessage && (
        <button
          onClick={onDelete}
          className="delete-button"
          aria-label="Delete message"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default MessageItem;
