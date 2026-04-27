'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore, type ChatThread, type Message } from '@/store/app-store';

export function ChatListScreen() {
  const { currentUser, setView, setSelectedThread } = useAppStore();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleOpenChat = (thread: ChatThread) => {
    setSelectedThread(thread);
    setView('chat');
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="px-5 py-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Tus conversaciones activas</p>
        </div>
      </div>

      <div className="px-4 py-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-1" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Sin chats todavía</h3>
            <p className="text-muted-foreground text-sm">
              Respondé a una necesidad para iniciar una conversación
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleOpenChat(thread)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {thread.otherUser.name.charAt(0)}
                    </span>
                  </div>
                  {thread.unreadCount && thread.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{thread.unreadCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">{thread.otherUser.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {timeAgo(thread.lastMessageAt)}
                    </span>
                  </div>
                  {thread.need && (
                    <p className="text-[10px] text-blue-500 font-medium truncate">
                      {thread.need.title}
                    </p>
                  )}
                  {thread.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatScreen() {
  const { selectedThread, currentUser, goBack } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<ReturnType<typeof setInterval>>();

  const fetchMessages = useCallback(async () => {
    if (!selectedThread) return;
    try {
      const res = await fetch(`/api/chat/${selectedThread.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedThread]);

  useEffect(() => {
    if (!selectedThread) return;
    fetchMessages();
    pollInterval.current = setInterval(fetchMessages, 3000);
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser || !selectedThread) return;
    const msg = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`/api/chat/${selectedThread.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msg, senderId: currentUser.id }),
      });
      if (res.ok) {
        const message = await res.json();
        setMessages(prev => [...prev, message]);
      }
    } catch (err) {
      console.error(err);
      setNewMessage(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedThread) {
    goBack();
    return null;
  }

  const otherUser = selectedThread.participant1Id === currentUser?.id
    ? selectedThread.participant2
    : selectedThread.participant1;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-full flex flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={goBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{otherUser?.name?.charAt(0) || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{otherUser?.name || 'Usuario'}</p>
            {selectedThread.need && (
              <p className="text-[10px] text-muted-foreground truncate">{selectedThread.need.title}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">Iniciá la conversación</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.senderId === currentUser?.id;
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${isMine ? 'flex-row-reverse' : ''}`}>
                  {!isMine && showAvatar && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">{msg.sender.name.charAt(0)}</span>
                    </div>
                  )}
                  {!isMine && !showAvatar && <div className="w-7 shrink-0" />}
                  <div>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? 'bg-blue-500 text-white rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-0.5 ${isMine ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-background border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Quick action: Solicitar presupuesto */}
        <div className="mb-2">
          <button
            onClick={() => setView('create-quote')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            Solicitar presupuesto
          </button>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              placeholder="Escribí un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full p-3 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none max-h-24"
              style={{ minHeight: '44px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
