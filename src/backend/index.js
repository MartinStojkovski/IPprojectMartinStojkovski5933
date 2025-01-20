const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;


app.use(cors({
  origin: 'http://localhost:4200', // Frontend's origin
}));




const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    const uploadPath = path.join(__dirname, "uploads"); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); 
    }
    cb(null, uploadPath);
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); 
  },
});

const upload = multer({ storage: storage });


app.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    console.log(`PDF received: ${req.file.filename}`);
    res.status(200).json({
      message: "PDF uploaded successfully.",
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/list-files", (req, res) => {
  const uploadPath = path.join(__dirname, "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      return res.status(500).json({ message: "Failed to list files." });
    }
    res.status(200).json(files);
  });
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

