import { colorClasses } from '../../styles/colors.js';

const Card = ({ children, className = "", ...props }) => {
    return (
        <div 
            className={`${colorClasses.bg.primary} rounded-lg shadow-md border ${colorClasses.border.primary} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = "" }) => {
    return (
        <div className={`px-6 py-4 border-b ${colorClasses.border.primary} ${className}`}>
            {children}
        </div>
    );
};

const CardContent = ({ children, className = "" }) => {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
};

const CardTitle = ({ children, className = "" }) => {
    return (
        <h2 className={`text-xl font-semibold ${colorClasses.text.primary} ${className}`}>
            {children}
        </h2>
    );
};

const CardDescription = ({ children, className = "" }) => {
    return (
        <p className={`${colorClasses.text.secondary} ${className}`}>
            {children}
        </p>
    );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
