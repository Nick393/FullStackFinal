import MessageItem from './MessageItem';

function MessageList({ messages, onDeleteMessage, onUpdateMessage, currentUserId }) {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <p>No messages yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem
          key={message._id}
          message={message}
          onDelete={() => onDeleteMessage(message._id)}
          onUpdate={(newContent) => onUpdateMessage(message._id, newContent)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default MessageList;
