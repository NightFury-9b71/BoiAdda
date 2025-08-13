import { useState, useEffect } from 'react';
import { Plus, Megaphone, AlertTriangle, Eye, EyeOff, Trash2, Edit, Save, X } from 'lucide-react';
import { Card, Button, Input, Badge, LoadingSpinner, EmptyState } from './ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import api from '../api.js';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal',
    announcementType: 'broadcast', // 'broadcast' or 'targeted'
    selectedUsers: []
  });

  useEffect(() => {
    loadAnnouncements();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getDetailedUsers();
      setUsers(data.filter(user => user.role_name !== 'admin')); // Exclude admins
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('শিরোনাম এবং বার্তা অবশ্যক।');
      return;
    }

    if (formData.announcementType === 'targeted' && formData.selectedUsers.length === 0) {
      alert('অন্তত একজন ব্যবহারকারী নির্বাচন করুন।');
      return;
    }

    try {
      const announcementData = {
        ...formData,
        target_users: formData.announcementType === 'targeted' ? formData.selectedUsers : null
      };

      if (editingId) {
        // For editing, we would need an update endpoint
        // For now, we'll just reload the data
        await loadAnnouncements();
        setEditingId(null);
      } else {
        await api.createAnnouncement(announcementData);
        await loadAnnouncements();
        setShowCreateForm(false);
      }
      
      setFormData({ 
        title: '', 
        message: '', 
        priority: 'normal',
        announcementType: 'broadcast',
        selectedUsers: []
      });
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('ঘোষণা সংরক্ষণে ত্রুটি হয়েছে।');
    }
  };

  const handleToggle = async (announcementId) => {
    try {
      await api.toggleAnnouncement(announcementId);
      await loadAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      alert('ঘোষণা টগল করতে ত্রুটি হয়েছে।');
    }
  };

  const handleDelete = async (announcementId) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ঘোষণা মুছে ফেলতে চান?')) {
      return;
    }

    try {
      await api.deleteAnnouncement(announcementId);
      await loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('ঘোষণা মুছে ফেলতে ত্রুটি হয়েছে।');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Megaphone className="h-4 w-4 text-orange-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'জরুরি';
      case 'medium':
        return 'গুরুত্বপূর্ণ';
      default:
        return 'সাধারণ';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${colorClasses.text.primary}`}>
            ঘোষণা ব্যবস্থাপনা
          </h2>
          <p className={`text-sm ${colorClasses.text.secondary} mt-1`}>
            সকল ব্যবহারকারীর জন্য ঘোষণা তৈরি এবং পরিচালনা করুন
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
          icon={Plus}
        >
          নতুন ঘোষণা
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className={`text-lg font-medium ${colorClasses.text.primary}`}>
              নতুন ঘোষণা তৈরি করুন
            </h3>
            
            <div>
              <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                শিরোনাম
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ঘোষণার শিরোনাম লিখুন..."
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                বার্তা
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ঘোষণার বিস্তারিত বার্তা লিখুন..."
                rows="4"
                className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} resize-none`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                ঘোষণার ধরন
              </label>
              <select
                value={formData.announcementType}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  announcementType: e.target.value,
                  selectedUsers: [] // Reset selected users when changing type
                })}
                className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
              >
                <option value="broadcast">সকল ব্যবহারকারীর জন্য</option>
                <option value="targeted">নির্দিষ্ট ব্যবহারকারীর জন্য</option>
              </select>
            </div>

            {/* User Selection for Targeted Announcements */}
            {formData.announcementType === 'targeted' && (
              <div>
                <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                  ব্যবহারকারী নির্বাচন করুন
                </label>
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="sm" />
                    <span className={`ml-2 text-sm ${colorClasses.text.secondary}`}>
                      ব্যবহারকারী লোড হচ্ছে...
                    </span>
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={formData.selectedUsers.length === users.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedUsers: users.map(user => user.id)
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedUsers: []
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor="selectAll" className={`text-sm font-medium ${colorClasses.text.primary}`}>
                        সবাই নির্বাচন করুন ({users.length})
                      </label>
                    </div>
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedUsers: [...formData.selectedUsers, user.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedUsers: formData.selectedUsers.filter(id => id !== user.id)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <label 
                          htmlFor={`user-${user.id}`} 
                          className={`text-sm ${colorClasses.text.secondary} cursor-pointer flex-1`}
                        >
                          {user.name} ({user.email})
                          {user.is_active ? (
                            <Badge variant="success" size="xs" className="ml-2">সক্রিয়</Badge>
                          ) : (
                            <Badge variant="secondary" size="xs" className="ml-2">নিষ্ক্রিয়</Badge>
                          )}
                        </label>
                      </div>
                    ))}
                    {formData.selectedUsers.length > 0 && (
                      <div className={`text-xs ${colorClasses.text.info} mt-2 p-2 bg-blue-50 rounded`}>
                        {formData.selectedUsers.length} জন ব্যবহারকারী নির্বাচিত
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                অগ্রাধিকার
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
              >
                <option value="normal">সাধারণ</option>
                <option value="medium">গুরুত্বপূর্ণ</option>
                <option value="high">জরুরি</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" icon={Save}>
                ঘোষণা প্রকাশ করুন
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ 
                    title: '', 
                    message: '', 
                    priority: 'normal',
                    announcementType: 'broadcast',
                    selectedUsers: []
                  });
                }}
                icon={X}
              >
                বাতিল
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className={colorClasses.text.secondary}>ঘোষণা লোড হচ্ছে...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="কোন ঘোষণা নেই"
          description="এখনও কোন ঘোষণা তৈরি করা হয়নি। নতুন ঘোষণা তৈরি করুন।"
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getPriorityIcon(announcement.priority)}
                    <h3 className={`font-semibold ${colorClasses.text.primary}`}>
                      {announcement.title}
                    </h3>
                    <Badge 
                      variant={getPriorityColor(announcement.priority)} 
                      size="sm"
                    >
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                    <Badge 
                      variant={announcement.is_active ? 'success' : 'secondary'} 
                      size="sm"
                    >
                      {announcement.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </Badge>
                    {announcement.target_users ? (
                      <Badge variant="info" size="sm">
                        নির্দিষ্ট ({announcement.target_users.length} জন)
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        সকলের জন্য
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`${colorClasses.text.secondary} mb-3`}>
                    {announcement.message}
                  </p>
                  
                  <div className={`text-xs ${colorClasses.text.tertiary}`}>
                    তৈরি করেছেন: {announcement.created_by} • {' '}
                    {new Date(announcement.created_at).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggle(announcement.id)}
                    icon={announcement.is_active ? EyeOff : Eye}
                    title={announcement.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                  >
                    {announcement.is_active ? 'লুকান' : 'দেখান'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(announcement.id)}
                    icon={Trash2}
                    title="মুছে ফেলুন"
                  >
                    মুছুন
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;
