document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.getElementById('books-container');
    const logoutButton = document.getElementById('logoutButton');
    const adminLink = document.getElementById('admin-link'); 
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const paginationControls = document.getElementById('pagination-controls');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    const booksPerPage = 10; 
    let currentPage = 1;
    let totalPages = 1;

    // if (!currentUser) {
    //     alert('You need to log in to view this page.');
    //     window.location.href = 'login.html';
    //     return;
    // }

    if (currentUser.role === 'librarian') {
        if (adminLink) {
            adminLink.style.display = 'inline'; 
        }
    } else {
        if (adminLink) {
            adminLink.style.display = 'none'; 
        }
    }
   
    
    function renderBooks() {
        booksContainer.innerHTML = '';

        const books = JSON.parse(localStorage.getItem('books')) || [];

        totalPages = Math.ceil(books.length / booksPerPage);
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = Math.min(startIndex + booksPerPage, books.length);
        const booksToDisplay = books.slice(startIndex, endIndex);

        booksToDisplay.forEach(book => {
            const bookBox = document.createElement('div');
            bookBox.classList.add('book-box');

            
            const isAlreadyBorrowed = borrowedBooks.some(record => 
                record.borrowedBy.email === currentUser.email && record.id === book.id
            );

            bookBox.innerHTML = `
                <img src="${book.photo || 'default-photo.jpg'}" alt="${book.title || 'No Title'}" class="book-img">
                <div class="book-info">
                    <h3 class="book-title">${book.title || 'No Title'}</h3>
                    <p class="book-author">${book.author || 'Unknown Author'}</p>
                    <p class="book-year">${book.year || 'Unknown Year'}</p>
                    <p class="book-quality">Quality: ${book.quality || 'Unknown'}</p>
                    <button class="borrow-btn" ${isAlreadyBorrowed ? 'disabled' : ''} data-book-id="${book.id}" data-book-title="${book.title}">
                        ${isAlreadyBorrowed ? 'Already Borrowed' : 'Borrow'}
                    </button>
                </div>
            `;

            booksContainer.appendChild(bookBox);
        });

        updatePaginationControls();
    }

    function updatePaginationControls() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    function handlePagination(event) {
        if (event.target === prevPageButton && currentPage > 1) {
            currentPage--;
        } else if (event.target === nextPageButton && currentPage < totalPages) {
            currentPage++;
        }

        renderBooks();
        
    }
    
    function borrowBook(id, title) {
        if (!currentUser) {
            alert('Please log in to borrow books.');
            window.location.href = 'login.html';
            return;
        }

        
        const userBorrowed = borrowedBooks.filter(record => 
            record.borrowedBy.email === currentUser.email
        );
        
        if (userBorrowed.length >= 2) {
            alert('You can only borrow up to 2 books.');
            return;
        }

        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(book => book.id === id);
        if (!book) {
            alert('Book not found.');
            return;
        }

        
        if (book.quality <= 0) {
            alert('This book is not available for borrowing.');
            return;
        }

        
        book.quality -= 1;
        localStorage.setItem('books', JSON.stringify(books));

        const now = new Date();
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + 7); 

        borrowedBooks.push({
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year,
            borrowedBy: {
                email: currentUser.email,
                phone: currentUser.phone
            },
            borrowDate: now.toISOString(),
            dueDate: dueDate.toISOString()
        });

        
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

        alert(`You have borrowed "${title}". It is due on ${dueDate.toLocaleDateString()}.`);
        renderBooks(); 
    }

     
     function logout() {
        console.log('Logout function called');
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
    }
    
    function returnBook(id) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(book => book.id === id);
        if (!book) {
            alert('Book not found.');
            return;
        }

       
        book.quality += 1;
        localStorage.setItem('books', JSON.stringify(books));

        
        borrowedBooks = borrowedBooks.filter(record => record.id !== id || record.borrowedBy.email !== currentUser.email);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

        alert('Book has been returned.');
        renderBooks(); 
    }

    
    window.borrowBook = borrowBook;
    window.returnBook = returnBook;

    
    booksContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('borrow-btn')) {
            const bookId = event.target.getAttribute('data-book-id');
            const bookTitle = event.target.getAttribute('data-book-title');
            borrowBook(bookId, bookTitle);
        }
    });

    if (logoutButton) {
        console.log('Adding event listener to logoutButton');
        logoutButton.addEventListener('click', logout);
    }

      
      if (paginationControls) {
        prevPageButton.addEventListener('click', handlePagination);
        nextPageButton.addEventListener('click', handlePagination);
    }

    
    renderBooks();
});
    
