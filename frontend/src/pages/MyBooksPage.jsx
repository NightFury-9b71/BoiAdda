import { useState, useEffect } from 'react';
import { 
  Book, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Trash2,
  Filter,
  Search,
  BookOpen,
  Eye
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge, EmptyState, LoadingSpinner } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';

const MyBooksPage = () => {
  const [activeTab, setActiveTab] = useState('borrowed');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const stats = await api.getUserStatistics(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get books based on active tab from user statistics
  const getFilteredBooks = () => {
    if (!userStats) return [];

    let books = [];
    
    switch (activeTab) {
      case 'borrowed':
        books = userStats.borrowed_books.filter(book => 
          book.status === 'Current' || book.status === 'Overdue'
        );
        break;
      case 'history':
        books = userStats.borrowed_books.filter(book => 
          book.status === 'Returned'
        );
        break;
      case 'pending':
        books = userStats.borrowed_books.filter(book => 
          book.status === 'Pending'
        );
        break;
      case 'donations':
        books = userStats.donated_books;
        break;
      default:
        books = userStats.borrowed_books;
    }

    // Apply search filter
    if (searchTerm) {
      books = books.filter(book => 
        book.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.book_author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      books = books.filter(book => 
        book.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    return books;
  };

  const filteredBooks = getFilteredBooks();

  const handleRenew = async (bookId) => {
    setActionLoading(prev => ({ ...prev, [`renew_${bookId}`]: true }));
    try {
      // TODO: Implement book renewal API
      console.log('Renewing book:', bookId);
      // Reload data after successful renewal
      await loadUserData();
    } catch (error) {
      console.error('Error renewing book:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`renew_${bookId}`]: false }));
    }
  };

  const handleReturn = async (bookCopyId) => {
    setActionLoading(prev => ({ ...prev, [`return_${bookCopyId}`]: true }));
    try {
      await api.returnBook(user.id, bookCopyId);
      // Reload data after successful return
      await loadUserData();
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`return_${bookCopyId}`]: false }));
    }
  };

  const handleRemovePendingRequest = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [`remove_${requestId}`]: true }));
    try {
      // TODO: Implement cancel pending request API
      console.log('Canceling pending request:', requestId);
      await loadUserData();
    } catch (error) {
      console.error('Error canceling request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`remove_${requestId}`]: false }));
    }
  };

  const getStatusBadge = (book) => {
    switch (book.status) {
      case 'Current':
        return <Badge variant="success" icon={CheckCircle}>বর্তমানে ধার</Badge>;
      case 'Overdue':
        return <Badge variant="error" icon={AlertCircle}>মেয়াদ শেষ</Badge>;
      case 'Returned':
        return <Badge variant="info" icon={CheckCircle}>ফেরত দেওয়া</Badge>;
      case 'Pending':
        return <Badge variant="warning" icon={Clock}>অপেক্ষমাণ</Badge>;
      case 'Rejected':
        return <Badge variant="error" icon={AlertCircle}>প্রত্যাখ্যাত</Badge>;
      case 'Approved': // For donations
        return <Badge variant="success" icon={CheckCircle}>অনুমোদিত</Badge>;
      default:
        return <Badge variant="info">{book.status}</Badge>;
    }
  };

  const BookCard = ({ book }) => {
    const isDonation = activeTab === 'donations';
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="flex">
          <img
            src={book.cover_img || '/placeholder-book.svg'}
            alt={book.book_title}
            className="w-20 h-28 object-cover rounded-md"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x400/22c55e/ffffff?text=বই";
            }}
          />
          
          <div className="flex-1 ml-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={`font-semibold ${colorClasses.text.primary} line-clamp-1`}>
                  {book.book_title}
                </h3>
                <p className={`text-sm ${colorClasses.text.secondary}`}>{book.book_author}</p>
                <p className={`text-xs ${colorClasses.text.tertiary}`}>{book.book_category}</p>
              </div>
              {getStatusBadge(book)}
            </div>

            <div className="space-y-1 text-xs text-gray-500 mb-3">
              {!isDonation && book.borrowed_date && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  ধার: {new Date(book.borrowed_date).toLocaleDateString('bn-BD')}
                </div>
              )}
              {!isDonation && book.due_date && (book.status === 'Current' || book.status === 'Overdue') && (
                <div className={`flex items-center ${book.is_overdue ? 'text-red-600' : ''}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  ফেরত: {new Date(book.due_date).toLocaleDateString('bn-BD')} 
                  {book.is_overdue && ' (মেয়াদ শেষ)'}
                </div>
              )}
              {!isDonation && book.return_date && (
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  ফেরত: {new Date(book.return_date).toLocaleDateString('bn-BD')}
                </div>
              )}
              {isDonation && book.donation_date && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  দান: {new Date(book.donation_date).toLocaleDateString('bn-BD')}
                </div>
              )}
              {book.admin_comment && (
                <div className="flex items-start text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{book.admin_comment}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {(book.status === 'Current' || book.status === 'Overdue') && (
                <>
                  <Button 
                    size="sm" 
                    variant="success" 
                    onClick={() => handleRenew(book.id)}
                    disabled={actionLoading[`renew_${book.id}`]}
                    loading={actionLoading[`renew_${book.id}`]}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    নবায়ন
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => handleReturn(book.book_copy_id)}
                    disabled={actionLoading[`return_${book.book_copy_id}`]}
                    loading={actionLoading[`return_${book.book_copy_id}`]}
                  >
                    ফেরত দিন
                  </Button>
                </>
              )}
              
              {book.status === 'Pending' && (
                <Button size="sm" variant="warning" disabled>
                  <Clock className="h-3 w-3 mr-1" />
                  অপেক্ষায়
                </Button>
              )}
              
              {isDonation && book.status === 'Pending' && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleRemovePendingRequest(book.id)}
                  disabled={actionLoading[`remove_${book.id}`]}
                  loading={actionLoading[`remove_${book.id}`]}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  বাতিল
                </Button>
              )}
              
              <Button size="sm" variant="ghost">
                <Eye className="h-3 w-3 mr-1" />
                দেখুন
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const tabs = [
    { 
      id: 'borrowed', 
      label: 'বর্তমানে ধার', 
      count: userStats ? userStats.current_borrowed : 0 
    },
    { 
      id: 'history', 
      label: 'ইতিহাস', 
      count: userStats ? userStats.borrowed_books.filter(b => b.status === 'Returned').length : 0 
    },
    { 
      id: 'pending', 
      label: 'অপেক্ষমাণ', 
      count: userStats ? userStats.pending_borrow_requests : 0 
    },
    { 
      id: 'donations', 
      label: 'দান', 
      count: userStats ? userStats.total_donated : 0 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="আমার বই"
        subtitle="আপনার ধার নেওয়া বই, ইতিহাস এবং দান পরিচালনা করুন"
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className={colorClasses.text.secondary}>ডেটা লোড হচ্ছে...</p>
          </div>
        </div>
      ) : !user ? (
        <EmptyState
          icon={BookOpen}
          title="লগইন প্রয়োজন"
          description="আপনার বইয়ের তথ্য দেখতে অনুগ্রহ করে লগইন করুন।"
        />
      ) : (
        <>
          {/* Statistics Cards */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center p-4">
                  <div className={`text-2xl font-bold ${colorClasses.text.accent}`}>
                    {userStats.current_borrowed}
                  </div>
                  <div className={`text-sm ${colorClasses.text.secondary}`}>বর্তমানে ধার</div>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>
                    {userStats.total_borrowed}
                  </div>
                  <div className={`text-sm ${colorClasses.text.secondary}`}>মোট ধার</div>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className={`text-2xl font-bold ${userStats.overdue_books > 0 ? 'text-red-600' : colorClasses.text.primary}`}>
                    {userStats.overdue_books}
                  </div>
                  <div className={`text-sm ${colorClasses.text.secondary}`}>মেয়াদোত্তীর্ণ</div>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className={`text-2xl font-bold ${colorClasses.text.accent}`}>
                    {userStats.total_donated}
                  </div>
                  <div className={`text-sm ${colorClasses.text.secondary}`}>মোট দান</div>
                </div>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Card padding="p-0">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? `${colorClasses.text.accent} border-b-2 border-green-500 bg-green-50`
                      : `${colorClasses.text.secondary} hover:text-gray-900`
                  }`}
                >
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

          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="বইয়ের নাম বা লেখকের নাম খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
                >
                  <option value="all">সব অবস্থা</option>
                  <option value="current">বর্তমানে ধার</option>
                  <option value="returned">ফেরত দেওয়া</option>
                  <option value="pending">অপেক্ষমাণ</option>
                  <option value="overdue">মেয়াদোত্তীর্ণ</option>
                  {activeTab === 'donations' && (
                    <>
                      <option value="approved">অনুমোদিত</option>
                      <option value="rejected">প্রত্যাখ্যাত</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </Card>

          {/* Books List */}
          {filteredBooks.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="কোন বই পাওয়া যায়নি"
              description={
                searchTerm 
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোন বই পাওয়া যায়নি।"
                  : activeTab === 'borrowed'
                  ? "আপনি এখনো কোন বই ধার নেননি।"
                  : activeTab === 'history'
                  ? "আপনার কোন বই ফেরতের ইতিহাস নেই।"
                  : activeTab === 'pending'
                  ? "আপনার কোন অপেক্ষমাণ অনুরোধ নেই।"
                  : "আপনার কোন দানের ইতিহাস নেই।"
              }
              action={
                activeTab === 'borrowed' && (
                  <Button variant="primary">বই খুঁজুন</Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              <p className={`text-sm ${colorClasses.text.secondary}`}>
                {filteredBooks.length} টি বই পাওয়া গেছে
              </p>
              
              <div className="grid gap-4">
                {filteredBooks.map((book) => (
                  <BookCard key={`${book.id}_${activeTab}`} book={book} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBooksPage;
