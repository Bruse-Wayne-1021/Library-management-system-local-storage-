// Hardcoded librarian credentials
const HARD_CODED_LIBRARIAN = {
  email: 'admin@gmail.com',
  password: 'admin123', 
  role: 'librarian'
};


document.getElementById('registerForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const nationalId = document.getElementById('nationalId').value;
  const contactNo = document.getElementById('contactNo').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    alert('User already exists.');
    return;
  }

  users.push({ firstname, lastname, email, nationalId, contactNo, password, role: 'user' });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful!');
  window.location.href = 'login.html';
});


document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.email === email && user.password === password);

  if (email === HARD_CODED_LIBRARIAN.email && password === HARD_CODED_LIBRARIAN.password) {
    
    localStorage.setItem('loggedInUser', JSON.stringify(HARD_CODED_LIBRARIAN));
    window.location.href = 'admin-dashboard.html'; 
  } else if (user) {
    
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'home.html'; 
    sessionStorage.setItem('email' , JSON.stringify(email));
  } else {
    alert('Invalid email or password.');
  }
});

// document.addEventListener('DOMContentLoaded', () => {
//   const loginForm = document.getElementById('loginForm');

//   loginForm.addEventListener('submit', (event) => {
//       event.preventDefault();

//       const email = document.getElementById('email').value;
//       const password = document.getElementById('password').value;

//       const users = JSON.parse(localStorage.getItem('users')) || [];
//       const user = users.find(user => user.email === email && user.password === password);

//       if (user) {
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           if (user.role === 'librarian') {
//               window.location.href = 'admin-dashboard.html'; 
//           } else {
//               window.location.href = 'home.html'; 
//           }
//       } else {
//           alert('Invalid email or password.');
//       }
//   });
// });


window.onload = function() {
  const profileInfo = document.getElementById('profileInfo');
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (user) {
    if (user.role === 'librarian') {
      document.getElementById('adminLink').style.display = 'inline'; 
    }
    profileInfo.innerHTML = `
      <p><strong>First Name:</strong> ${user.firstname}</p>
      <p><strong>Last Name:</strong> ${user.lastname}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>National ID:</strong> ${user.nationalId}</p>
      <p><strong>Contact No:</strong> ${user.contactNo}</p>
    `;
  } else {
    profileInfo.innerHTML = '<p>Please log in to view your profile.</p>';
  }
};


if (window.location.pathname === '/admin.html') {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'librarian') {
    alert('Access denied. You do not have permission to access this page.');
    window.location.href = 'login.html';
  }
}


document.getElementById('logout')?.addEventListener('click', function () {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
});
