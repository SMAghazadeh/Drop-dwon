import React, { useState, useEffect } from "react";
import axios from "axios";
import BookAutocomplete from "./pages/BookAutocomplete";
import useOnlineStatus from "./Hooks/OnlineStatus";
import { toast } from "react-toastify";

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("اینترنت شما قطع است!");
    }
  }, [isOnline]);

  const fetchBooks = async (searchQuery = query, currentPage = page) => {
    if (loading || !isOnline) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${searchQuery || "programming"}&limit=20&page=${currentPage}`
      );

      const newBooks = response.data.docs.map((book) => ({
        key: book.key,
        title: book.title,
      }));

      setBooks((prevBooks) =>
        currentPage === 1 ? newBooks : [...prevBooks, ...newBooks]
      );

      setHasMore(response.data.docs.length > 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchBooks();
  }, [query]);

  const fetchMoreData = () => {
    if (!hasMore) return;
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchBooks(query, nextPage);
      return nextPage;
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      <BookAutocomplete
        books={books}
        query={query}
        selectedBook={selectedBook}
        loading={loading}
        hasMore={hasMore}
        onQueryChange={setQuery}
        onSelectedBookChange={setSelectedBook}
        onFetchMoreData={fetchMoreData}
      />
    </div>
  );
}

export default App;
