//window.onload = function() {
    // Check if user is a librarian
   // const user = JSON.parse(localStorage.getItem('loggedInUser'));
   // if (!user || user.role !== 'librarian') {
    //  alert('Access denied. You do not have permission to access this page.');
    //  window.location.href = 'login.html';
    //  return;
   // }
   const usersPerPage = 5;
   let currentPage = 1;
  
    function loadUsers() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userTableBody = document.querySelector('#userTable tbody');
      userTableBody.innerHTML = '';
  
      const startIndex = (currentPage - 1) * usersPerPage;
      const endIndex = Math.min(startIndex + usersPerPage, users.length);
      const currentUsers = users.slice(startIndex, endIndex);

      users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.firstname}</td>
          <td>${user.lastname}</td>
          <td>${user.email}</td>
          <td>${user.nationalId}</td>
          <td>${user.contactNo}</td>
          <td><button onclick="deleteUser(${index})">Delete</button></td>
        `;
        userTableBody.appendChild(row);
      });
    
      updatePaginationControls(users.length);
    }

    function updatePaginationControls(totalUsers) {
      const totalPages = Math.ceil(totalUsers / usersPerPage);
      document.getElementById('prevPage').disabled = currentPage === 1;
      document.getElementById('nextPage').disabled = currentPage === totalPages;
      document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
  }
  
    
    window.deleteUser = function(index) {
      if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
      }
    }

    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          loadUsers();
      }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const totalPages = Math.ceil(users.length / usersPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          loadUsers();
      }
  });

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    loadUsers();

    function logout() {
      localStorage.removeItem('loggedInUser'); 
      window.location.href = 'login.html'; 
  }
  