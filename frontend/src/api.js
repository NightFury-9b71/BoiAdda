// import axios from "axios";

// const URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// const api = axios.create({
//   baseURL: URL,
// });

// const ENDPOINTS = {
//   ALL_BOOKS: "/books",
// };


// export const bookService = {
//   getAllBooks: async () => {
//     const res = await api.get("/books/");
//     return res.data;
//   },

//   borrowBook: async (book_id, user_id) => {
//     const res = await api.post(`/borrow/${book_id}?user_id=${user_id}`);
//     return res.data;
//   },

//   returnBook: (userId) => {
//     return api.post("/return/", { user_id: userId });
//   },
// };
