# বই আড্ডা (Boi Adda) - Frontend

A modern React-based book sharing platform that allows users to browse, borrow, and donate books within a community.

## 🚀 Features

- **Book Browsing**: Search and filter through available books
- **Borrow System**: Request to borrow books from the community
- **Donation Platform**: Donate books to share with others
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Modern UI**: Clean and intuitive user interface

## 🛠️ Technology Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Vite** - Build tool and development server

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   ├── ui/            # Basic UI components (Button, SearchBar, etc.)
│   └── Book.jsx       # Book component
├── hooks/              # Custom React hooks
│   ├── useBooks.js     # Book-related operations
│   └── useSidebar.js   # Sidebar state management
├── pages/              # Page components
│   ├── Dashboard.jsx   # Home dashboard
│   ├── BooksPage.jsx   # Books listing page
│   └── DonatePage.jsx  # Book donation page
├── services/           # API services
│   └── api.js         # API configuration and methods
├── constants/          # Application constants
│   ├── api.js         # API endpoints and query keys
│   └── navigation.js   # Navigation configuration
├── utils/              # Utility functions
│   └── helpers.js     # Common helper functions
└── types/             # Type definitions (JSDoc)
    └── index.js       # Type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_NAME=বই আড্ডা
   VITE_APP_VERSION=1.0.0
   VITE_DEBUG=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application integrates with a backend API running on `http://localhost:8000` (configurable via environment variables).

### API Endpoints

- `GET /books` - Fetch all available books
- `POST /borrow/{id}` - Request to borrow a book
- `POST /books` - Donate a new book

## 🎨 Styling

The application uses Tailwind CSS for styling with a mobile-first approach. Key design principles:

- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Clean, minimalist design
- **Bengali Typography**: Proper support for Bengali text

## 🔄 State Management

- **React Query** for server state management
- **React useState** for local component state
- **Context API** for shared application state (when needed)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚨 Error Handling

- Network error handling with retry logic
- User-friendly error messages
- Loading states for better UX
- Form validation

## 🔐 Security Considerations

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Traditional web hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow ESLint configuration for code style
- Use conventional commit messages
- Write meaningful component and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use custom hooks for reusable logic

## 🐛 Known Issues

- User authentication is not yet implemented (using static user ID)
- File upload for book covers is not implemented
- Real-time notifications are not implemented

## 🗺️ Roadmap

- [ ] User authentication and authorization
- [ ] File upload for book covers
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] User profiles and reading history
- [ ] Book reviews and ratings
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@boiadda.com or create an issue in the GitHub repository.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
