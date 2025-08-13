import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/auth/me?user_id=${userId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/users/');
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

  donateBook: async (bookData) => {
    const response = await apiClient.post('/donate', bookData);
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

  getNotifications: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array as fallback
      return [];
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  },

  // Announcement API
  createAnnouncement: async (announcementData) => {
    try {
      const response = await apiClient.post('/admin/announcements', announcementData);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  getAllAnnouncements: async () => {
    try {
      const response = await apiClient.get('/admin/announcements');
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  toggleAnnouncement: async (announcementId) => {
    try {
      const response = await apiClient.put(`/admin/announcements/${announcementId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling announcement:', error);
      throw error;
    }
  },

  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await apiClient.delete(`/admin/announcements/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  getAllBooks: async () => {
    const response = await apiClient.get('/books/');
    return response.data;
  },

  addBook: async (bookData) => {
    // TODO: Backend endpoint needed for admin book addition
    // Currently only donation endpoint exists: POST /donate
    // This is a placeholder for admin "add book directly" functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: "Book addition feature needs backend implementation" };
  },

  getRecentActivities: async (limit = 10) => {
    const response = await apiClient.get(`/recent-activities?limit=${limit}`);
    return response.data;
  },

  getUserRecentActivities: async (userId, limit = 10, days = 7) => {
    const response = await apiClient.get(`/users/${userId}/recent-activities?limit=${limit}&days=${days}`);
    return response.data;
  },

  getLibraryStatistics: async () => {
    try {
      const response = await apiClient.get('/library/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching library statistics:', error);
      // Return fallback data
      return {
        total_books: 0,
        available_books: 0,
        borrowed_books: 0,
        total_users: 0,
        active_users: 0,
        new_users: 0,
        total_donations: 0
      };
    }
  },

  // Admin detailed statistics endpoints
  getDetailedBooks: async () => {
    try {
      const response = await apiClient.get('/admin/books/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed books:', error);
      return [];
    }
  },

  getDetailedUsers: async () => {
    try {
      const response = await apiClient.get('/admin/users/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed users:', error);
      return [];
    }
  },

  getDetailedBorrowedBooks: async () => {
    try {
      const response = await apiClient.get('/admin/borrowed-books/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed borrowed books:', error);
      return [];
    }
  },

  getDetailedDonations: async () => {
    try {
      const response = await apiClient.get('/admin/donations/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed donations:', error);
      return [];
    }
  },

  getDetailedAvailableBooks: async () => {
    try {
      const response = await apiClient.get('/admin/available-books/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed available books:', error);
      return [];
    }
  },
};

export default api;
