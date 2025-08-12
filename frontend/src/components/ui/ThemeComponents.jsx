import { colorClasses } from '../../styles/colors.js';

// Page Header Component
export const PageHeader = ({ 
  title, 
  subtitle, 
  className = '',
  gradient = true,
  children 
}) => {
  const baseClasses = gradient 
    ? `${colorClasses.bg.gradient} rounded-lg p-6 ${colorClasses.text.white}`
    : `${colorClasses.bg.primary} rounded-lg p-6 border ${colorClasses.border.primary}`;

  return (
    <div className={`${baseClasses} ${className}`}>
      <h1 className={`text-2xl font-bold mb-2 ${gradient ? colorClasses.text.white : colorClasses.text.primary}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={gradient ? 'text-green-100' : colorClasses.text.secondary}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '',
  hover = true,
  padding = 'p-6',
  shadow = 'shadow-md'
}) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`${colorClasses.bg.primary} ${padding} rounded-lg ${shadow} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

// Stats Card Component
export const StatsCard = ({ 
  value, 
  label, 
  icon: Icon, 
  color = 'green',
  trend,
  className = ''
}) => {
  const colorMap = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      labelText: 'text-green-800'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      labelText: 'text-blue-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      labelText: 'text-purple-800'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      labelText: 'text-orange-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      labelText: 'text-red-800'
    }
  };

  const colors = colorMap[color] || colorMap.green;

  return (
    <div className={`${colors.bg} p-4 rounded-lg border ${colors.border} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-2xl font-bold ${colors.text}`}>{value}</div>
        {Icon && <Icon className={`h-6 w-6 ${colors.text}`} />}
      </div>
      <div className={`text-sm ${colors.labelText}`}>{label}</div>
      {trend && (
        <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: `${colorClasses.bg.accent} ${colorClasses.text.white} ${colorClasses.bg.accentHover} focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`,
    secondary: `${colorClasses.bg.primary} ${colorClasses.text.secondary} border ${colorClasses.border.primary} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500`,
    success: `bg-green-600 ${colorClasses.text.white} hover:bg-green-700 focus:outline-none focus:ring-2 ${colorClasses.ring.success}`,
    warning: `bg-yellow-600 ${colorClasses.text.white} hover:bg-yellow-700 focus:outline-none focus:ring-2 ${colorClasses.ring.warning}`,
    danger: `bg-red-600 ${colorClasses.text.white} hover:bg-red-700 focus:outline-none focus:ring-2 ${colorClasses.ring.error}`,
    ghost: `${colorClasses.text.secondary} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const baseClasses = 'font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};

// Input Component
export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${colorClasses.text.tertiary}`} />
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} focus:border-transparent ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className={`mt-1 text-sm ${colorClasses.text.error}`}>{error}</p>
      )}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'success', 
  size = 'sm',
  icon: Icon,
  className = '' 
}) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
};

// Loading Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-green-600 ${sizes[size]} ${className}`} />
  );
};

// Empty State Component
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className={`h-12 w-12 ${colorClasses.text.tertiary} mx-auto mb-4`} />}
      <h3 className={`text-lg font-medium ${colorClasses.text.primary} mb-2`}>{title}</h3>
      {description && <p className={colorClasses.text.secondary}>{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
