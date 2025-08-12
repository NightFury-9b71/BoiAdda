import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from '../services/api.js';
import { QUERY_KEYS } from '../constants/api.js';
import { toast } from "sonner";

export const useBooks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.BOOKS],
        queryFn: bookService.getAllBooks,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useBorrowBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookService.borrowBook,
        onSuccess: () => {
            toast.success("Book borrow request sent successfully!");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.detail || error.message || "Failed to borrow book";
            toast.error(errorMessage);
            console.error("Borrow book error:", error);
        }
    });
};

export const useDonateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookService.donateBook,
        onSuccess: () => {
            toast.success("Book donated successfully!");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.detail || error.message || "Failed to donate book";
            toast.error(errorMessage);
            console.error("Donate book error:", error);
        }
    });
};
