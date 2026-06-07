const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');

const app = express();

const PORT = process.env.PORT || 3000; 

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, shortid.generate() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    
    const downloadLink = `${req.protocol}://${req.get('host')}/download/${req.file.filename}`;
    
    setTimeout(() => {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`⏰ Timer Expired: ${req.file.filename} deleted.`);
        }
    }, 60 * 60 * 1000); 

    res.json({ downloadLink });
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (!err) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`✅ Success: ${req.params.filename} deleted after download.`);
                } catch (unlinkErr) {
                    console.error("Deletion Error:", unlinkErr);
                }
            }
        });
    } else {
        res.status(404).send('<h1>Link Expired or File Not Found</h1>');
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));