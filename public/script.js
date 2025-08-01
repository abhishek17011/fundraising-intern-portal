const loginPage = document.getElementById('login-page');
const dashboardPage = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

// Dashboard elements
const internNameEl = document.getElementById('intern-name');
const referralCodeEl = document.getElementById('referral-code');
const donationsRaisedEl = document.getElementById('donations-raised');
const leaderboardList = document.getElementById('leaderboard-list');

// Function to fetch and display intern data
async function fetchInternData(internId) {
  try {
    const BACKEND_URL = 'https://fundraising-intern-portal-5vbc.onrender.com'; // Replace with your actual Render URL
    const response = await fetch(`${BACKEND_URL}/api/intern/${internId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch intern data');
    }
    const data = await response.json();
    
    // Update dashboard with fetched data
    internNameEl.textContent = `Welcome, ${data.name}!`;
    referralCodeEl.textContent = data.referralCode;
    donationsRaisedEl.textContent = data.donationsRaised.toLocaleString();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to fetch and display leaderboard data
async function fetchLeaderboard() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    const interns = await response.json();
    
    // Clear previous leaderboard items
    leaderboardList.innerHTML = '';
    
    interns.forEach((intern, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'leaderboard-item';
      listItem.innerHTML = `
        <span>${index + 1}. ${intern.name}</span>
        <strong>$${intern.donationsRaised.toLocaleString()}</strong>
      `;
      leaderboardList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Dummy login logic
  try {
    const response = await fetch('${BACKEND_URL}/api/login', { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      // Simulate successful login
      const internId = result.internId;
      sessionStorage.setItem('loggedInInternId', internId);
      
      // Show dashboard and hide login page
      loginPage.style.display = 'none';
      dashboardPage.style.display = 'block';
      
      // Fetch and display data for the logged-in intern and leaderboard
      fetchInternData(internId);
      fetchLeaderboard();
    } else {
      alert('Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login.');
  }
});

// Handle logout button click
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('loggedInInternId');
  dashboardPage.style.display = 'none';
  loginPage.style.display = 'flex';
});

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  const loggedInInternId = sessionStorage.getItem('loggedInInternId');
  if (loggedInInternId) {
    loginPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    fetchInternData(loggedInInternId);
    fetchLeaderboard();
  }
});