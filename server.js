const express = require('express');
const path = require('path');
const interns = require('./interns.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get a specific intern's data
app.get('/api/intern/:id', (req, res) => {
  const internId = parseInt(req.params.id);
  const intern = interns.find(i => i.id === internId);

  if (intern) {
    res.json(intern);
  } else {
    res.status(404).json({ message: 'Intern not found' });
  }
});

// API endpoint to get all interns for the leaderboard
app.get('/api/leaderboard', (req, res) => {
  // Sort interns by donations raised in descending order
  const sortedInterns = [...interns].sort((a, b) => b.donationsRaised - a.donationsRaised);
  res.json(sortedInterns);
});

// Dummy login endpoint (no real authentication)
app.post('/api/login', (req, res) => {
  // In a real app, you'd check credentials. For this demo, we'll just "succeed"
  // and send back a dummy intern ID.
  res.json({ success: true, internId: 1 }); // We'll always log in as intern ID 1
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});