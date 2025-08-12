import { Menu, File, Bell, User, Search, BookCopy } from "lucide-react";
import { useState } from "react"
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { toast } from "sonner";


const api = axios.create({baseURL : "http://localhost:8000"})

const ENDPOINTS = {
    ALL_BOOKS : "/books",
    BORROW_BOOK : (id) => `/borrow/${id}`,
}

const getBooks = async() => {
    const response = await api.get(ENDPOINTS.ALL_BOOKS);
    return response.data;
}

const borrowRequest = async({bookId, userId}) => {
    const response = await api.post(ENDPOINTS.BORROW_BOOK(bookId), {user_id : userId})
    return response.data;
}

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(prev => !prev);

    const navItems = [
        {label : "Dashboard", path : "/", icon : File},
        {label : "Books", path : "/books", icon : Book},
        {label : "Donate", path : "/donate", icon : BookCopy},
    ];

    return(
        <>
            <Menu className="m-4 cursor-pointer z-10" onClick={toggleSidebar}/>
            <aside className={`fixed bg-black/10 backdrop-blur-sm h-full w-64 border rounded-lg ${isOpen ? 'translate-x-0' : '-translate-x-64'} transform transition-all`}>
                
                <h1 className="text-center p-4">বই আড্ডা</h1>
                <div className="border-b mx-auto w-[60%]"></div>

                <nav className="m-4 flex flex-col">
                    {navItems.map(nav => 
                        <NavLink key={nav.label} to={nav.path} className={({isActive}) => `m-2 ${isActive? 'border-b w-[50%]' : ''}`}>{nav.label}</NavLink>
                    )}
                </nav>


            
            </aside>
        </>
    )
}

const Header = () => {
    return(
        <header className="flex justify-between w-full p-4">
            {/* logo */}
            <div>
                বই আড্ডা
            </div>

            {/* profiles */}
            <div className="flex gap-4">
                <Bell/>
                <User/>
            </div>
        </header>
    )
}

const Layout = () => {
    return(
        <>
        <div className="flex bg-black/20">
            <Sidebar /> 
            <Header />
        </div>

        <main>
            <Outlet/>
        </main>
        </>
    )
}

const Dashboard = ()=> {
    return(
        <>
        <h1>Dashboard loading</h1>
        </>
    )
}

const SearchBar = ({setSearchTerm}) => {

    return(
        <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md bg-white">
            <Search className="text-black/40 w-5 h-5 mr-2" />
            <input
                type="text"
                placeholder="Search Books"
                className="flex-1 outline-none bg-transparent"
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
    )
}
const Book = ({book}) => {
    
    const borrowMutation = useMutation({
        mutationFn : borrowRequest,
        onSuccess: () => {
            toast.success("Book Borrow Request Sent");
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.detail || error.message);
            console.log(error);            
        }
    })
    const handleRead = () => {console.log("Reading Logic Maybe")}

    const handleBorrow = ({book_id = book.id, user_id = 2}) => {
        borrowMutation.mutate({bookId : book_id, userId : user_id});
    }

    return(
        <div className="w-40 flex flex-col items-center cursor-pointer">
            <p className="font-bold">{book.title}</p>
            <p className="text-black/40">{book.author}</p>
            <img src={book.cover_img} alt={book.title} className="h-50 w-40 bg-gray-200" />
            <p className="text-wrap">{book.description}</p>

            <div className="flex w-full justify-between">
                <button className="border bg-red-200 p-2 rounded-lg" onClick={handleRead}>Read</button>
                <button className="border bg-red-200 p-2 rounded-lg" onClick={handleBorrow}>Borrow</button>
            </div>
        </div>
    )
}
const BooksPage = () => {
    const {data : books, isLoading, isError} = useQuery({
        queryKey : ["books"],
        queryFn : getBooks,
    })

    const [searchTerm, setSearchTerm] = useState('');

    
    if(isLoading) return <p>loading</p>
    if(isError) return <p>error!</p>
    
    console.log(books);
    console.log(searchTerm)

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase()
        .includes(searchTerm.toLowerCase().trim())
    );



    return(    
        <div className="flex flex-col justify-center items-center gap-4">
            
            <SearchBar setSearchTerm={setSearchTerm}/>
            
            <div className="flex flex-wrap gap-4 max-w-6xl border">
                {filteredBooks.map(book => <Book key={book.id} book={book}/>)}
            </div>
        </div> 
        
    )
}

const DonatePage = () => {
    const [formData, setFormData] = useState([])
    return(
        <div className="max-w-6xl mx-auto">
            <form action="" className="flex flex-col items-center border justify-center">
                <div className="flex gap-4 m-4 justify-center items-center">
                    <label htmlFor="title" >Book Title</label>
                    <input type="text" className="border p-2 flex-1 rounded-lg"/>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <label htmlFor="title" >Author</label>
                    <input type="text" className="border p-2 flex-1 rounded-lg flex-end"/>
                </div>
            </form>
        </div>
    )
}


const queryClient = new QueryClient();

const NewApp = () => {
    return(
        <>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />} >
                        <Route index element={<Dashboard />}/>
                        <Route path="/books" element={<BooksPage />}/>
                        <Route path="/donate" element={<DonatePage />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
        </>
    )
}

export default NewApp;