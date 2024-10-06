document.addEventListener('DOMContentLoaded', () => {
    const borrowedBooksTable = document.getElementById('borrowedBooksTable').getElementsByTagName('tbody')[0];
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const returnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];

    function renderBorrowedBooks() {
        borrowedBooksTable.innerHTML = '';

        borrowedBooks.forEach(record => {
            const row = borrowedBooksTable.insertRow();
            const book = books.find(book => book.id === record.id);

            row.innerHTML = `
                <td>${record.id}</td>
                <td>${book ? book.title : 'Unknown Title'}</td>
                <td>${record.borrowedBy.email}</td>
                <td>${new Date(record.borrowDate).toLocaleDateString() || 'N/A'}</td>
                <td>${new Date(record.dueDate).toLocaleDateString() || 'N/A'}</td>
                <td>
                    <button onclick="returnBook('${record.id}')">Return</button>
                </td>
            `;
        });
    }

    function returnBook(id) {
        
        const recordIndex = borrowedBooks.findIndex(record => record.id === id);
        if (recordIndex === -1) {
            alert('Book record not found.');
            return;
        }
        
        
        const record = borrowedBooks[recordIndex];
        borrowedBooks.splice(recordIndex, 1);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

        
        const book = books.find(book => book.id === id);
        if (book) {
            book.quality = (book.quality || 0) + 1;
            localStorage.setItem('books', JSON.stringify(books));
        }

        
        returnedBooks.push({
            ...record,
            returnDate: new Date().toISOString() 
        });
        localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));

        alert('Book returned successfully.');
        renderBorrowedBooks(); 
    }

    
    window.returnBook = returnBook;

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    
    renderBorrowedBooks();
});


let lastBooksData = JSON.stringify(localStorage.getItem('books')) || '[]';
let lastUsersData = JSON.stringify(localStorage.getItem('users')) || '[]';
let lastBorrowedBooksData = JSON.stringify(localStorage.getItem('borrowedBooks')) || '[]';


function loadDashboardData(){
    
    const books=JSON.parse(localStorage.getItem('books')) || [];
    const totalBooks = books.length;
    document.getElementById('totalBooksCount').textContent=totalBooks;

    
    const users=JSON.parse(localStorage.getItem('users')) || [];
    const totalUsers = users.length;
    document.getElementById('totalUsersCount').textContent=totalUsers;

    const borrowedBooks=JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const totalBorrowedBooks=borrowedBooks.length;
    document.getElementById('totalBorrowedBooksCount').textContent=totalBorrowedBooks;
    //retrieve and count total borrowed books
    //const borrowedBooks=books.filter(book => book.isBorrowed);
    //const totalBorrowedBooks = borrowedBooks.length;
   // document.getElementById('totalBorrowedBooksCount').textContent=totalBorrowedBooks;
}

function checkForChanges() {
    const currentBooksData = JSON.stringify(localStorage.getItem('books')) || '[]';
    const currentUsersData = JSON.stringify(localStorage.getItem('users')) || '[]';
    const currentBorrowedBooksData = JSON.stringify(localStorage.getItem('borrowedBooks')) || '[]';

    if (currentBooksData !== lastBooksData || 
        currentUsersData !== lastUsersData || 
        currentBorrowedBooksData !== lastBorrowedBooksData) {
        loadDashboardData();
        lastBooksData = currentBooksData;
        lastUsersData = currentUsersData;
        lastBorrowedBooksData = currentBorrowedBooksData;
    }
}


loadDashboardData();


setInterval(checkForChanges, 2000);

function logout() {
    
    localStorage.removeItem('loggedInUser'); 

    
    window.location.href = 'login.html'; 
}



