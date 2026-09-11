import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import API from '../services/api';
import { Bell, CheckCheck, Truck, Package, Clock, X, Circle } from 'lucide-react';

export const NotificationCenter = () => {
  const { connectionStatus, unreadCount, setUnreadCount } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative flex items-center gap-2" ref={panelRef}>
      {/* Socket Connection Badge (Live / Reconnecting) */}
      <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-outfit border ${
        connectionStatus === 'connected'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          : 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse'
      }`}>
        <Circle size={6} className={connectionStatus === 'connected' ? 'fill-emerald-500 text-emerald-500' : 'fill-amber-500 text-amber-500'} />
        <span>{connectionStatus === 'connected' ? 'Live' : 'Reconnecting...'}</span>
      </div>

      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center justify-center relative transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center ring-2 ring-white animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-10 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden font-sans">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 font-outfit">Notifications</span>
              {unreadCount > 0 && (
                <span className="badge-purple text-[10px] px-2 py-0.5">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-outfit"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-outfit">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600 font-outfit">No notifications yet</p>
                <p className="text-[11px] text-slate-400">Incoming freight opportunities will appear here in real-time.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) handleMarkAsRead(item._id);
                    if (item.trip) navigate(`/tracking/${item.trip._id || item.trip}`);
                    else if (item.shipment) navigate('/carrier/loads');
                  }}
                  className={`p-3.5 text-xs transition-colors cursor-pointer flex gap-3 items-start ${
                    item.isRead ? 'bg-white hover:bg-slate-50/80 opacity-80' : 'bg-indigo-50/40 hover:bg-indigo-50/70 border-l-2 border-indigo-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'NEW_SHIPMENT' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'SHIPMENT_ACCEPTED' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {item.type === 'NEW_SHIPMENT' ? <Package size={15} /> : <Truck size={15} />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 font-outfit truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1 shrink-0">
                        <Clock size={10} />
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] font-normal leading-snug line-clamp-2">{item.message}</p>
                    {item.metadata?.offeredPriceINR && (
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-600 font-outfit">
                          ₹{Number(item.metadata.offeredPriceINR).toLocaleString('en-IN')}
                        </span>
                        {item.metadata?.matchScore && (
                          <span className="badge-emerald text-[9px] py-0 px-1.5">
                            {item.metadata.matchScore}% Match
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
