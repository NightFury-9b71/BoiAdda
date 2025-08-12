const Card = ({ children, className = "", ...props }) => {
    return (
        <div 
            className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = "" }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
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
        <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
            {children}
        </h2>
    );
};

const CardDescription = ({ children, className = "" }) => {
    return (
        <p className={`text-gray-600 ${className}`}>
            {children}
        </p>
    );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
