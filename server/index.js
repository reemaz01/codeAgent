const express = require('express');
const cors = require('cors');
require('dotenv').config();

const repoRoutes = require('./src/routes/repo');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeAgent server running' });
});

app.use('/api/repo', repoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
