const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set your admin password here
const ADMIN_PASSWORD = 'piyalstores123';

// Serve static files with html extension support
app.use(express.static(__dirname, { extensions: ['html'] }));

// Fallback for clean URLs
app.get('/:page', (req, res, next) => {
    const filePath = path.join(__dirname, req.params.page + '.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        next();
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname);
    },
    filename: (req, file, cb) => {
        const targetName = req.body.targetFileName || file.originalname;
        cb(null, targetName);
    }
});

const upload = multer({ storage: storage });

// SECURED API to handle image uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
    const password = req.body.password;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).send('Unauthorized: Incorrect Password');
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({ message: 'Success', filename: req.file.filename });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
