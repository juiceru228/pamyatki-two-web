import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

const MessageItem = ({ message, openModal }) => {
  const bg = useColorModeValue('#f0f0f0', '#2d2d2d');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Box 
      mb={5} 
      p={3} 
      bg={bg} 
      borderRadius="md" 
      color={textColor}
      className="message-item"
    >
      <div className="message-details">
        <p className="message-author">{message.author} №{message.id} {new Date(message.created_at).toLocaleString()}</p>
        <p className="message-number">{message.message_number}</p>
      </div>
      {message.image_url && (
        <img
          src={message.image_url}
          alt=""
          className="message-media"
          onClick={() => openModal(message.image_url)}
          style={{ cursor: 'pointer' }}
        />
      )}
      {message.video_url && <video controls src={message.video_url} className="message-media" />}
      <p className="message-content">{message.content}</p>
      {message.replies && message.replies.length > 0 && (
        <div className="message-replies">
          <p>Replies:</p>
          <ul className="replies-list">
            {message.replies.map(replyId => (
              <li key={replyId} className="reply-item">
                <a href={`#message-${replyId}`} className="message-reply-link">
                  {'>>'}{replyId}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
};

export default MessageItem;