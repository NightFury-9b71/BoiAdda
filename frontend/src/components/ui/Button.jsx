import { colorClasses } from '../../styles/colors.js';

const Button = ({ 
    children, 
    onClick, 
    variant = "primary", 
    size = "md", 
    disabled = false,
    className = "",
    ...props 
}) => {
    const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: `${colorClasses.bg.accent} ${colorClasses.bg.accentHover} ${colorClasses.text.white} ${colorClasses.ring.accent}`,
        secondary: `${colorClasses.bg.secondary} hover:bg-gray-300 ${colorClasses.text.primary} focus:ring-gray-500`,
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        outline: `border ${colorClasses.border.primary} hover:bg-gray-50 ${colorClasses.text.secondary} ${colorClasses.ring.accent}`
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
