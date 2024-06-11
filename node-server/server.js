const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let profiles = [];
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('image'), (req, res) => {
  const profile = {
    name: req.body.name,
    imagePath: `http://localhost:3000/uploads/${req.file.filename}`
  };
  profiles.push(profile);
  res.send({ message: 'File uploaded successfully', file: req.file });
});

app.get('/profiles', (req, res) => {
  try {
    res.json(profiles);
  } catch (error) {
    console.error('Error occurred while fetching profiles:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
