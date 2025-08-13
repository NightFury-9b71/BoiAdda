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
  Gift,
  Megaphone
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge, EmptyState, LoadingSpinner, StatsCard, Modal } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import { useAuth } from '../context/AuthContext.jsx';
import AnnouncementManager from '../components/AnnouncementManager.jsx';
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
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [libraryStats, setLibraryStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [borrowReqs, donationReqs, libStats] = await Promise.all([
        api.getBorrowRequests(),
        api.getDonationRequests(),
        api.getLibraryStatistics()
      ]);
      setBorrowRequests(borrowReqs);
      setDonationRequests(donationReqs);
      setLibraryStats(libStats);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatsCardClick = async (type) => {
    setModalLoading(true);
    setShowModal(true);
    
    try {
      let data = [];
      let title = '';
      
      switch (type) {
        case 'books':
          data = await api.getDetailedBooks();
          title = 'সকল বই';
          break;
        case 'available_books':
          data = await api.getDetailedAvailableBooks();
          title = 'উপলব্ধ বই';
          break;
        case 'users':
          data = await api.getDetailedUsers();
          title = 'সকল ব্যবহারকারী';
          break;
        case 'borrowed':
          data = await api.getDetailedBorrowedBooks();
          title = 'ধার নেওয়া বই';
          break;
        case 'donations':
          data = await api.getDetailedDonations();
          title = 'দানকৃত বই';
          break;
        case 'active_users':
          const allUsers = await api.getDetailedUsers();
          data = allUsers.filter(user => user.is_active);
          title = 'সক্রিয় ব্যবহারকারী';
          break;
        case 'new_users':
          const allUsersForNew = await api.getDetailedUsers();
          data = allUsersForNew.filter(user => user.is_new);
          title = 'নতুন ব্যবহারকারী';
          break;
        default:
          data = [];
          title = 'তথ্য';
      }
      
      setModalData(data);
      setModalTitle(title);
    } catch (error) {
      console.error('Error loading modal data:', error);
      setModalData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!modalData || modalData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className={colorClasses.text.secondary}>কোন তথ্য পাওয়া যায়নি</p>
        </div>
      );
    }

    // Render different content based on modal title
    if (modalTitle === 'সকল বই' || modalTitle === 'উপলব্ধ বই') {
      return (
        <div className="space-y-4">
          {modalData.map((book) => (
            <div key={book.id} className={`p-4 border rounded-lg ${colorClasses.border.primary}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-semibold ${colorClasses.text.primary}`}>{book.title}</h4>
                  <p className={colorClasses.text.secondary}>লেখক: {book.author}</p>
                  <p className={colorClasses.text.secondary}>বিভাগ: {book.category}</p>
                  <p className={colorClasses.text.secondary}>দাতা: {book.donor_name}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${colorClasses.text.secondary}`}>
                    মোট কপি: {book.total_copies}
                  </div>
                  <div className={`text-sm ${colorClasses.text.success}`}>
                    উপলব্ধ: {book.available_copies}
                  </div>
                  <div className={`text-sm ${colorClasses.text.warning}`}>
                    ধার: {book.borrowed_copies}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (modalTitle === 'সকল ব্যবহারকারী' || modalTitle === 'সক্রিয় ব্যবহারকারী' || modalTitle === 'নতুন ব্যবহারকারী') {
      return (
        <div className="space-y-4">
          {modalData.map((user) => (
            <div key={user.id} className={`p-4 border rounded-lg ${colorClasses.border.primary}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-semibold ${colorClasses.text.primary}`}>{user.name}</h4>
                  <p className={colorClasses.text.secondary}>ইমেইল: {user.email}</p>
                  <p className={colorClasses.text.secondary}>ফোন: {user.phone || 'নেই'}</p>
                  <p className={colorClasses.text.secondary}>ভূমিকা: {user.role_name}</p>
                  <p className={colorClasses.text.secondary}>
                    যোগদানের তারিখ: {new Date(user.created_at).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${colorClasses.text.secondary}`}>
                    মোট ধার: {user.total_borrowed}
                  </div>
                  <div className={`text-sm ${colorClasses.text.warning}`}>
                    বর্তমান ধার: {user.current_borrowed}
                  </div>
                  <div className={`text-sm ${colorClasses.text.info}`}>
                    মোট দান: {user.total_donated}
                  </div>
                  {user.is_new && (
                    <Badge variant="info" size="sm">নতুন</Badge>
                  )}
                  {user.is_active && (
                    <Badge variant="success" size="sm">সক্রিয়</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (modalTitle === 'ধার নেওয়া বই') {
      return (
        <div className="space-y-4">
          {modalData.map((borrow) => (
            <div key={borrow.transaction_id} className={`p-4 border rounded-lg ${colorClasses.border.primary} ${borrow.is_overdue ? 'border-red-300 bg-red-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-semibold ${colorClasses.text.primary}`}>{borrow.book_title}</h4>
                  <p className={colorClasses.text.secondary}>লেখক: {borrow.book_author}</p>
                  <p className={colorClasses.text.secondary}>ধারকারী: {borrow.user_name}</p>
                  <p className={colorClasses.text.secondary}>ইমেইল: {borrow.user_email}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${colorClasses.text.secondary}`}>
                    ধারের তারিখ: {new Date(borrow.borrowed_date).toLocaleDateString('bn-BD')}
                  </div>
                  <div className={`text-sm ${borrow.is_overdue ? 'text-red-600' : colorClasses.text.secondary}`}>
                    ফেরতের তারিখ: {new Date(borrow.due_date).toLocaleDateString('bn-BD')}
                  </div>
                  <div className={`text-sm ${colorClasses.text.secondary}`}>
                    {borrow.is_overdue ? `${Math.abs(borrow.days_until_due)} দিন বিলম্ব` : `${borrow.days_until_due} দিন বাকি`}
                  </div>
                  {borrow.is_overdue && (
                    <Badge variant="error" size="sm">মেয়াদোত্তীর্ণ</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (modalTitle === 'দানকৃত বই') {
      return (
        <div className="space-y-4">
          {modalData.map((donation) => (
            <div key={donation.transaction_id} className={`p-4 border rounded-lg ${colorClasses.border.primary}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-semibold ${colorClasses.text.primary}`}>{donation.book_title}</h4>
                  <p className={colorClasses.text.secondary}>লেখক: {donation.book_author}</p>
                  <p className={colorClasses.text.secondary}>বিভাগ: {donation.book_category}</p>
                  <p className={colorClasses.text.secondary}>দাতা: {donation.donor_name}</p>
                  {donation.admin_comment && (
                    <p className={`text-sm ${colorClasses.text.tertiary} mt-2`}>
                      মন্তব্য: {donation.admin_comment}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm ${colorClasses.text.secondary}`}>
                    দানের তারিখ: {new Date(donation.donation_date).toLocaleDateString('bn-BD')}
                  </div>
                  <div className={`text-sm ${colorClasses.text.success}`}>
                    কপি যোগ: {donation.copies_added}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <div>Unknown data type</div>;
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

  const handleUserClick = (user) => {
    if (user) {
      setSelectedUser(user);
      setShowUserModal(true);
    }
  };

  const handleBookClick = (book) => {
    if (book) {
      setSelectedBook(book);
      setShowBookModal(true);
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
                    {request.user ? (
                      <button
                        onClick={() => handleUserClick(request.user)}
                        className={`${colorClasses.text.accent} hover:underline cursor-pointer font-medium`}
                      >
                        {request.user.name}
                      </button>
                    ) : (
                      <span className={colorClasses.text.secondary}>
                        User ID: {request.user_id}
                      </span>
                    )}
                    {request.user?.email && (
                      <span className={`ml-2 text-xs ${colorClasses.text.tertiary}`}>
                        ({request.user.email})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <BookMarked className="h-4 w-4 mr-2 text-gray-400" />
                    {request.book ? (
                      <button
                        onClick={() => handleBookClick(request.book)}
                        className={`${colorClasses.text.accent} hover:underline cursor-pointer font-medium`}
                      >
                        {request.book.title}
                      </button>
                    ) : (
                      <span className={colorClasses.text.secondary}>
                        Book ID: {request.book_id}
                      </span>
                    )}
                  </div>
                  
                  {request.book?.author && (
                    <div className="flex items-center ml-6">
                      <span className={`text-xs ${colorClasses.text.tertiary}`}>
                        লেখক: {request.book.author}
                      </span>
                      {request.book?.category && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 ${colorClasses.text.tertiary}`}>
                          {request.book.category}
                        </span>
                      )}
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
    },
    {
      id: 'announcements',
      label: 'ঘোষণা ব্যবস্থাপনা',
      count: null,
      icon: Megaphone
    }
  ];

  const filteredRequests = getFilteredRequests();

  // User Details Modal Component
  const UserDetailsModal = () => (
    showUserModal && selectedUser && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary}`}>
              ব্যবহারকারীর তথ্য
            </h3>
            <button
              onClick={() => setShowUserModal(false)}
              className={`p-1 rounded-full hover:bg-gray-100 ${colorClasses.text.tertiary}`}
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${colorClasses.bg.accent} flex items-center justify-center`}>
                <UserIcon className={`h-6 w-6 ${colorClasses.text.accent}`} />
              </div>
              <div>
                <h4 className={`font-medium ${colorClasses.text.primary}`}>
                  {selectedUser.name}
                </h4>
                <p className={`text-sm ${colorClasses.text.tertiary}`}>
                  {selectedUser.role_name === 'admin' ? 'অ্যাডমিন' : 'সাধারণ ব্যবহারকারী'}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                  ইমেইল
                </label>
                <p className={`text-sm ${colorClasses.text.primary}`}>
                  {selectedUser.email}
                </p>
              </div>
              
              {selectedUser.phone && (
                <div>
                  <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                    ফোন
                  </label>
                  <p className={`text-sm ${colorClasses.text.primary}`}>
                    {selectedUser.phone}
                  </p>
                </div>
              )}
              
              <div>
                <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                  ব্যবহারকারী আইডি
                </label>
                <p className={`text-sm ${colorClasses.text.primary}`}>
                  {selectedUser.id}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowUserModal(false)}
              className="w-full"
            >
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    )
  );

  // Book Details Modal Component
  const BookDetailsModal = () => (
    showBookModal && selectedBook && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary}`}>
              বইয়ের তথ্য
            </h3>
            <button
              onClick={() => setShowBookModal(false)}
              className={`p-1 rounded-full hover:bg-gray-100 ${colorClasses.text.tertiary}`}
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {selectedBook.cover_img ? (
                  <img
                    src={selectedBook.cover_img}
                    alt={selectedBook.title}
                    className="w-16 h-20 object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-16 h-20 rounded-md ${colorClasses.bg.secondary} flex items-center justify-center ${selectedBook.cover_img ? 'hidden' : ''}`}>
                  <BookOpen className={`h-8 w-8 ${colorClasses.text.accent}`} />
                </div>
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${colorClasses.text.primary} mb-1`}>
                  {selectedBook.title}
                </h4>
                <p className={`text-sm ${colorClasses.text.secondary} mb-2`}>
                  {selectedBook.author}
                </p>
                {selectedBook.category && (
                  <span className={`inline-block px-2 py-1 rounded-full text-xs bg-gray-100 ${colorClasses.text.tertiary}`}>
                    {selectedBook.category}
                  </span>
                )}
              </div>
            </div>
            
            {selectedBook.description && (
              <div>
                <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                  বিবরণ
                </label>
                <p className={`text-sm ${colorClasses.text.primary} mt-1`}>
                  {selectedBook.description}
                </p>
              </div>
            )}
            
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                  ISBN
                </label>
                <p className={`text-sm ${colorClasses.text.primary}`}>
                  {selectedBook.isbn}
                </p>
              </div>
              
              <div>
                <label className={`text-xs font-medium ${colorClasses.text.secondary} uppercase tracking-wider`}>
                  বই আইডি
                </label>
                <p className={`text-sm ${colorClasses.text.primary}`}>
                  {selectedBook.id}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowBookModal(false)}
              className="w-full"
            >
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    )
  );

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
          {/* Library Statistics */}
          <div>
            <h2 className={`text-xl font-semibold ${colorClasses.text.primary} mb-6`}>লাইব্রেরি পরিসংখ্যান</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                value={libraryStats?.total_books || "0"}
                label="মোট বই"
                icon={BookOpen}
                color="green"
                onClick={() => handleStatsCardClick('books')}
              />
              <StatsCard
                value={libraryStats?.available_books || "0"}
                label="উপলব্ধ বই"
                icon={BookMarked}
                color="blue"
                onClick={() => handleStatsCardClick('available_books')}
              />
              <StatsCard
                value={libraryStats?.borrowed_books || "0"}
                label="ধার নেওয়া বই"
                icon={Calendar}
                color="orange"
                onClick={() => handleStatsCardClick('borrowed')}
              />
              <StatsCard
                value={libraryStats?.total_users || "0"}
                label="মোট ব্যবহারকারী"
                icon={Users}
                color="purple"
                onClick={() => handleStatsCardClick('users')}
              />
              <StatsCard
                value={libraryStats?.active_users || "0"}
                label="সক্রিয় ব্যবহারকারী"
                icon={UserIcon}
                color="green"
                onClick={() => handleStatsCardClick('active_users')}
              />
              <StatsCard
                value={libraryStats?.new_users || "0"}
                label="নতুন ব্যবহারকারী"
                icon={TrendingUp}
                color="blue"
                onClick={() => handleStatsCardClick('new_users')}
              />
              <StatsCard
                value={libraryStats?.total_donations || "0"}
                label="মোট দান"
                icon={Gift}
                color="purple"
                onClick={() => handleStatsCardClick('donations')}
              />
              <StatsCard
                value={totalPendingRequests}
                label="অপেক্ষমাণ অনুরোধ"
                icon={Clock}
                color="orange"
              />
            </div>
          </div>

          {/* Request Management Statistics */}
          <div>
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>অনুরোধ ব্যবস্থাপনা</h3>
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
                  {tab.count !== null && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Tab Content */}
          {activeTab === 'announcements' ? (
            <AnnouncementManager />
          ) : (
            <>
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
        </>
      )}

      {/* Statistics Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        size="lg"
      >
        {renderModalContent()}
      </Modal>

      {/* Modals */}
      <UserDetailsModal />
      <BookDetailsModal />
      <CommentModal />
    </div>
  );
};

export default AdminDashboard;
