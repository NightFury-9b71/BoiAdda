import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search Books" }) => {
    return (
        <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
