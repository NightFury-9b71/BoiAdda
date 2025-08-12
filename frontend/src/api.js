import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  // Authentication endpoints
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (userId) => {
    const response = await apiClient.get(`/auth/me?user_id=${userId}`);
    return response.data;
  },

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

  returnBook: async (userId, bookCopyId = null) => {
    const params = { user_id: userId };
    if (bookCopyId) {
      params.book_copy_id = bookCopyId;
    }
    
    const response = await apiClient.post(`/return/`, null, { params });
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

  // Mock APIs
  getBorrowedBooks: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover_img: "https://example.com/gatsby.jpg",
        borrowed_date: "2025-07-01",
        due_date: "2025-08-01",
        status: "active"
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        cover_img: "https://example.com/1984.jpg",
        borrowed_date: "2025-07-15",
        due_date: "2025-08-15",
        status: "overdue"
      }
    ];
  },

  getHistory: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        type: "borrow",
        book_title: "To Kill a Mockingbird",
        date: "2025-06-15",
        status: "returned",
        return_date: "2025-07-15"
      },
      {
        id: 2,
        type: "donation",
        book_title: "Pride and Prejudice",
        date: "2025-06-01",
        status: "approved"
      }
    ];
  },

  getNotifications: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        type: "due_date",
        message: "Your book 'The Great Gatsby' is due tomorrow",
        timestamp: "2025-07-31T10:00:00",
        read: false
      },
      {
        id: 2,
        type: "request_approved",
        message: "Your donation request for 'Pride and Prejudice' has been approved",
        timestamp: "2025-06-02T15:30:00",
        read: true
      }
    ];
  },

  markNotificationAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  getUserProfile: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      joined_date: "2025-01-01",
      total_borrowed: 15,
      total_donated: 3,
      reading_streak: 7
    };
  },

  // New mock data and methods
  getAllBooks: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover_img: "https://example.com/gatsby.jpg",
        total_copies: 5,
        available_copies: 3
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        cover_img: "https://example.com/1984.jpg",
        total_copies: 4,
        available_copies: 0
      },
      {
        id: 3,
        title: "Moby Dick",
        author: "Herman Melville",
        cover_img: "https://example.com/mobydick.jpg",
        total_copies: 2,
        available_copies: 2
      }
    ];
  },

  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        borrowed_count: 3
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        borrowed_count: 5
      },
      {
        id: 3,
        name: "Alice Johnson",
        email: "alice@example.com",
        borrowed_count: 0
      }
    ];
  },

  getLibraryStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      total_books: 1247,
      borrowed_books: 423,
      available_books: 824,
      total_users: 345,
      active_users: 89,
      new_users: 12,
      recent_activities: [
        {
          id: 1,
          type: 'borrow',
          description: 'John Doe borrowed "The Great Gatsby"',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'donation',
          description: 'Jane Smith donated "1984"',
          timestamp: new Date().toISOString()
        }
      ]
    };
  },

  addBook: async (bookData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },
};

export default api;