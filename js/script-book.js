
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookTable = document.getElementById('book-table').getElementsByTagName('tbody')[0];
    const bookIdInput = document.getElementById('book-id');
    const photoInput = document.getElementById('photo');
    const qualityInput = document.getElementById('quality'); 
    const popupForm = document.getElementById('popup-form');
    const closePopupBtn = document.querySelector('.close-btn');
    const searchBar = document.getElementById('search-bar');
    const pagination = document.getElementById('pagination');

    let books = JSON.parse(localStorage.getItem('books')) || [];
    const rowsPerPage = 5;
    let currentPage = 1;

    function openPopup() {
        popupForm.style.display = 'flex';
    }

    function closePopup() {
        popupForm.style.display = 'none';
    }

    function renderTable() {
        bookTable.innerHTML = '';
        const filteredBooks = filterBooks();
        const paginatedBooks = paginateBooks(filteredBooks);

        paginatedBooks.forEach(book => {
            const row = bookTable.insertRow();
            row.innerHTML = `
                <td>${book.id}</td>
                <td><img src="${book.photo}" alt="${book.title}" style="width: 50px; height: 50px;"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.quality}</td> <!-- New column -->
                <td>
                    <button class="edit" onclick="editBook('${book.id}')">Edit</button>
                    <button class="delete" onclick="deleteBook('${book.id}')">Delete</button>
                </td>
            `;
        });

        renderPagination(filteredBooks.length);
    }

    function filterBooks() {
        const query = searchBar.value.toLowerCase();
        return books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
    }

    function paginateBooks(filteredBooks) {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredBooks.slice(start, end);
    }

    function renderPagination(totalItems) {
        const pageCount = Math.ceil(totalItems / rowsPerPage);
        pagination.innerHTML = '';

        if (pageCount <= 1) return;

        if (currentPage > 1) {
            pagination.innerHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
        }

        for (let i = 1; i <= pageCount; i++) {
            pagination.innerHTML += `<button class="${i === currentPage ? 'disabled' : ''}" onclick="changePage(${i})">${i}</button>`;
        }

        if (currentPage < pageCount) {
            pagination.innerHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        }
    }

    function changePage(page) {
        if (page < 1 || page > Math.ceil(books.length / rowsPerPage)) return;
        currentPage = page;
        renderTable();
    }

    function addBook(e) {
        e.preventDefault();

        const id = bookIdInput.value || new Date().toISOString();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const quality = qualityInput.value; 

        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const photo = reader.result;

            if (id) {
                const index = books.findIndex(book => book.id === id);
                if (index >= 0) {
                    books[index] = { id, title, author, year, quality, photo }; 
                } else {
                    books.push({ id, title, author, year, quality, photo }); 
                }
            } else {
                books.push({ id, title, author, year, quality, photo }); 
            }

            saveToLocalStorage();
            renderTable();
            closePopup();
            bookForm.reset();
            bookIdInput.value = '';
            photoInput.value = '';
            qualityInput.value = ''; 
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a photo.');
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function editBook(id) {
        const book = books.find(book => book.id === id);
        if (book) {
            document.getElementById('book-id').value = book.id;
            document.getElementById('book-title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('year').value = book.year;
            qualityInput.value = book.quality; 
            openPopup();
        }
    }

    function deleteBook(id) {
        books = books.filter(book => book.id !== id);
        saveToLocalStorage();
        renderTable();
    }

     
     function logout() {
        
        localStorage.removeItem('loggedInUser'); 

        
        window.location.href = 'login.html'; 
    }

    window.changePage = changePage;
    window.editBook = editBook;
    window.deleteBook = deleteBook;

    bookForm.addEventListener('submit', addBook);
    closePopupBtn.addEventListener('click', closePopup);
    document.getElementById('open-form-btn').addEventListener('click', openPopup);
    searchBar.addEventListener('input', () => {
        currentPage = 1;
        renderTable();
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    renderTable();
});
