import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  User as UserIcon,
  AlertCircle,
  Search,
  Filter,
  MessageSquare,
  FileText,
  TrendingUp,
  BookMarked,
  Gift
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge, EmptyState, LoadingSpinner } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('borrow-requests');
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const { user } = useAuth();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [borrowReqs, donationReqs] = await Promise.all([
        api.getBorrowRequests(),
        api.getDonationRequests()
      ]);
      setBorrowRequests(borrowReqs);
      setDonationRequests(donationReqs);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminComment('');
    setShowCommentModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !user?.id) return;

    const requestId = selectedRequest.id;
    const actionKey = `${actionType}_${requestId}`;
    
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));
    try {
      const actionData = {
        adminId: user.id,
        comment: adminComment || undefined
      };

      if (activeTab === 'borrow-requests') {
        if (actionType === 'approve') {
          await api.approveBorrow({
            txId: requestId,
            adminId: user.id,
            comment: adminComment
          });
        } else {
          await api.rejectBorrow({
            txId: requestId,
            adminId: user.id,
            comment: adminComment
          });
        }
      } else {
        if (actionType === 'approve') {
          await api.approveDonation({
            txId: requestId,
            adminId: user.id,
            comment: adminComment
          });
        } else {
          await api.rejectDonation({
            txId: requestId,
            adminId: user.id,
            comment: adminComment
          });
        }
      }

      // Reload requests after successful action
      await loadRequests();
      setShowCommentModal(false);
      setSelectedRequest(null);
      setAdminComment('');
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const getFilteredRequests = () => {
    const requests = activeTab === 'borrow-requests' ? borrowRequests : donationRequests;
    
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        (request.user && request.user.name && request.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.book && request.book.title && request.book.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const RequestCard = ({ request }) => {
    const isBorrowRequest = activeTab === 'borrow-requests';
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full ${colorClasses.bg.secondary} flex items-center justify-center`}>
                  {isBorrowRequest ? (
                    <BookOpen className={`h-6 w-6 ${colorClasses.text.accent}`} />
                  ) : (
                    <Gift className={`h-6 w-6 ${colorClasses.text.accent}`} />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${colorClasses.text.primary} mb-1`}>
                  {isBorrowRequest ? 'ধার নেওয়ার অনুরোধ' : 'দানের অনুরোধ'}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={colorClasses.text.secondary}>
                      {request.user?.name || `User ID: ${request.user_id}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <BookMarked className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={colorClasses.text.secondary}>
                      {request.book?.title || `Book ID: ${request.book_id}`}
                    </span>
                  </div>
                  
                  {request.book?.author && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={colorClasses.text.tertiary}>
                        {request.book.author}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={colorClasses.text.tertiary}>
                      অনুরোধ: {new Date(request.created_at).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  {isBorrowRequest && request.due_date && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={colorClasses.text.tertiary}>
                        ফেরত: {new Date(request.due_date).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="warning" icon={Clock}>
                অপেক্ষমাণ
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Request ID: {request.id}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleAction(request, 'reject')}
                disabled={actionLoading[`reject_${request.id}`]}
                loading={actionLoading[`reject_${request.id}`]}
              >
                <XCircle className="h-4 w-4 mr-1" />
                প্রত্যাখ্যান
              </Button>
              
              <Button
                size="sm"
                variant="success"
                onClick={() => handleAction(request, 'approve')}
                disabled={actionLoading[`approve_${request.id}`]}
                loading={actionLoading[`approve_${request.id}`]}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                অনুমোদন
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Statistics calculations
  const totalBorrowRequests = borrowRequests.length;
  const totalDonationRequests = donationRequests.length;
  const totalPendingRequests = totalBorrowRequests + totalDonationRequests;

  const tabs = [
    {
      id: 'borrow-requests',
      label: 'ধার নেওয়ার অনুরোধ',
      count: totalBorrowRequests,
      icon: BookOpen
    },
    {
      id: 'donation-requests',
      label: 'দানের অনুরোধ',
      count: totalDonationRequests,
      icon: Gift
    }
  ];

  const filteredRequests = getFilteredRequests();

  // Comment Modal Component
  const CommentModal = () => (
    showCommentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
            {actionType === 'approve' ? 'অনুরোধ অনুমোদন' : 'অনুরোধ প্রত্যাখ্যান'}
          </h3>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
              মন্তব্য (ঐচ্ছিক)
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="এই সিদ্ধান্তের কারণ লিখুন..."
              className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} resize-none`}
              rows="4"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCommentModal(false);
                setSelectedRequest(null);
                setAdminComment('');
              }}
              className="flex-1"
            >
              বাতিল
            </Button>
            <Button
              variant={actionType === 'approve' ? 'success' : 'danger'}
              onClick={confirmAction}
              loading={actionLoading[`${actionType}_${selectedRequest?.id}`]}
              className="flex-1"
            >
              {actionType === 'approve' ? 'অনুমোদন করুন' : 'প্রত্যাখ্যান করুন'}
            </Button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="অ্যাডমিন ড্যাশবোর্ড"
        subtitle="ধার নেওয়া এবং দানের অনুরোধগুলি পরিচালনা করুন"
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className={colorClasses.text.secondary}>অনুরোধ লোড হচ্ছে...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center p-4">
                <div className={`text-2xl font-bold ${colorClasses.text.accent}`}>
                  {totalPendingRequests}
                </div>
                <div className={`text-sm ${colorClasses.text.secondary}`}>মোট অপেক্ষমাণ</div>
              </div>
            </Card>
            <Card>
              <div className="text-center p-4">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>
                  {totalBorrowRequests}
                </div>
                <div className={`text-sm ${colorClasses.text.secondary}`}>ধার নেওয়ার অনুরোধ</div>
              </div>
            </Card>
            <Card>
              <div className="text-center p-4">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>
                  {totalDonationRequests}
                </div>
                <div className={`text-sm ${colorClasses.text.secondary}`}>দানের অনুরোধ</div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Card padding="p-0">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center ${
                    activeTab === tab.id
                      ? `${colorClasses.text.accent} border-b-2 border-green-500 bg-green-50`
                      : `${colorClasses.text.secondary} hover:text-gray-900`
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Search */}
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="ব্যবহারকারী বা বইয়ের নাম খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={activeTab === 'borrow-requests' ? BookOpen : Gift}
              title="কোন অনুরোধ পাওয়া যায়নি"
              description={
                searchTerm 
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোন অনুরোধ পাওয়া যায়নি।"
                  : activeTab === 'borrow-requests'
                  ? "কোন ধার নেওয়ার অনুরোধ নেই।"
                  : "কোন দানের অনুরোধ নেই।"
              }
            />
          ) : (
            <div className="space-y-4">
              <p className={`text-sm ${colorClasses.text.secondary}`}>
                {filteredRequests.length} টি অনুরোধ পাওয়া গেছে
              </p>
              
              <div className="grid gap-4">
                {filteredRequests.map((request) => (
                  <RequestCard key={`${activeTab}_${request.id}`} request={request} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Comment Modal */}
      <CommentModal />
    </div>
  );
};

export default AdminDashboard;
