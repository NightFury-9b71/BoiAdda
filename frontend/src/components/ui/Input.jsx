import { forwardRef } from 'react';
import { colorClasses } from '../../styles/colors.js';

const Input = forwardRef(({ 
    label, 
    error, 
    type = "text", 
    className = "",
    required = false,
    ...props 
}, ref) => {
    const inputClasses = `
        w-full px-3 py-2 border rounded-lg transition-colors
        focus:outline-none focus:ring-2 ${colorClasses.ring.accent} focus:border-transparent
        ${error 
            ? `${colorClasses.border.error} focus:ring-red-500` 
            : `${colorClasses.border.primary} hover:border-gray-400`
        }
        ${className}
    `;

    return (
        <div className="space-y-2">
            {label && (
                <label className={`block text-sm font-medium ${colorClasses.text.secondary}`}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={inputClasses}
                {...props}
            />
            {error && (
                <p className={`text-sm ${colorClasses.text.error}`}>{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
