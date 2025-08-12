# BoiAdda Theme System

This document outlines the theme system implemented across the BoiAdda application.

## Color Palette

The application uses a consistent green-based color palette defined in `/src/styles/colors.js`:

### Primary Colors (Green Theme)
- **Primary 500**: `#22c55e` - Main brand color
- **Primary 600**: `#16a34a` - Hover states and emphasis
- **Primary 700**: `#15803d` - Active states

### Secondary Colors (Blue for accents)
- Used for informational elements and secondary actions

### Status Colors
- **Success**: Green variants for positive actions
- **Warning**: Yellow/Orange for warnings
- **Error**: Red for errors and destructive actions
- **Info**: Blue for informational content

## Theme Components

### Core Components (`/src/components/ui/ThemeComponents.jsx`)

1. **PageHeader**: Consistent page headers with gradient background
2. **Card**: Reusable card component with hover effects
3. **StatsCard**: Statistics display with color-coded themes
4. **Button**: Multi-variant button component
5. **Input**: Form input with icons and error states
6. **Badge**: Status indicators with color variants
7. **LoadingSpinner**: Consistent loading indicator
8. **EmptyState**: Empty state component with icons and actions

### Usage Examples

```jsx
import { PageHeader, Card, Button } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';

// Page Header
<PageHeader
  title="আমার প্রোফাইল"
  subtitle="আপনার ব্যক্তিগত তথ্য পরিচালনা করুন"
/>

// Button variants
<Button variant="primary">প্রাথমিক</Button>
<Button variant="secondary">গৌণ</Button>
<Button variant="success">সফল</Button>
<Button variant="danger">বিপজ্জনক</Button>

// Color classes
<div className={colorClasses.bg.primary}>
  <h1 className={colorClasses.text.primary}>শিরোনাম</h1>
  <p className={colorClasses.text.secondary}>বিবরণ</p>
</div>
```

## Pages Updated with New Theme

1. **Dashboard** (`/src/pages/Dashboard.jsx`)
   - Gradient header
   - Stats cards with icons
   - Recent activity timeline

2. **BooksPage** (`/src/pages/BooksPage.jsx`)
   - Search functionality
   - Empty states
   - Consistent loading states

3. **ProfilePage** (`/src/pages/ProfilePage.jsx`) - New
   - Profile editing
   - Statistics display
   - Activity timeline
   - Achievement system

4. **MyBooksPage** (`/src/pages/MyBooksPage.jsx`) - New
   - Tabbed interface (Borrowed, History, Wishlist)
   - Book management actions
   - Search and filter functionality

5. **SettingsPage** (`/src/pages/SettingsPage.jsx`) - New
   - Sidebar navigation
   - Multiple setting categories
   - Form validation
   - Security options

6. **DonatePage** (`/src/pages/DonatePage.jsx`)
   - Form with icons
   - Guidelines sidebar
   - Impact statistics

7. **LoginPage** (`/src/pages/LoginPage.jsx`)
   - Bangla text
   - Consistent styling
   - Error handling

## Navigation Updates

### Header (`/src/components/layout/Header.jsx`)
- Bangla interface
- Consistent color scheme
- User menu with new page links

### Sidebar (`/src/components/layout/Sidebar.jsx`)
- Updated navigation items
- Bangla labels
- New page routes

## Routing

Updated `App.jsx` to include new routes:
- `/profile` - User profile management
- `/my-books` - User's book management
- `/settings` - Application settings
- `/search` - Advanced book search (Theme.jsx)

## Design Principles

1. **Consistency**: All components use the same color palette and spacing
2. **Accessibility**: Proper contrast ratios and focus states
3. **Responsiveness**: Mobile-first design approach
4. **Internationalization**: Bangla text throughout the interface
5. **User Experience**: Clear visual hierarchy and intuitive navigation

## Benefits

1. **Maintainability**: Centralized color system makes updates easy
2. **Consistency**: Unified design language across all pages
3. **Scalability**: Easy to add new components following the same patterns
4. **Performance**: Reusable components reduce bundle size
5. **Developer Experience**: Clear component API and documentation

## Future Enhancements

1. **Dark Mode**: Theme system is ready for dark mode implementation
2. **Custom Themes**: Color system supports multiple theme variants
3. **Animation Library**: Motion components can be added to the theme system
4. **Component Library**: Expand theme components for complex UI patterns
