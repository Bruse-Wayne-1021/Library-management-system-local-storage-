document.addEventListener('DOMContentLoaded', () => {
    const booksReportSection = document.getElementById('books-report');
    const borrowedReportSection = document.getElementById('borrowed-report');
    const usersReportSection = document.getElementById('users-report');
    const overdueReportSection = document.getElementById('overdue-report');
    const returnsReportSection = document.getElementById('returns-report');

    function showReport(reportType) {
    
        booksReportSection.style.display = 'none';
        borrowedReportSection.style.display = 'none';
        usersReportSection.style.display = 'none';
        overdueReportSection.style.display = 'none';
       

        
        switch (reportType) {
            case 'books':
                booksReportSection.style.display = 'block';
                generateBooksReport();
                break;
            case 'borrowed':
                borrowedReportSection.style.display = 'block';
                generateBorrowedReport();
                break;
            case 'users':
                usersReportSection.style.display = 'block';
                generateUsersReport();
                break;
            case 'overdue':
                overdueReportSection.style.display = 'block';
                generateOverdueReport();
                break;
            case 'returns':
                returnsReportSection.style.display = 'block';
                generateReturnsReport();
                break;
            default:
                booksReportSection.style.display = 'block';
                generateBooksReport();
        }
    }

    function generateBooksReport() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        let html = `
            <h2>Books Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                        <th>Quality</th>
                    </tr>
                </thead>
                <tbody>
        `;
        books.forEach(book => {
            html += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${book.quality || 'N/A'}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        booksReportSection.innerHTML = html;
    }

    function generateBorrowedReport() {
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        const books = JSON.parse(localStorage.getItem('books')) || [];
        let html = `
            <h2>Borrowed Books Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Borrowed By</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        borrowedBooks.forEach(record => {
            const book = books.find(book => book.id === record.id);
            html += `
                <tr>
                    <td>${record.id}</td>
                    <td>${book ? book.title : 'Unknown Title'}</td>
                    <td>${record.borrowedBy.email}</td>
                    <td>${new Date(record.borrowDate).toLocaleDateString() || 'N/A'}</td>
                    <td>${new Date(record.dueDate).toLocaleDateString() || 'N/A'}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        borrowedReportSection.innerHTML = html;
    }

    function generateUsersReport() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let html = `
            <h2>User Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th>Borrowed Books Count</th>
                    </tr>
                </thead>
                <tbody>
        `;
        users.forEach(user => {
            const borrowedCount = JSON.parse(localStorage.getItem('borrowedBooks'))?.filter(record => record.borrowedBy.email === user.email).length || 0;
            html += `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.lastname || 'N/A'}</td>
                    <td>${user.contactNo || 'N/A'}</td>
                    <td>${borrowedCount}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        usersReportSection.innerHTML = html;
    }

    function generateOverdueReport() {
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        const now = new Date();
        let html = `
            <h2>Overdue Books Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Borrowed By</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        borrowedBooks.forEach(record => {
            const dueDate = new Date(record.dueDate);
            if (dueDate < now) {
                const books = JSON.parse(localStorage.getItem('books')) || [];
                const book = books.find(book => book.id === record.id);
                html += `
                    <tr>
                        <td>${record.id}</td>
                        <td>${book ? book.title : 'Unknown Title'}</td>
                        <td>${record.borrowedBy.email}</td>
                        <td>${new Date(record.borrowDate).toLocaleDateString() || 'N/A'}</td>
                        <td>${new Date(record.dueDate).toLocaleDateString() || 'N/A'}</td>
                    </tr>
                `;
            }
        });
        html += `
                </tbody>
            </table>
        `;
        overdueReportSection.innerHTML = html;
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    showReport('books');

    // This is the logout function
    function logout() {
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
    }

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            showReport(button.getAttribute('onclick').split("'")[1]);
        });
    });
});
