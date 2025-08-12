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
  Heart,
  Eye
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge, EmptyState, LoadingSpinner } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import api from '../api.js';

const MyBooksPage = () => {
  const [activeTab, setActiveTab] = useState('borrowed');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadBooks();
  }, [activeTab]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      // This would typically call different endpoints based on activeTab
      // For now, we'll simulate with sample data
      const sampleBooks = [
        {
          id: 1,
          title: 'বাংলা সাহিত্যের ইতিহাস',
          author: 'ড. মুহাম্মদ শহীদুল্লাহ',
          cover: '/book1.png',
          borrowedDate: '২০২৪-০১-১৫',
          dueDate: '২০২৪-০২-১৫',
          status: 'borrowed',
          daysLeft: 5
        },
        {
          id: 2,
          title: 'রবীন্দ্রনাথের গল্প',
          author: 'রবীন্দ্রনাথ ঠাকুর',
          cover: '/book2.png',
          borrowedDate: '২০২৪-০১-১০',
          returnedDate: '২০২৪-০২-০৮',
          status: 'returned'
        },
        {
          id: 3,
          title: 'আধুনিক বাংলা কবিতা',
          author: 'বিভিন্ন কবি',
          cover: '/book3.png',
          status: 'wishlist',
          addedDate: '২০২৪-০১-২০'
        }
      ];
      setBooks(sampleBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesTab = activeTab === 'borrowed' 
      ? book.status === 'borrowed'
      : activeTab === 'history'
      ? book.status === 'returned'
      : activeTab === 'wishlist'
      ? book.status === 'wishlist'
      : true;

    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;

    return matchesTab && matchesSearch && matchesFilter;
  });

  const handleRenew = async (bookId) => {
    try {
      // API call to renew book
      console.log('Renewing book:', bookId);
      // Update local state or reload
    } catch (error) {
      console.error('Error renewing book:', error);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      // API call to return book
      console.log('Returning book:', bookId);
      // Update local state or reload
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      // API call to remove from wishlist
      console.log('Removing from wishlist:', bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const getStatusBadge = (book) => {
    switch (book.status) {
      case 'borrowed':
        if (book.daysLeft <= 3) {
          return <Badge variant="error" icon={AlertCircle}>শীঘ্রই মেয়াদ শেষ</Badge>;
        }
        return <Badge variant="success" icon={CheckCircle}>ধার নেওয়া</Badge>;
      case 'returned':
        return <Badge variant="info" icon={CheckCircle}>ফেরত দেওয়া</Badge>;
      case 'wishlist':
        return <Badge variant="warning" icon={Heart}>উইশলিস্ট</Badge>;
      default:
        return null;
    }
  };

  const BookCard = ({ book }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex">
        <img
          src={book.cover}
          alt={book.title}
          className="w-20 h-28 object-cover rounded-md"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400/22c55e/ffffff?text=বই";
          }}
        />
        
        <div className="flex-1 ml-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-semibold ${colorClasses.text.primary} line-clamp-1`}>
                {book.title}
              </h3>
              <p className={`text-sm ${colorClasses.text.secondary}`}>{book.author}</p>
            </div>
            {getStatusBadge(book)}
          </div>

          <div className="space-y-1 text-xs text-gray-500 mb-3">
            {book.borrowedDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                ধার: {book.borrowedDate}
              </div>
            )}
            {book.dueDate && (
              <div className={`flex items-center ${book.daysLeft <= 3 ? 'text-red-600' : ''}`}>
                <Clock className="h-3 w-3 mr-1" />
                ফেরত: {book.dueDate} {book.daysLeft && `(${book.daysLeft} দিন বাকি)`}
              </div>
            )}
            {book.returnedDate && (
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                ফেরত: {book.returnedDate}
              </div>
            )}
            {book.addedDate && (
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                যোগ করা: {book.addedDate}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {book.status === 'borrowed' && (
              <>
                <Button size="sm" variant="success" onClick={() => handleRenew(book.id)}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  নবায়ন
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleReturn(book.id)}>
                  ফেরত দিন
                </Button>
              </>
            )}
            
            {book.status === 'wishlist' && (
              <>
                <Button size="sm" variant="primary">
                  <BookOpen className="h-3 w-3 mr-1" />
                  ধার নিন
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleRemoveFromWishlist(book.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  মুছুন
                </Button>
              </>
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

  const tabs = [
    { id: 'borrowed', label: 'বর্তমানে ধার', count: books.filter(b => b.status === 'borrowed').length },
    { id: 'history', label: 'ইতিহাস', count: books.filter(b => b.status === 'returned').length },
    { id: 'wishlist', label: 'উইশলিস্ট', count: books.filter(b => b.status === 'wishlist').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="আমার বই"
        subtitle="আপনার ধার নেওয়া বই, ইতিহাস এবং উইশলিস্ট পরিচালনা করুন"
      />

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
              <option value="borrowed">ধার নেওয়া</option>
              <option value="returned">ফেরত দেওয়া</option>
              <option value="wishlist">উইশলিস্ট</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Books List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className={colorClasses.text.secondary}>বই লোড হচ্ছে...</p>
          </div>
        </div>
      ) : filteredBooks.length === 0 ? (
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
              : "আপনার উইশলিস্ট খালি।"
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
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;
