import { useState } from 'react';
import { useDonateBook } from '../hooks/useBooks.js';
import Button from '../components/ui/Button.jsx';

const DonatePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        cover_img: ''
    });

    const donateMutation = useDonateBook();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.author.trim()) {
            alert('Please fill in the required fields (Title and Author)');
            return;
        }

        donateMutation.mutate(formData, {
            onSuccess: () => {
                setFormData({
                    title: '',
                    author: '',
                    description: '',
                    cover_img: ''
                });
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Donate a Book
                </h1>
                <p className="text-gray-600">
                    Share your books with the community and help others discover new stories
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter book title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                        Author *
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter author name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description of the book"
                    />
                </div>

                <div>
                    <label htmlFor="cover_img" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image URL
                    </label>
                    <input
                        type="url"
                        id="cover_img"
                        name="cover_img"
                        value={formData.cover_img}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/book-cover.jpg"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({
                            title: '',
                            author: '',
                            description: '',
                            cover_img: ''
                        })}
                        className="flex-1"
                    >
                        Clear Form
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={donateMutation.isPending}
                        className="flex-1"
                    >
                        {donateMutation.isPending ? 'Donating...' : 'Donate Book'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DonatePage;
