const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'models/') // Store files in 'models' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Keep original filename
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept .gltf and .bin files
        if (file.originalname.match(/\.(gltf|bin)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Only .gltf and .bin files are allowed'));
        }
    }
});

// Serve static files from the models directory
app.use('/models', express.static('models'));

// Root route - Add a simple upload form
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>GLTF Model Upload</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        max-width: 800px; 
                        margin: 20px auto; 
                        padding: 20px;
                    }
                    .upload-form {
                        border: 1px solid #ddd;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .model-list {
                        margin-top: 20px;
                    }
                    button {
                        background: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background: #45a049;
                    }
                </style>
            </head>
            <body>
                <h1>GLTF Model Upload</h1>
                <div class="upload-form">
                    <h2>Upload Model Files</h2>
                    <form action="/upload" method="post" enctype="multipart/form-data">
                        <div>
                            <input type="file" name="models" accept=".gltf,.bin" multiple>
                        </div>
                        <div style="margin-top: 10px;">
                            <button type="submit">Upload</button>
                        </div>
                    </form>
                </div>
                <div class="model-list">
                    <h2>Uploaded Models</h2>
                    <div id="modelList"></div>
                </div>

                <script>
                    // Fetch and display uploaded models
                    fetch('/api/models')
                        .then(response => response.json())
                        .then(data => {
                            const modelList = document.getElementById('modelList');
                            if (data.models.length === 0) {
                                modelList.innerHTML = '<p>No models uploaded yet.</p>';
                                return;
                            }
                            data.models.forEach(model => {
                                const div = document.createElement('div');
                                div.style.margin = '10px 0';
                                div.textContent = model.name;
                                modelList.appendChild(div);
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching models:', error);
                        });
                </script>
            </body>
        </html>
    `);
});

// Handle model upload
app.post('/upload', upload.array('models'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        // After successful upload, redirect back to the home page
        res.redirect('/');
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading files');
    }
});

// Get list of available models
app.get('/api/models', (req, res) => {
    const fs = require('fs');
    const modelsDir = 'models';
    
    try {
        // Create models directory if it doesn't exist
        if (!fs.existsSync(modelsDir)) {
            fs.mkdirSync(modelsDir);
        }
        
        const files = fs.readdirSync(modelsDir);
        const models = files
            .filter(file => file.endsWith('.gltf'))
            .map(file => ({
                id: file.replace('.gltf', ''),
                name: file,
                url: `/models/${file}`
            }));
        
        res.json({ models });
    } catch (error) {
        console.error('Error reading models:', error);
        res.status(500).json({ error: 'Error reading models directory' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});