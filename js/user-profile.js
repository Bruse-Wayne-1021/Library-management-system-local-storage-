document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const photoInput = document.getElementById('photoInput');
    const profilePhoto = document.getElementById('profilePhoto');
    const logoutButton = document.getElementById('logout');
    const borrowedBooksBody = document.getElementById('borrowedBooksBody');

    
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        alert('Please log in to view this page.');
        window.location.href = 'login.html';
        return;
    }

    
    document.getElementById('firstname').value = user.firstname || '';
    document.getElementById('lastname').value = user.lastname || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('contactNo').value = user.contactNo || '';

    
    if (user.photoUrl) {
        profilePhoto.src = user.photoUrl;
    }

   
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePhoto.src = event.target.result;
                user.photoUrl = event.target.result;
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                
                let allUsers = JSON.parse(localStorage.getItem('users')) || [];
                allUsers = allUsers.map(u => u.email === user.email ? user : u);
                localStorage.setItem('users', JSON.stringify(allUsers));
            };
            reader.readAsDataURL(file);
        }
    });

    
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

     
        if (currentPassword !== user.password) {
            alert('Current password is incorrect.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        
        user.firstname = document.getElementById('firstname').value;
        user.lastname = document.getElementById('lastname').value;
        user.contactNo = document.getElementById('contactNo').value;
        if (newPassword) user.password = newPassword;

        localStorage.setItem('loggedInUser', JSON.stringify(user));

        
        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        allUsers = allUsers.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(allUsers));

        alert('Profile updated successfully!');
    });

    
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const email = JSON.parse(sessionStorage.getItem('email'));
    borrowedBooks.forEach(book => {
        if(book.borrowedBy.email == email){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${new Date(book.borrowDate).toDateString()}</td>
                <td>${new Date(book.dueDate).toDateString()}</td>
            `;
            borrowedBooksBody.appendChild(row);
        }
        
    });
});
