import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bell,  Book, Settings, CheckCircle, XCircle, ArrowLeft, BookOpen, Heart, Clock, Palette, Sun, Moon, Leaf, Mountain, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

// Theme configurations
const themes = {
  shamrock: {
    name: "সবুজ বাংলা", // Green Bengal
    icon: Leaf,
    primary: "green",
    secondary: "emerald",
    gradient: "from-green-50 via-emerald-50 to-lime-50",
    headerBg: "bg-white/90",
    userBg: "bg-green-50",
    adminBg: "bg-emerald-50",
    userAccent: "green",
    adminAccent: "emerald",
    userGradient: "from-green-600 to-emerald-500",
    adminGradient: "from-emerald-500 to-green-600"
  },
  ruby: {
    name: "লাল পদ্মা", // Red Padma
    icon: Sun,
    primary: "red",
    secondary: "rose",
    gradient: "from-red-50 via-rose-50 to-pink-50",
    headerBg: "bg-white/90",
    userBg: "bg-red-50",
    adminBg: "bg-rose-50",
    userAccent: "red",
    adminAccent: "rose",
    userGradient: "from-red-600 to-rose-500",
    adminGradient: "from-rose-500 to-red-600"
  },
  jute: {
    name: "পাটের রং", // Color of Jute
    icon: Mountain,
    primary: "amber",
    secondary: "yellow",
    gradient: "from-amber-50 via-yellow-50 to-orange-50",
    headerBg: "bg-white/90",
    userBg: "bg-amber-50",
    adminBg: "bg-yellow-50",
    userAccent: "amber",
    adminAccent: "yellow",
    userGradient: "from-amber-600 to-yellow-500",
    adminGradient: "from-yellow-500 to-amber-600"
  },
  nilgiri: {
    name: "নীল পাহাড়", // Blue Hills
    icon: Moon,
    primary: "blue",
    secondary: "indigo",
    gradient: "from-blue-50 via-indigo-50 to-violet-50",
    headerBg: "bg-white/90",
    userBg: "bg-blue-50",
    adminBg: "bg-indigo-50",
    userAccent: "blue",
    adminAccent: "indigo",
    userGradient: "from-blue-600 to-indigo-500",
    adminGradient: "from-indigo-500 to-blue-600"
  }
};

function UserView({ currentUserId, theme }) {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: api.getBooks,
  });
  
  const queryClient = useQueryClient();
  
  const borrowMutation = useMutation({
    mutationFn: api.borrowBook,
    onSuccess: () => {
      toast.success('Borrow request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const donateMutation = useMutation({
    mutationFn: api.donateBook,
    onSuccess: () => {
      toast.success('Donation request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const returnMutation = useMutation({
    mutationFn: api.returnBook,
    onSuccess: () => {
      toast.success('Book returned successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold text-${theme.userAccent}-800 flex items-center gap-2`}>
            <BookOpen className={`w-6 h-6 sm:w-7 sm:h-7 text-${theme.userAccent}-600`} />
            Available Books
          </h2>
          <p className={`text-${theme.userAccent}-600 text-sm mt-1`}>Discover your next great read</p>
        </div>
        <button
          onClick={() => returnMutation.mutate(currentUserId)}
          disabled={returnMutation.isPending}
          className={`bg-gradient-to-r ${theme.userGradient} text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center sm:justify-start`}
        >
          <ArrowLeft className="w-4 h-4" />
          Return Book
        </button>
      </div>
      
      <div className="grid gap-4 max-h-[60vh] sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-current scrollbar-track-transparent">
        {books.map((book) => (
          <div key={book.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0 self-center sm:self-start">
                <img 
                  src={book.cover_img} 
                  alt={book.title}
                  className={`w-16 h-20 object-cover rounded-lg border border-${theme.userAccent}-200 shadow-sm`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className={`w-16 h-20 bg-gradient-to-br from-${theme.userAccent}-100 to-${theme.userAccent}-200 rounded-lg border border-${theme.userAccent}-200 hidden items-center justify-center`}>
                  <Book className={`w-6 h-6 text-${theme.userAccent}-500`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className={`font-semibold text-lg text-${theme.userAccent}-800 truncate`}>{book.title}</h3>
                <p className={`text-${theme.userAccent}-600 text-sm truncate`}>by {book.author}</p>
                <p className={`text-xs text-${theme.userAccent}-500 mb-2`}>Category: {book.category}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    book.available_copies > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {book.available_copies > 0 ? `${book.available_copies} available` : 'Out of stock'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col gap-2 justify-center sm:justify-start">
                <button
                  onClick={() => borrowMutation.mutate({ bookId: book.id, userId: currentUserId })}
                  disabled={borrowMutation.isPending || book.available_copies === 0}
                  className={`bg-${theme.userAccent}-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-${theme.userAccent}-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1 flex-1 sm:flex-initial justify-center`}
                >
                  <BookOpen className="w-3 h-3" />
                  Borrow
                </button>
                <button
                  onClick={() => donateMutation.mutate({ bookId: book.id, userId: currentUserId })}
                  disabled={donateMutation.isPending}
                  className={`bg-${theme.secondary}-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-${theme.secondary}-600 transition-colors disabled:bg-gray-300 flex items-center gap-1 flex-1 sm:flex-initial justify-center`}
                >
                  <Heart className="w-3 h-3" />
                  Donate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminView({ adminId, theme }) {
  const [activeTab, setActiveTab] = useState('borrow');
  
  const { data: borrowRequests = [], isLoading: borrowLoading } = useQuery({
    queryKey: ['borrowRequests'],
    queryFn: api.getBorrowRequests,
    refetchInterval: 5000,
  });
  
  const { data: donationRequests = [], isLoading: donationLoading } = useQuery({
    queryKey: ['donationRequests'],
    queryFn: api.getDonationRequests,
    refetchInterval: 5000,
  });
  
  const queryClient = useQueryClient();
  
  const approveBorrowMutation = useMutation({
    mutationFn: api.approveBorrow,
    onSuccess: () => {
      toast.success('Borrow request approved!');
      queryClient.invalidateQueries({ queryKey: ['borrowRequests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const rejectBorrowMutation = useMutation({
    mutationFn: api.rejectBorrow,
    onSuccess: () => {
      toast.success('Borrow request rejected!');
      queryClient.invalidateQueries({ queryKey: ['borrowRequests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const approveDonationMutation = useMutation({
    mutationFn: api.approveDonation,
    onSuccess: () => {
      toast.success('Donation request approved!');
      queryClient.invalidateQueries({ queryKey: ['donationRequests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const rejectDonationMutation = useMutation({
    mutationFn: api.rejectDonation,
    onSuccess: () => {
      toast.success('Donation request rejected!');
      queryClient.invalidateQueries({ queryKey: ['donationRequests'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isLoading = borrowLoading || donationLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold text-${theme.userAccent}-800 flex items-center gap-2`}>
            <Settings className={`w-6 h-6 sm:w-7 sm:h-7 text-${theme.userAccent}-600`} />
            Admin Panel
          </h2>
          <p className={`text-${theme.userAccent}-600 text-sm mt-1`}>Manage pending requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base ${
              activeTab === 'borrow'
                ? `bg-gradient-to-r ${theme.userGradient} text-white shadow-lg`
                : `bg-${theme.userAccent}-100 text-${theme.userAccent}-700 hover:bg-${theme.userAccent}-200`
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Borrow</span> ({borrowRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('donation')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base ${
              activeTab === 'donation'
                ? `bg-gradient-to-r ${theme.adminGradient} text-white shadow-lg`
                : `bg-${theme.secondary}-100 text-${theme.secondary}-700 hover:bg-${theme.secondary}-200`
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Donation</span> ({donationRequests.length})
          </button>
        </div>
      </div>
      
      <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-current scrollbar-track-transparent">
        {activeTab === 'borrow' && (
          <div className="space-y-3">
            {borrowRequests.length === 0 ? (
              <div className="text-center py-12">
                <Clock className={`w-12 h-12 text-${theme.userAccent}-300 mx-auto mb-3`} />
                <p className={`text-${theme.userAccent}-500`}>No pending borrow requests</p>
              </div>
            ) : (
              borrowRequests.map((request) => (
                <div key={request.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`bg-${theme.userAccent}-100 text-${theme.userAccent}-800 text-xs px-2 py-1 rounded-full font-medium`}>
                          #{request.id}
                        </span>
                        <span className={`text-xs text-${theme.userAccent}-600`}>Borrow Request</span>
                      </div>
                      <p className={`text-sm text-${theme.userAccent}-700 mb-1`}>User ID: {request.user_id}</p>
                      <p className={`text-sm text-${theme.userAccent}-700 mb-1`}>Book Copy ID: {request.book_copy_id}</p>
                      <p className={`text-xs text-${theme.userAccent}-500 mb-1`}>
                        Due Date: {new Date(request.due_date).toLocaleDateString()}
                      </p>
                      <p className={`text-xs text-${theme.userAccent}-500`}>
                        Created: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => approveBorrowMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Approved by admin' 
                        })}
                        disabled={approveBorrowMutation.isPending}
                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 shadow-sm flex-1 sm:flex-initial justify-center"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectBorrowMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Rejected by admin' 
                        })}
                        disabled={rejectBorrowMutation.isPending}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm flex-1 sm:flex-initial justify-center"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'donation' && (
          <div className="space-y-3">
            {donationRequests.length === 0 ? (
              <div className="text-center py-12">
                <Heart className={`w-12 h-12 text-${theme.secondary}-300 mx-auto mb-3`} />
                <p className={`text-${theme.secondary}-500`}>No pending donation requests</p>
              </div>
            ) : (
              donationRequests.map((request) => (
                <div key={request.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`bg-${theme.secondary}-100 text-${theme.secondary}-800 text-xs px-2 py-1 rounded-full font-medium`}>
                          #{request.id}
                        </span>
                        <span className={`text-xs text-${theme.secondary}-600`}>Donation Request</span>
                      </div>
                      <p className={`text-sm text-${theme.secondary}-700 mb-1`}>User ID: {request.user_id}</p>
                      <p className={`text-sm text-${theme.secondary}-700 mb-1`}>Book ID: {request.book_id}</p>
                      <p className={`text-xs text-${theme.secondary}-500`}>
                        Created: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => approveDonationMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Approved by admin' 
                        })}
                        disabled={approveDonationMutation.isPending}
                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 shadow-sm flex-1 sm:flex-initial justify-center"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectDonationMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Rejected by admin' 
                        })}
                        disabled={rejectDonationMutation.isPending}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm flex-1 sm:flex-initial justify-center"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BorrowedBooksView({ theme }) {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['borrowed-books'],
    queryFn: () => api.getBorrowedBooks(3),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>My Borrowed Books</h2>
        <div className={`bg-${theme.userAccent}-100 px-3 py-1 rounded-full`}>
          <span className={`text-sm font-medium text-${theme.userAccent}-800`}>
            {books.length} Active
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {books.map((book) => (
          <div 
            key={book.id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4`}
          >
            <div className="flex gap-4">
              <img 
                src={book.cover_img}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className={`w-20 h-28 bg-${theme.userAccent}-50 rounded-lg hidden items-center justify-center`}>
                <Book className={`w-8 h-8 text-${theme.userAccent}-400`} />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold text-lg text-${theme.userAccent}-800`}>{book.title}</h3>
                <p className={`text-${theme.userAccent}-600 text-sm`}>by {book.author}</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-${theme.userAccent}-50 text-${theme.userAccent}-700`}>
                    Borrowed: {new Date(book.borrowed_date).toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    book.status === 'overdue' 
                      ? 'bg-red-100 text-red-700' 
                      : `bg-${theme.userAccent}-50 text-${theme.userAccent}-700`
                  }`}>
                    Due: {new Date(book.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className={`bg-white rounded-xl p-8 border border-${theme.userAccent}-200 text-center`}>
            <Book className={`w-12 h-12 text-${theme.userAccent}-300 mx-auto mb-4`} />
            <p className={`text-${theme.userAccent}-600`}>No books currently borrowed</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryView({ theme }) {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.getHistory(3),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>Activity History</h2>

      <div className="space-y-4">
        {history.map((activity) => (
          <div 
            key={activity.id}
            className={`bg-white rounded-xl p-4 border border-${theme.userAccent}-200 shadow-sm`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full bg-${theme.userAccent}-50`}>
                {activity.type === 'borrow' ? (
                  <BookOpen className={`w-5 h-5 text-${theme.userAccent}-600`} />
                ) : (
                  <Heart className={`w-5 h-5 text-${theme.userAccent}-600`} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-${theme.userAccent}-800 font-medium`}>{activity.book_title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'returned' 
                      ? 'bg-green-100 text-green-700'
                      : `bg-${theme.userAccent}-100 text-${theme.userAccent}-700`
                  }`}>
                    {activity.status}
                  </span>
                </div>
                
                <p className={`text-sm text-${theme.userAccent}-600`}>
                  {activity.type === 'borrow' ? 'Borrowed' : 'Donated'} on {new Date(activity.date).toLocaleDateString()}
                </p>
                {activity.return_date && (
                  <p className={`text-sm text-${theme.userAccent}-500 mt-1`}>
                    Returned on {new Date(activity.return_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className={`bg-white rounded-xl p-8 border border-${theme.userAccent}-200 text-center`}>
            <Clock className={`w-12 h-12 text-${theme.userAccent}-300 mx-auto mb-4`} />
            <p className={`text-${theme.userAccent}-600`}>No activity history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsView({ theme }) {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(3),
  });

  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: api.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>Notifications</h2>
        <div className={`bg-${theme.userAccent}-100 px-3 py-1 rounded-full`}>
          <span className={`text-sm font-medium text-${theme.userAccent}-800`}>
            {notifications.filter(n => !n.read).length} New
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            onClick={() => !notification.read && markAsReadMutation.mutate(notification.id)}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-4 ${
              !notification.read && `border-l-4 border-l-${theme.userAccent}-500`
            }`}
          >
            <div className="flex gap-4">
              <div className={`p-2 rounded-full ${
                notification.read 
                  ? `bg-${theme.userAccent}-50` 
                  : `bg-${theme.userAccent}-100`
              }`}>
                {notification.type === 'due_date' ? (
                  <Clock className={`w-5 h-5 text-${theme.userAccent}-600`} />
                ) : (
                  <CheckCircle className={`w-5 h-5 text-${theme.userAccent}-600`} />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-${theme.userAccent}-800 ${notification.read ? 'font-medium' : 'font-semibold'}`}>
                  {notification.message}
                </p>
                <p className={`text-sm text-${theme.userAccent}-500 mt-1`}>
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className={`bg-white rounded-xl p-8 border border-${theme.userAccent}-200 text-center`}>
            <Bell className={`w-12 h-12 text-${theme.userAccent}-300 mx-auto mb-4`} />
            <p className={`text-${theme.userAccent}-600`}>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileView({ theme }) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getUserProfile(3),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${theme.userGradient} flex items-center justify-center`}>
          <span className="text-white text-3xl font-bold">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        <div>
          <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>{profile.name}</h2>
          <p className={`text-${theme.userAccent}-600`}>{profile.email}</p>
          <p className={`text-sm text-${theme.userAccent}-500 mt-1`}>
            Member since {new Date(profile.joined_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`bg-white rounded-xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className={`w-5 h-5 text-${theme.userAccent}-600`} />
            <h3 className={`font-semibold text-${theme.userAccent}-800`}>Reading Stats</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Total Borrowed</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{profile.total_borrowed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Total Donated</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{profile.total_donated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Reading Streak</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{profile.reading_streak} days</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <Heart className={`w-5 h-5 text-${theme.userAccent}-600`} />
            <h3 className={`font-semibold text-${theme.userAccent}-800`}>Favorite Genres</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile.favorite_genres.map((genre) => (
              <span 
                key={genre}
                className={`px-3 py-1 rounded-full text-sm bg-${theme.userAccent}-50 text-${theme.userAccent}-700`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookManagementView({ theme }) {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['admin-books'],
    queryFn: () => api.getAllBooks(),
  });

  const queryClient = useQueryClient();

  const addBookMutation = useMutation({
    mutationFn: api.addBook,
    onSuccess: () => {
      toast.success('Book added successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>Book Management</h2>
          <p className={`text-sm text-${theme.userAccent}-600`}>Add, edit and manage books</p>
        </div>
        <button
          onClick={() => {/* TODO: Implement add book modal */}}
          className={`bg-${theme.userAccent}-500 text-white px-4 py-2 rounded-lg hover:bg-${theme.userAccent}-600`}
        >
          Add New Book
        </button>
      </div>

      <div className="grid gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex gap-4">
              <img 
                src={book.cover_img}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className={`w-20 h-28 bg-${theme.userAccent}-50 rounded-lg hidden items-center justify-center`}>
                <Book className={`w-8 h-8 text-${theme.userAccent}-400`} />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold text-lg text-${theme.userAccent}-800`}>{book.title}</h3>
                <p className={`text-${theme.userAccent}-600 text-sm`}>by {book.author}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-${theme.userAccent}-50 text-${theme.userAccent}-700`}>
                    {book.total_copies} Total Copies
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${book.available_copies > 0 ? 'green' : 'red'}-100 text-${book.available_copies > 0 ? 'green' : 'red'}-700`}>
                    {book.available_copies} Available
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {/* TODO: Implement edit */}}
                  className={`p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-200`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement delete */}}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserManagementView({ theme }) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getAllUsers(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>User Management</h2>
          <p className={`text-sm text-${theme.userAccent}-600`}>Manage library members</p>
        </div>
        <div className={`bg-${theme.userAccent}-100 px-3 py-1 rounded-full`}>
          <span className={`text-sm font-medium text-${theme.userAccent}-800`}>
            {users.length} Users
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.userGradient} flex items-center justify-center`}>
                <span className="text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold text-lg text-${theme.userAccent}-800`}>{user.name}</h3>
                <p className={`text-${theme.userAccent}-600 text-sm`}>{user.email}</p>
              </div>
              
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full bg-${theme.userAccent}-50 text-${theme.userAccent}-700`}>
                  {user.borrowed_count} Books Borrowed
                </span>
                <button
                  onClick={() => {/* TODO: Implement user details view */}}
                  className={`p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-200`}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView({ theme }) {
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getLibraryStats(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.userAccent}-500`}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>Library Analytics</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`bg-white rounded-xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className={`w-5 h-5 text-${theme.userAccent}-600`} />
            <h3 className={`font-semibold text-${theme.userAccent}-800`}>Book Statistics</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Total Books</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.total_books}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Currently Borrowed</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.borrowed_books}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Available Books</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.available_books}</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <Heart className={`w-5 h-5 text-${theme.userAccent}-600`} />
            <h3 className={`font-semibold text-${theme.userAccent}-800`}>User Statistics</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Total Users</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.total_users}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>Active Borrowers</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.active_users}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-${theme.userAccent}-600`}>New Users (This Month)</span>
              <span className={`font-semibold text-${theme.userAccent}-800`}>{stats.new_users}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className={`w-5 h-5 text-${theme.userAccent}-600`} />
          <h3 className={`font-semibold text-${theme.userAccent}-800`}>Recent Activity</h3>
        </div>
        
        <div className="space-y-4">
          {stats.recent_activities?.map((activity) => (
            <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg bg-${theme.userAccent}-50`}>
              <div className={`p-2 rounded-full bg-${theme.userAccent}-100`}>
                {activity.type === 'borrow' ? (
                  <BookOpen className={`w-4 h-4 text-${theme.userAccent}-600`} />
                ) : (
                  <Heart className={`w-4 h-4 text-${theme.userAccent}-600`} />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm text-${theme.userAccent}-800`}>{activity.description}</p>
                <p className={`text-xs text-${theme.userAccent}-600`}>
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSettingsView({ theme }) {
  return (
    <div className="p-6 space-y-6">
      <h2 className={`text-2xl font-bold text-${theme.userAccent}-800`}>Admin Settings</h2>

      <div className="grid gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className={`text-lg font-semibold text-${theme.userAccent}-800 mb-4`}>Library Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium text-${theme.userAccent}-700 mb-1`}>
                Maximum Borrow Duration (Days)
              </label>
              <input 
                type="number" 
                className={`w-full rounded-lg border-${theme.userAccent}-200 focus:ring-${theme.userAccent}-500`}
                defaultValue={14}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-${theme.userAccent}-700 mb-1`}>
                Maximum Books Per User
              </label>
              <input 
                type="number" 
                className={`w-full rounded-lg border-${theme.userAccent}-200 focus:ring-${theme.userAccent}-500`}
                defaultValue={5}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className={`text-lg font-semibold text-${theme.userAccent}-800 mb-4`}>Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className={`rounded text-${theme.userAccent}-500 focus:ring-${theme.userAccent}-500`}
                defaultChecked
              />
              <label className={`text-${theme.userAccent}-700`}>
                Send due date reminders
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className={`rounded text-${theme.userAccent}-500 focus:ring-${theme.userAccent}-500`}
                defaultChecked
              />
              <label className={`text-${theme.userAccent}-700`}>
                Notify on new book donations
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoiAdda() {
  const [currentTheme, setCurrentTheme] = useState('shamrock');
  const [activeView, setActiveView] = useState('user'); // 'user' or 'admin'
  const [activeUserPage, setActiveUserPage] = useState('books');
  const [activeAdminPage, setActiveAdminPage] = useState('requests');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userSidebarExpanded, setUserSidebarExpanded] = useState(true);
  const [adminSidebarExpanded, setAdminSidebarExpanded] = useState(true);

  const theme = themes[currentTheme];

  const userMenuItems = [
    { id: 'books', label: 'Available Books', icon: BookOpen },
    { id: 'borrowed', label: 'My Books', icon: Book },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: XCircle },
    { id: 'profile', label: 'Profile', icon: Heart }
  ];

  const adminMenuItems = [
    { id: 'requests', label: 'Manage Requests', icon: Settings },
    { id: 'books', label: 'Book Management', icon: Book },
    { id: 'users', label: 'User Management', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: CheckCircle },
    { id: 'settings', label: 'Settings', icon: XCircle }
  ];

  const renderUserContent = () => {
    switch (activeUserPage) {
      case 'books':
        return <UserView currentUserId={3} theme={theme} />;
        
      case 'borrowed':
        return <BorrowedBooksView theme={theme} />;
        
      case 'history':
        return <HistoryView theme={theme} />;
        
      case 'notifications':
        return <NotificationsView theme={theme} />;
        
      case 'profile':
        return <ProfileView theme={theme} />;
        
      default:
        return <div className="p-6">Page not implemented yet</div>;
    }
  };

  const renderAdminContent = () => {
    switch (activeAdminPage) {
      case 'requests':
        return <AdminView adminId={2} theme={theme} />;
      case 'books':
        return <BookManagementView theme={theme} />;
      case 'users':
        return <UserManagementView theme={theme} />;
      case 'analytics':
        return <AnalyticsView theme={theme} />;
      case 'settings':
        return <AdminSettingsView theme={theme} />;
      default:
        return (
          <div className="p-6">
            <h2 className={`text-2xl font-bold text-${theme.userAccent}-800 mb-4`}>
              {adminMenuItems.find(item => item.id === activeAdminPage)?.label}
            </h2>
            <div className="bg-white rounded-xl p-8 text-center">
              <p className={`text-${theme.userAccent}-600`}>Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br ${theme.gradient}`}>
      {/* Header */}
      <header className={`${theme.headerBg} backdrop-blur-sm shadow-lg`}>
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 bg-gradient-to-r ${theme.userGradient} rounded-xl`}>
                <Book className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-lg sm:text-2xl font-bold text-${theme.primary}-800`}>📚 বই আড্ডা</h1>
                <p className={`text-xs sm:text-sm text-${theme.primary}-600`}>Digital Library Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-6">
              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  className={`bg-${theme.primary}-100 text-${theme.primary}-800 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-${theme.primary}-200 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500`}
                >
                  {Object.entries(themes).map(([key, t]) => (
                    <option key={key} value={key}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Stats - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className={`flex items-center space-x-2 bg-${theme.primary}-100 px-3 py-2 rounded-full`}>
                  <BookOpen className={`h-4 w-4 text-${theme.primary}-600`} />
                  <span className={`text-sm font-medium text-${theme.primary}-800`}>1,247 Books</span>
                </div>
                <div className={`flex items-center space-x-2 bg-${theme.secondary}-100 px-3 py-2 rounded-full`}>
                  <Heart className={`h-4 w-4 text-${theme.secondary}-600`} />
                  <span className={`text-sm font-medium text-${theme.secondary}-800`}>34 Users</span>
                </div>
              </div>

              {/* User Avatar */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${theme.userGradient} rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold text-xs sm:text-sm">JD</span>
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden mt-4 space-x-2">
            <button
              onClick={() => setActiveView('user')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'user'
                  ? `bg-${theme.userAccent}-500 text-white`
                  : `bg-${theme.userAccent}-100 text-${theme.userAccent}-700 hover:bg-${theme.userAccent}-200`
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Reader Portal
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'admin'
                  ? `bg-${theme.adminAccent}-500 text-white`
                  : `bg-${theme.adminAccent}-100 text-${theme.adminAccent}-700 hover:bg-${theme.adminAccent}-200`
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Admin Panel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full gap-6 p-6">
          {/* User Section (Left) - Device Style */}
          <div className="w-1/2 flex flex-col h-full rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* User Section Header */}
            <div className={`${theme.headerBg} shadow-sm p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${theme.userGradient} rounded-lg`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold text-${theme.userAccent}-800`}>Reader Portal</h2>
                    <p className={`text-sm text-${theme.userAccent}-600`}>Browse and manage books</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 bg-${theme.userAccent}-100 px-3 py-2 rounded-lg`}>
                  <BookOpen className={`h-4 w-4 text-${theme.userAccent}-600`} />
                  <span className={`text-sm font-medium text-${theme.userAccent}-800`}>1,247 Books</span>
                </div>
              </div>
            </div>

            {/* User Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* User Sidebar */}
              <div 
                className={`${theme.userBg} shadow-lg transition-all duration-300 flex flex-col`}
                style={{ width: userSidebarExpanded ? '256px' : '72px' }}
              >
                {/* Sidebar Header */}
                <div className="p-4 shadow-sm flex justify-between items-center">
                  {userSidebarExpanded ? (
                    <h2 className={`text-${theme.userAccent}-800 font-semibold`}>Reader Portal</h2>
                  ) : (
                    <BookOpen className={`w-5 h-5 text-${theme.userAccent}-600 mx-auto`} />
                  )}
                  <button
                    onClick={() => setUserSidebarExpanded(!userSidebarExpanded)}
                    className={`p-1 rounded hover:bg-${theme.userAccent}-100`}
                  >
                    {userSidebarExpanded ? (
                      <ChevronLeft className={`w-5 h-5 text-${theme.userAccent}-600`} />
                    ) : (
                      <ChevronRight className={`w-5 h-5 text-${theme.userAccent}-600`} />
                    )}
                  </button>
                </div>

                {/* User Navigation */}
                <nav className="p-2 space-y-2">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveUserPage(item.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-xl transition-colors ${
                          activeUserPage === item.id
                            ? `bg-${theme.userAccent}-500 text-white`
                            : `text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-100`
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {userSidebarExpanded && (
                          <span className="ml-3 font-medium truncate">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* User Content */}
              <div className="flex-1 overflow-auto bg-gray-50">{renderUserContent()}</div>
            </div>
          </div>

          {/* Admin Section (Right) - Device Style */}
          <div className="w-1/2 flex flex-col h-full rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Admin Section Header */}
            <div className={`${theme.headerBg} shadow-sm p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${theme.userGradient} rounded-lg`}>
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold text-${theme.userAccent}-800`}>Admin Panel</h2>
                    <p className={`text-sm text-${theme.userAccent}-600`}>Manage library system</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 bg-${theme.userAccent}-100 px-3 py-2 rounded-lg`}>
                  <Heart className={`h-4 w-4 text-${theme.secondary}-600`} />
                  <span className={`text-sm font-medium text-${theme.secondary}-800`}>34 Users</span>
                </div>
              </div>
            </div>

            {/* Admin Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Admin Sidebar */}
              <div 
                className={`${theme.userBg} shadow-lg transition-all duration-300 flex flex-col`}
                style={{ width: adminSidebarExpanded ? '256px' : '72px' }}
              >
                {/* Sidebar Header */}
                <div className="p-4 shadow-sm flex justify-between items-center">
                  {adminSidebarExpanded ? (
                    <h2 className={`text-${theme.userAccent}-800 font-semibold`}>Admin Panel</h2>
                  ) : (
                    <Settings className={`w-5 h-5 text-${theme.userAccent}-600 mx-auto`} />
                  )}
                  <button
                    onClick={() => setAdminSidebarExpanded(!adminSidebarExpanded)}
                    className={`p-1 rounded hover:bg-${theme.userAccent}-100`}
                  >
                    {adminSidebarExpanded ? (
                      <ChevronLeft className={`w-5 h-5 text-${theme.userAccent}-600`} />
                    ) : (
                      <ChevronRight className={`w-5 h-5 text-${theme.userAccent}-600`} />
                    )}
                  </button>
                </div>

                {/* Admin Navigation */}
                <nav className="p-2 space-y-2">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveAdminPage(item.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-xl transition-colors ${
                          activeAdminPage === item.id
                            ? `bg-${theme.userAccent}-500 text-white`
                            : `text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-100`
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {adminSidebarExpanded && (
                          <span className="ml-3 font-medium truncate">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Admin Content */}
              <div className="flex-1 overflow-auto bg-gray-50">{renderAdminContent()}</div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full">
          {activeView === 'user' ? (
            <div className="flex flex-col h-full">
              {/* Mobile User Header */}
              <div className={`${theme.headerBg} border-b border-${theme.userAccent}-200 p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileMenu(true)}
                      className={`p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600`}
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className={`text-lg font-bold text-${theme.userAccent}-800`}>Reader Portal</h2>
                      <p className={`text-sm text-${theme.userAccent}-600`}>Browse and manage books</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile User Content */}
              <div className="flex-1 overflow-auto">
                {renderUserContent()}
              </div>

              {/* Mobile User Sidebar */}
              {showMobileMenu && (
                <div className="fixed inset-0 z-50">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
                  <div className={`absolute left-0 top-0 bottom-0 w-64 ${theme.userBg} shadow-2xl`}>
                    <div className="p-4">
                      <button
                        onClick={() => setShowMobileMenu(false)}
                        className={`mb-4 p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <nav className="space-y-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveUserPage(item.id);
                                setShowMobileMenu(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                                activeUserPage === item.id
                                  ? `bg-${theme.userAccent}-500 text-white`
                                  : `text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-100`
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Mobile Admin Header */}
              <div className={`${theme.headerBg} border-b border-${theme.userAccent}-200 p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileMenu(true)}
                      className={`p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600`}
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className={`text-lg font-bold text-${theme.userAccent}-800`}>Admin Panel</h2>
                      <p className={`text-sm text-${theme.userAccent}-600`}>Manage library system</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Admin Content */}
              <div className="flex-1 overflow-auto">
                {renderAdminContent()}
              </div>

              {/* Mobile Admin Sidebar */}
              {showMobileMenu && (
                <div className="fixed inset-0 z-50">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
                  <div className={`absolute left-0 top-0 bottom-0 w-64 ${theme.userBg} shadow-2xl`}>
                    <div className="p-4">
                      <button
                        onClick={() => setShowMobileMenu(false)}
                        className={`mb-4 p-2 rounded-lg bg-${theme.userAccent}-100 text-${theme.userAccent}-600`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <nav className="space-y-2">
                        {adminMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveAdminPage(item.id);
                                setShowMobileMenu(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                                activeAdminPage === item.id
                                  ? `bg-${theme.userAccent}-500 text-white`
                                  : `text-${theme.userAccent}-600 hover:bg-${theme.userAccent}-100`
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}