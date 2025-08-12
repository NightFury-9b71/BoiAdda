# Authentication & Authorization System

## Overview

This document describes the authentication and authorization system implemented in the বই আড্ডা frontend application.

## Features

### ✅ Authentication Features
- **User Registration** with email validation and password strength checker
- **User Login** with remember me functionality
- **Password Reset** via email
- **JWT Token Management** with automatic refresh
- **Persistent Sessions** using localStorage
- **Auto-logout** on token expiration

### ✅ Authorization Features
- **Protected Routes** requiring authentication
- **Public Routes** accessible without authentication
- **Route Guards** preventing unauthorized access
- **User Context** for accessing current user data throughout the app

## Architecture

### Components Structure
```
src/
├── context/
│   └── AuthContext.jsx          # Auth state management
├── services/
│   └── auth.js                  # Authentication API calls
├── components/
│   ├── ProtectedRoute.jsx       # Route guard for authenticated users
│   ├── PublicRoute.jsx          # Route guard for public access
│   └── ui/
│       ├── Input.jsx            # Form input component
│       └── Card.jsx             # Card UI component
├── pages/
│   ├── LoginPage.jsx            # Login form
│   ├── RegisterPage.jsx         # Registration form
│   └── ForgotPasswordPage.jsx   # Password reset form
└── constants/
    └── auth.js                  # Authentication constants
```

### API Integration

#### Backend Endpoints Expected
```javascript
POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/refresh
GET  /auth/profile
POST /auth/forgot-password
POST /auth/reset-password
```

#### Request/Response Format

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Auth Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "emailVerified": true
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "expiresIn": 3600
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### Token Management
- **Access Token**: Short-lived (1 hour), stored in localStorage
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Automatic Refresh**: Interceptors handle token refresh on 401 responses
- **Secure Storage**: Tokens stored in localStorage with proper cleanup

### Protection Mechanisms
- **XSS Protection**: Input validation and sanitization
- **CSRF Protection**: Token-based authentication
- **Route Protection**: Guards prevent unauthorized access
- **Auto-logout**: Clears session on token expiration

## Usage Examples

### Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext.jsx';

const MyComponent = () => {
    const { user, isAuthenticated, login, logout } = useAuth();

    if (!isAuthenticated) {
        return <div>Please log in</div>;
    }

    return <div>Welcome, {user.name}!</div>;
};
```

### Protecting Routes
```jsx
import ProtectedRoute from '../components/ProtectedRoute.jsx';

<Route 
    path="/dashboard" 
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    } 
/>
```

### Making Authenticated API Calls
```jsx
// API service automatically adds auth token
const response = await api.get('/protected-endpoint');
```

## Form Validation

### Login Form
- Email format validation
- Password minimum length
- Real-time error display
- Loading states

### Registration Form
- Name length validation
- Email uniqueness (server-side)
- Password strength meter
- Confirm password matching
- Phone number format (optional)
- Terms of service agreement

### Password Reset
- Email format validation
- Success confirmation
- Resend functionality

## Error Handling

### Client-Side Errors
- Form validation errors
- Network connectivity issues
- Invalid input feedback

### Server-Side Errors
- Authentication failures
- Token expiration
- Email already exists
- Password reset failures

### User Feedback
- Toast notifications for success/error states
- Form-specific error messages
- Loading spinners during API calls
- Clear success confirmations

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **LocalStorage**: Required for token persistence
- **ES6+ Features**: Used throughout the codebase
- **Responsive Design**: Mobile-first approach

## Testing Considerations

### Unit Tests
- Auth context functionality
- Form validation logic
- API service methods
- Route protection

### Integration Tests
- Login/logout flow
- Registration process
- Password reset workflow
- Token refresh mechanism

### E2E Tests
- Complete user journey
- Cross-browser testing
- Mobile responsiveness
- Error scenarios

## Deployment Notes

### Environment Variables
```env
VITE_API_BASE_URL=https://api.your-domain.com
```

### Backend Requirements
- CORS configured for frontend domain
- JWT token implementation
- Email service for password reset
- User database with proper schema

### Security Checklist
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] JWT secrets secure
- [ ] Rate limiting on auth endpoints
- [ ] Email verification flow
- [ ] Password complexity enforcement

## Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Session management dashboard
- [ ] OAuth 2.0 integration

### Performance Optimizations
- [ ] Token refresh queue
- [ ] Background token refresh
- [ ] Offline authentication state
- [ ] Remember device functionality

## Troubleshooting

### Common Issues

**Token Refresh Fails**
- Check network connectivity
- Verify refresh token validity
- Ensure backend refresh endpoint works

**User Gets Logged Out Unexpectedly**
- Check token expiration times
- Verify localStorage persistence
- Check for manual token clearing

**Login Form Not Working**
- Verify API endpoint configuration
- Check CORS settings
- Validate request/response format

**Registration Validation Errors**
- Check password complexity requirements
- Verify email format validation
- Ensure confirm password logic works

### Debug Tips
- Use browser dev tools to inspect localStorage
- Check network tab for API requests/responses
- Enable debug logging in development
- Test with various user scenarios
