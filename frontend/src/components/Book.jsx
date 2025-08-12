import { useState } from 'react';
import { 
  BookOpen, 
  Eye, 
  Calendar,
  User as UserIcon,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useBorrowBook } from '../hooks/useBooks.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Badge } from './ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';

const Book = ({ book }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const borrowMutation = useBorrowBook();
    const { user } = useAuth();

    const handleRead = () => {
        console.log("Reading logic to be implemented");
        // TODO: Implement reading functionality
    };

    const handleBorrow = async () => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        setIsLoading(true);
        try {
            await borrowMutation.mutateAsync({ 
                bookId: book.id, 
                userId: user.id 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailabilityBadge = () => {
        switch (book.availability || 'available') {
            case 'available':
                return (
                    <Badge variant="success" icon={CheckCircle} size="sm">
                        উপলব্ধ
                    </Badge>
                );
            case 'borrowed':
                return (
                    <Badge variant="error" icon={Clock} size="sm">
                        ধার দেওয়া
                    </Badge>
                );
            case 'reserved':
                return (
                    <Badge variant="warning" icon={AlertCircle} size="sm">
                        সংরক্ষিত
                    </Badge>
                );
            default:
                return (
                    <Badge variant="success" icon={CheckCircle} size="sm">
                        উপলব্ধ
                    </Badge>
                );
        }
    };

    return (
        <div 
            className="group relative w-full max-w-[220px] mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Book Container with 3D Effect */}
            <div className={`relative transition-all duration-300 ${isHovered ? 'transform translate-y-[-8px]' : ''}`}>
                {/* Book Shadow */}
                <div className={`absolute inset-0 bg-black/20 rounded-lg transform translate-x-2 translate-y-2 transition-all duration-300 ${
                    isHovered ? 'translate-x-3 translate-y-3 opacity-30' : 'opacity-20'
                }`} />
                
                {/* Main Book Body */}
                <div className={`relative ${colorClasses.bg.primary} rounded-lg overflow-hidden transition-all duration-300 border-2 ${colorClasses.border.primary} ${
                    isHovered ? 'border-green-300 shadow-xl' : 'shadow-lg'
                }`}>
                    
                    {/* Book Spine Effect (Left Side) */}
                    <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-gray-300 via-gray-200 to-gray-400" />
                    
                    {/* Pages Effect (Right Side) */}
                    <div className="absolute right-0 top-1 w-1 h-[calc(100%-8px)] bg-gradient-to-b from-gray-100 via-white to-gray-200 rounded-r-sm" />
                    <div className="absolute right-1 top-2 w-0.5 h-[calc(100%-16px)] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-150" />
                    
                    {/* Book Cover */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                        <img 
                            src={book.cover_img || '/placeholder-book.svg'} 
                            alt={book.title} 
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                isHovered ? 'scale-105' : 'scale-100'
                            }`}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/200x300/22c55e/ffffff?text=বই";
                            }}
                        />
                        
                        {/* Black Transparent Overlay with Book Info */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ${
                            isHovered ? 'from-black/90 via-black/60' : ''
                        }`}>
                            
                            {/* Top Section - Status */}
                            <div className="absolute top-3 right-3">
                                {/* Status Badge */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg">
                                    {getAvailabilityBadge()}
                                </div>
                            </div>

                            {/* Bottom Section - Book Info */}
                            <div className={`absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300 ${
                                isHovered ? 'translate-y-0' : 'translate-y-2'
                            }`}>

                                {/* Title */}
                                <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight drop-shadow-lg">
                                    {book.title}
                                </h3>

                                {/* Author */}
                                <p className="text-sm text-white/90 mb-2 font-medium drop-shadow-md">
                                    {book.author}
                                </p>
                                
                                {/* Metadata */}
                                <div className="flex items-center justify-between text-xs text-white/80 mb-3">
                                    <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                        <UserIcon className="h-3 w-3 mr-1" />
                                        {book.genre || book.category || 'সাধারণ'}
                                    </span>
                                    <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {book.published_year || book.publishedYear || '২০২৪'}
                                    </span>
                                </div>

                                {/* Description (appears on hover) */}
                                {book.description && (
                                    <div className={`transition-all duration-300 overflow-hidden ${
                                        isHovered ? 'max-h-16 opacity-100 mb-3' : 'max-h-0 opacity-0'
                                    }`}>
                                        <p className="text-xs text-white/80 line-clamp-3 leading-relaxed bg-black/30 backdrop-blur-sm rounded-lg p-2">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {(book.availability === 'available' || !book.availability) && (
                                        <Button
                                            onClick={handleBorrow}
                                            disabled={isLoading || borrowMutation.isPending}
                                            loading={isLoading || borrowMutation.isPending}
                                            className="flex-1 text-xs py-2 bg-green-600 hover:bg-green-700 text-white border-0"
                                            size="sm"
                                        >
                                            {isLoading || borrowMutation.isPending ? 'ধার নিচ্ছি...' : 'ধার নিন'}
                                        </Button>
                                    )}
                                    
                                    {book.availability === 'borrowed' && (
                                        <Button
                                            variant="warning"
                                            className="flex-1 text-xs py-2 bg-yellow-600 text-white border-0"
                                            size="sm"
                                            disabled
                                        >
                                            ধার দেওয়া
                                        </Button>
                                    )}
                                    
                                    {book.availability === 'reserved' && (
                                        <Button
                                            variant="secondary"
                                            className="flex-1 text-xs py-2 bg-gray-600 text-white border-0"
                                            size="sm"
                                            disabled
                                        >
                                            সংরক্ষিত
                                        </Button>
                                    )}
                                    
                                    <Button
                                        variant="ghost"
                                        onClick={handleRead}
                                        size="sm"
                                        className="px-3 py-2 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                                    >
                                        <Eye className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Binding Lines */}
                    <div className="absolute left-2 top-4 w-px h-8 bg-gray-300" />
                    <div className="absolute left-2 bottom-12 w-px h-8 bg-gray-300" />
                </div>
                
                {/* Hover Glow Effect */}
                {isHovered && (
                    <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-xl scale-110 -z-10" />
                )}
            </div>
        </div>
    );
};

export default Book;
