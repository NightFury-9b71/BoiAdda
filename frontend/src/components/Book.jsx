import { useBorrowBook } from '../hooks/useBooks.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './ui/Button.jsx';

const Book = ({ book }) => {
    const borrowMutation = useBorrowBook();
    const { user } = useAuth();

    const handleRead = () => {
        console.log("Reading logic to be implemented");
        // TODO: Implement reading functionality
    };

    const handleBorrow = () => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        borrowMutation.mutate({ 
            bookId: book.id, 
            userId: user.id 
        });
    };

    return (
        <div className="w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col">
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                    {book.author}
                </p>
                
                <div className="mb-4">
                    <img 
                        src={book.cover_img || '/placeholder-book.png'} 
                        alt={book.title} 
                        className="w-full h-40 object-cover bg-gray-200 rounded-md"
                        onError={(e) => {
                            e.target.src = '/placeholder-book.png';
                        }}
                    />
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {book.description}
                </p>
            </div>

            <div className="flex gap-2 mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRead}
                    className="flex-1"
                >
                    Read
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleBorrow}
                    disabled={borrowMutation.isPending}
                    className="flex-1"
                >
                    {borrowMutation.isPending ? 'Borrowing...' : 'Borrow'}
                </Button>
            </div>
        </div>
    );
};

export default Book;
