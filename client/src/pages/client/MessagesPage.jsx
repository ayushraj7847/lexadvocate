import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Search,
  Users,
  Circle,
  FileText,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Spinner, EmptyState } from '../../components/ui';
import { formatDateTime } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Socket.io
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_message', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });

    socket.on('user_typing', () => {
      setIsTyping(true);
    });

    socket.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const { data } = await api.get('/conversations');
        if (data.success) {
          const list = data.data.conversations || [];
          setConversations(list);
          if (list.length > 0 && !activeConversation) {
            setActiveConversation(list[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations');
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await api.get(`/conversations/${activeConversation._id}/messages`);
        if (data.success) {
          setMessages(data.data.messages || []);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView();
          }, 50);
        }

        // Join room in socket
        socketRef.current?.emit('join_conversation', activeConversation._id);
      } catch (err) {
        toast.error('Failed to load message history');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    return () => {
      socketRef.current?.emit('leave_conversation', activeConversation._id);
    };
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const content = messageText.trim();
    setMessageText('');

    try {
      // Send via socket first for real-time responsiveness
      socketRef.current?.emit('send_message', {
        conversationId: activeConversation._id,
        content,
        messageType: 'text',
      });

      // Also ensure API record
      const { data } = await api.post(`/conversations/${activeConversation._id}/messages`, {
        content,
        messageType: 'text',
      });

      if (data.success) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === data.data.message._id)) return prev;
          return [...prev, data.data.message];
        });
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return { name: 'Advocate' };
    return conv.participants.find((p) => p._id !== user?._id) || conv.participants[0];
  };

  return (
    <div className="card bg-white p-0 border border-border overflow-hidden h-[calc(100vh-140px)] flex">
      {/* Conversations List Sidebar */}
      <div className="w-full md:w-80 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Direct Conversations</h2>
            <p className="text-[11px] text-text-muted">Advocate consultations & case chats</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-success' : 'bg-red-400'
              }`}
            ></span>
            <span className="text-[10px] text-text-muted">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {loadingConversations ? (
            <div className="p-8 flex justify-center">
              <Spinner size="md" />
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isSelected = activeConversation?._id === conv._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-primary-50/70 border-l-4 border-primary' : 'hover:bg-surface'
                  }`}
                >
                  <Avatar name={other.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-text-primary truncate">{other.name}</p>
                      <span className="text-[10px] text-text-muted capitalize">
                        {other.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">
                      {conv.lastMessage?.content || 'Started conversation'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-text-muted">
              No conversations started yet. Consultations will initiate secure chats.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col min-w-0 bg-surface/30">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={getOtherParticipant(activeConversation).name} size="sm" />
              <div>
                <h3 className="text-xs font-bold text-text-primary leading-tight">
                  {getOtherParticipant(activeConversation).name}
                </h3>
                <span className="text-[10px] text-text-secondary capitalize">
                  {getOtherParticipant(activeConversation).role} • Confidential Channel
                </span>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loadingMessages ? (
              <div className="py-12 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white text-text-primary border border-border rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-text-muted mt-1 px-1">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-text-muted">
                No messages yet. Send a query or brief to start consulting!
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted italic">
                <span>Advocate is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 bg-white border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your confidential legal question or note..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="input-field text-xs flex-1 py-2"
            />
            <Button type="submit" variant="primary" size="sm" disabled={!messageText.trim()}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center bg-surface/20">
          <EmptyState
            icon={MessageSquare}
            title="Select a Conversation"
            description="Choose a conversation from the left to view messages and discuss legal queries."
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
