import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Trash2, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

export const Chatbot = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load conversations from localStorage
    const stored = localStorage.getItem('conversations');
    if (stored) {
      const parsedConversations = JSON.parse(stored).map((conv: any) => ({
        ...conv,
        lastUpdated: new Date(conv.lastUpdated),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(parsedConversations);
      if (parsedConversations.length > 0) {
        setCurrentConversation(parsedConversations[0].id);
      }
    } else {
      // Create initial conversation
      createNewConversation();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, currentConversation]);

  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem('conversations', JSON.stringify(convs));
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Conversation',
      messages: [{
        id: '1',
        content: "Hello! I'm JobSage, your AI assistant for resume analysis. I can help you find candidates, analyze skills, and answer questions about uploaded resumes. How can I help you today?",
        sender: 'assistant',
        timestamp: new Date()
      }],
      lastUpdated: new Date()
    };
    
    const updatedConversations = [newConv, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversation(newConv.id);
    saveConversations(updatedConversations);
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversation);
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentConversation) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    // Update conversation with user message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversation) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastUpdated: new Date(),
          title: conv.title === 'New Conversation' ? message.slice(0, 30) + '...' : conv.title
        };
        return updatedConv;
      }
      return conv;
    });

    setConversations(updatedConversations);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the uploaded resumes, I can see several qualified candidates. Would you like me to filter by specific skills or experience level?",
        "I found 3 candidates with React experience. John Doe has 5 years, Sarah Smith has experience with related technologies, and Mike Johnson has 7 years of full-stack development.",
        "Here are the top candidates matching your criteria. Would you like me to provide more detailed analysis of their skills and experience?",
        "I can help you compare candidates based on their technical skills, experience level, or education background. What would you like to focus on?",
        "The uploaded resumes show a good mix of frontend and backend skills. Let me know if you'd like me to categorize them by expertise area."
      ];

      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant',
        timestamp: new Date()
      };

      const finalConversations = updatedConversations.map(conv => {
        if (conv.id === currentConversation) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
            lastUpdated: new Date()
          };
        }
        return conv;
      });

      setConversations(finalConversations);
      saveConversations(finalConversations);
      setIsTyping(false);
    }, 1500);
  };

  const deleteConversation = (convId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== convId);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);
    
    if (currentConversation === convId) {
      if (updatedConversations.length > 0) {
        setCurrentConversation(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const currentConv = getCurrentConversation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Button 
            onClick={createNewConversation}
            className="w-full justify-start"
            variant="outline"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                  currentConversation === conv.id 
                    ? 'bg-accent' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {conv.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 absolute right-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">JobSage</h1>
              <p className="text-sm text-muted-foreground">AI Resume Assistant</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-4">
            <div className="space-y-6">
              {currentConv?.messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {msg.sender === 'assistant' ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {msg.sender === 'assistant' ? 'JobSage' : 'You'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none text-foreground">
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="group">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">JobSage</span>
                        <span className="text-xs text-muted-foreground">typing...</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask JobSage about candidates, skills, or resume analysis..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!message.trim() || isTyping}
                size="sm"
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};