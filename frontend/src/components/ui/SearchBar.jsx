import { Search } from "lucide-react";
import { colorClasses } from '../../styles/colors.js';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "বই খুঁজুন" }) => {
    return (
        <div className={`flex items-center border ${colorClasses.border.primary} rounded-lg px-3 py-2 w-full max-w-md ${colorClasses.bg.primary} shadow-sm focus-within:ring-2 ${colorClasses.ring.accent} focus-within:border-transparent transition-all`}>
            <Search className={`${colorClasses.text.tertiary} w-5 h-5 mr-2`} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                className={`flex-1 outline-none bg-transparent ${colorClasses.text.primary} placeholder-gray-400`}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
