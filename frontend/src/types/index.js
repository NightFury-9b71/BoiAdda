/**
 * @typedef {Object} Book
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {string} [description]
 * @property {string} [cover_img]
 * @property {boolean} [available]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {Book[]} [borrowed_books]
 */

/**
 * @typedef {Object} BorrowRequest
 * @property {number} bookId
 * @property {number} userId
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data
 * @property {string} [message]
 * @property {boolean} success
 */

/**
 * @typedef {Object} AuthUser
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [avatar]
 * @property {string} role
 * @property {boolean} emailVerified
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string} [phone]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {AuthUser} user
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 */

/**
 * @typedef {Object} AuthContext
 * @property {AuthUser|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {function} login
 * @property {function} register
 * @property {function} logout
 * @property {function} refreshToken
 */

export {};
