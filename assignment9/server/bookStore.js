let books = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, genre: 'science', read: true, rating: 5 },
  { id: 2, title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, genre: 'history', read: true, rating: 4 },
  { id: 3, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genre: 'fantasy', read: true, rating: 5 },
  { id: 4, title: '1984', author: 'George Orwell', year: 1949, genre: 'fiction', read: false, rating: null },
  { id: 5, title: 'Atomic Habits', author: 'James Clear', year: 2018, genre: 'non-fiction', read: true, rating: 4 },
  { id: 6, title: 'Project Hail Mary', author: 'Andy Weir', year: 2021, genre: 'science', read: false, rating: null }
];

let nextId = 7;

const delay = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllBooks() {
  await delay();
  return books.map((book) => ({ ...book }));
}

export async function getBookById(id) {
  await delay();
  const found = books.find((b) => b.id === id);
  return found ? { ...found } : null;
}

export async function isDuplicate(title, author, excludeId = null){
    await delay(5);
    const normTitle = title.toLowerCase();
    const normAuthor = author.toLowerCase();
    return book.some(
        (b)=> 
            b.id !== excludeId &&
        b.title.toLowerCase() === normTitle &&
        b.author.toLowerCase() === normAuthor
    );
}

export async function createBook(bookData) {
    await delay();
    const newBook = {
        id: nextId++,
        title: bookData.title,
        author: bookData.author,
    year: bookData.year,
    genre: bookData.genre,
    read: bookData.read ?? false,
    rating: bookData.rating ?? null
  };
  books = [...books, newBook];
  return { ...newBook };
}
