import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { Book, User, Settings, CheckCircle, XCircle, ArrowLeft, Plus } from 'lucide-react';
import axios from 'axios';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// API Base URL - adjust this to match your FastAPI server
const API_BASE = 'http://localhost:8000';

// API functions
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  getBooks: async () => {
    const response = await apiClient.get('/books/');
    return response.data;
  },

  borrowBook: async ({ bookId, userId }) => {
    const response = await apiClient.post(`/borrow/${bookId}`, { user_id: userId });
    return response.data;
  },

  donateBook: async ({ bookId, userId }) => {
    const response = await apiClient.post(`/donate/${bookId}`, { user_id: userId });
    return response.data;
  },

  returnBook: async (userId) => {
    const response = await apiClient.post(`/return/`, null, {
      params: { user_id: userId },
    });
    return response.data;
  },

  getBorrowRequests: async () => {
    const response = await apiClient.get('/admin/borrow-requests/');
    return response.data;
  },

  getDonationRequests: async () => {
    const response = await apiClient.get('/admin/donation-requests/');
    return response.data;
  },

  approveBorrow: async ({ txId, adminId, comment }) => {
    const response = await apiClient.post(`/admin/borrow-requests/${txId}/approve`, {
      admin_id: adminId,
      comment,
    });
    return response.data;
  },

  rejectBorrow: async ({ txId, adminId, comment }) => {
    const response = await apiClient.post(`/admin/borrow-requests/${txId}/reject`, {
      admin_id: adminId,
      comment,
    });
    return response.data;
  },

  approveDonation: async ({ txId, adminId, comment }) => {
    const response = await apiClient.post(`/admin/donation-requests/${txId}/approve`, {
      admin_id: adminId,
      comment,
    });
    return response.data;
  },

  rejectDonation: async ({ txId, adminId, comment }) => {
    const response = await apiClient.post(`/admin/donation-requests/${txId}/reject`, {
      admin_id: adminId,
      comment,
    });
    return response.data;
  },

  getUserStatistics: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/statistics`);
    return response.data;
  },
};

// User View Component
function UserView({ currentUserId }) {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Book className="w-6 h-6" />
          User View - Available Books
        </h2>
        <button
          onClick={() => returnMutation.mutate(currentUserId)}
          disabled={returnMutation.isPending}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Book
        </button>
      </div>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {books.map((book) => (
          <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-sm text-gray-500">Category: {book.category}</p>
                <p className="text-sm text-green-600 font-medium">
                  Available copies: {book.available_copies}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => borrowMutation.mutate({ bookId: book.id, userId: currentUserId })}
                  disabled={borrowMutation.isPending || book.available_copies === 0}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  Borrow
                </button>
                <button
                  onClick={() => donateMutation.mutate({ bookId: book.id, userId: currentUserId })}
                  disabled={donateMutation.isPending}
                  className="bg-purple-600 text-white px-3 py-1 text-sm rounded hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                >
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

// Admin View Component
function AdminView({ adminId }) {
  const [activeTab, setActiveTab] = useState('borrow');
  
  const { data: borrowRequests = [], isLoading: borrowLoading } = useQuery({
    queryKey: ['borrowRequests'],
    queryFn: api.getBorrowRequests,
    refetchInterval: 5000, // Refresh every 5 seconds
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Admin View - Pending Requests
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'borrow'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Borrow ({borrowRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('donation')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'donation'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Donation ({donationRequests.length})
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'borrow' && (
          <div className="space-y-3">
            {borrowRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending borrow requests</p>
            ) : (
              borrowRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Request ID: {request.id}</p>
                      <p className="text-sm text-gray-600">User ID: {request.user_id}</p>
                      <p className="text-sm text-gray-600">Book Copy ID: {request.book_copy_id}</p>
                      <p className="text-sm text-gray-500">
                        Due Date: {new Date(request.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveBorrowMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Approved by admin' 
                        })}
                        disabled={approveBorrowMutation.isPending}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectBorrowMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Rejected by admin' 
                        })}
                        disabled={rejectBorrowMutation.isPending}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
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
              <p className="text-gray-500 text-center py-8">No pending donation requests</p>
            ) : (
              donationRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Request ID: {request.id}</p>
                      <p className="text-sm text-gray-600">User ID: {request.user_id}</p>
                      <p className="text-sm text-gray-600">Book ID: {request.book_id}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveDonationMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Approved by admin' 
                        })}
                        disabled={approveDonationMutation.isPending}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectDonationMutation.mutate({ 
                          txId: request.id, 
                          adminId, 
                          comment: 'Rejected by admin' 
                        })}
                        disabled={rejectDonationMutation.isPending}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
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

// Statistics Component (Bottom sections)
function UserStats({ userId }) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => api.getUserStatistics(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading user statistics: {error.message}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading user statistics: {error.message}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status, isOverdue = false) => {
    const statusStyles = {
      'Current': 'bg-green-200 text-green-800',
      'Returned': 'bg-gray-200 text-gray-800',
      'Pending': 'bg-yellow-200 text-yellow-800',
      'Rejected': 'bg-red-200 text-red-800',
      'Overdue': 'bg-red-300 text-red-900',
      'Approved': 'bg-green-200 text-green-800',
    };

    const finalStatus = isOverdue ? 'Overdue' : status;
    return (
      <span className={`px-1 py-0.5 text-xs rounded font-medium ${statusStyles[finalStatus] || 'bg-gray-200 text-gray-800'}`}>
        {finalStatus}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Borrowed Books */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Borrowing History
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-700">Currently borrowed:</span>
              <span className="font-semibold text-blue-800">{stats?.current_borrowed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Total borrowed:</span>
              <span className="font-semibold text-blue-800">{stats?.total_borrowed || 0}</span>
            </div>
            {stats?.overdue_books > 0 && (
              <div className="flex justify-between">
                <span className="text-red-700">Overdue:</span>
                <span className="font-semibold text-red-800">{stats.overdue_books}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-yellow-700">Pending:</span>
              <span className="font-semibold text-yellow-800">{stats?.pending_borrow_requests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Rejected:</span>
              <span className="font-semibold text-red-800">{stats?.rejected_borrow_requests || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-2">
          {stats?.borrowed_books?.length > 0 ? (
            stats.borrowed_books.map((book) => (
              <div key={book.id} className="text-xs bg-white bg-opacity-50 rounded p-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-900 truncate">{book.book_title}</p>
                    <p className="text-blue-700">by {book.book_author}</p>
                  </div>
                  <div className="text-right ml-2">
                    {getStatusBadge(book.status, book.is_overdue)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-blue-600">
                    Requested: {new Date(book.borrowed_date).toLocaleDateString()}
                  </p>
                  {book.due_date && book.status === 'Current' && (
                    <p className={`${book.is_overdue ? 'text-red-600' : 'text-blue-600'}`}>
                      Due: {new Date(book.due_date).toLocaleDateString()}
                    </p>
                  )}
                  {book.return_date && (
                    <p className="text-green-600">
                      Returned: {new Date(book.return_date).toLocaleDateString()}
                    </p>
                  )}
                  {book.admin_comment && (
                    <p className="text-gray-600 italic">
                      Note: {book.admin_comment}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-blue-600 text-sm">No borrowing history yet.</p>
          )}
        </div>
      </div>
      
      {/* Donated Books */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Donation History
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-purple-700">Approved:</span>
              <span className="font-semibold text-purple-800">{stats?.total_donated || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Copies added:</span>
              <span className="font-semibold text-purple-800">{stats?.total_donated || 0}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-yellow-700">Pending:</span>
              <span className="font-semibold text-yellow-800">{stats?.pending_donation_requests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Rejected:</span>
              <span className="font-semibold text-red-800">{stats?.rejected_donation_requests || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-2">
          {stats?.donated_books?.length > 0 ? (
            stats.donated_books.map((book) => (
              <div key={book.id} className="text-xs bg-white bg-opacity-50 rounded p-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-purple-900 truncate">{book.book_title}</p>
                    <p className="text-purple-700">by {book.book_author}</p>
                  </div>
                  <div className="text-right ml-2">
                    {getStatusBadge(book.status)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-purple-600">
                    Requested: {new Date(book.donation_date).toLocaleDateString()}
                  </p>
                  {book.status === 'Approved' && (
                    <p className="text-green-600">
                      +{book.copies_added} copy added to library
                    </p>
                  )}
                  {book.admin_comment && (
                    <p className="text-gray-600 italic">
                      Note: {book.admin_comment}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-purple-600 text-sm">No donation history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
function LibraryApp() {
  const [currentUserId, setCurrentUserId] = useState(1);
  const [adminId, setAdminId] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Library Management System</h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <label className="text-sm font-medium">Current User ID:</label>
              <input
                type="number"
                value={currentUserId}
                onChange={(e) => setCurrentUserId(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <label className="text-sm font-medium">Admin ID:</label>
              <input
                type="number"
                value={adminId}
                onChange={(e) => setAdminId(parseInt(e.target.value) || 2)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </header>

        {/* Top Section - User and Admin Views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <UserView currentUserId={currentUserId} />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AdminView adminId={adminId} />
          </div>
        </div>

        {/* Bottom Section - User Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Statistics & History</h2>
          <UserStats userId={currentUserId} />
        </div>
      </div>
    </div>
  );
}

// Root App with Query Client Provider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LibraryApp />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}