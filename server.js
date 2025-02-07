const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccount = require("./foryou-be144-firebase-adminsdk-fbsvc-ccf2d78439.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://foryou-be144.firebaseio.com", // Replace with your actual database URL
});

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));  // Serve static files (HTML, CSS, JS)

// Serve your frontend (Make sure `index.html` is inside the `public` folder)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Endpoint to save button click data
app.post("/api/click", (req, res) => {
    const buttonClick = req.body.button;
    const db = admin.firestore();
    
    db.collection("buttonClicks").add({
        button: buttonClick,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => res.status(200).json({ message: "Data saved successfully!" }))
    .catch((error) => res.status(500).json({ message: "Error saving data", error }));
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at: http://localhost:${port}`);
});
