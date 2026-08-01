const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cloudinary Configuration
if (process.env.CLOUDINARY_URL) {
  // It will automatically parse from process.env.CLOUDINARY_URL
} else {
  console.warn('CLOUDINARY_URL environment variable is not set!');
}

// Multer Setup with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumehub',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    },
  },
});

const upload = multer({ storage: storage });

// API Route for Nanny Registration
app.post('/api/nannies', upload.any(), async (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      throw new Error('Form data payload is missing or undefined.');
    }
    const nannyData = JSON.parse(req.body.data);
    const skills = nannyData.skills || [];
    const references = nannyData.references || [];
    
    const files = req.files || [];

    // Process uploaded files
    const documents = files.map(file => ({
      type: file.fieldname,
      path: file.path // Secure Cloudinary URL
    }));

    // Call the stored procedure
    // Procedure signature: RegisterNanny(IN p_nanny_data JSON, IN p_skills JSON, IN p_references JSON, IN p_documents JSON, OUT p_nanny_id INT)
    
    // In MySQL, we need to handle the OUT parameter. With mysql2/promise and CALL, it's slightly different.
    // Instead of directly using OUT in CALL for node.js, it's easier to modify the stored procedure to SELECT the ID,
    // or use session variables. Since we already defined it with OUT, we can do:
    
    const [result] = await db.query(
      `CALL RegisterNanny(?, ?, ?, ?, @out_id);`,
      [
        JSON.stringify(nannyData),
        JSON.stringify(skills),
        JSON.stringify(references),
        JSON.stringify(documents)
      ]
    );

    const [idResult] = await db.query(`SELECT @out_id AS insertId;`);
    const insertId = idResult[0].insertId;

    // Email Sending Logic
    try {
      const resumeFile = files.find(f => f.fieldname === 'resume');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const mailOptions = {
        from: `"Nanny Registration Portal" <${process.env.SMTP_EMAIL}>`,
        to: process.env.RECEIVER_EMAIL || 'sandeep327hr@gmail.com',
        subject: `New Nanny Registration: ${nannyData.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #8b5cf6;">New Nanny Application Received</h2>
            <p>A new candidate has successfully registered on the portal.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
              ${Object.entries(nannyData).map(([key, value]) => {
                if (value === null || value === undefined || value === '' || typeof value === 'object') return '';
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `<tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 35%;"><strong>${formattedKey}:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value === true ? 'Yes' : value === false ? 'No' : value}</td>
                </tr>`;
              }).join('')}
              ${skills.length > 0 ? `<tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Skills:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${skills.join(', ')}</td>
                </tr>` : ''}
              ${references.length > 0 ? `<tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>References:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    ${references.map(r => `${r.name} (${r.relationship}) - ${r.phoneNumber}`).join('<br/>')}
                  </td>
                </tr>` : ''}
            </table>
            <p style="margin-top: 20px;">
              <strong>Resume Document:</strong> 
              ${resumeFile ? `<a href="${resumeFile.path}">Click here to view/download resume</a>` : 'No resume uploaded'}
            </p>
            <br/>
            <p style="font-size: 12px; color: #888;">This is an automated message from the Nanny Registration Portal.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Notification email sent to sandeep327hr@gmail.com');
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // We don't fail the registration if email fails, just log it.
    }

    res.status(201).json({
      message: 'Nanny registered successfully',
      nannyId: insertId
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      error: 'Failed to register nanny', 
      details: error ? error.toString() : 'Unknown',
      code: error && error.code ? error.code : 'No code',
      stack: error && error.stack ? error.stack : 'No stack'
    });
  }
});

// API Route to fetch all nannies for Admin Panel
app.get('/api/nannies', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, full_name, mobile_number, email_address, years_experience, expected_salary, created_at 
      FROM nannies 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nannies', 
      details: error ? error.toString() : 'Unknown',
      code: error && error.code ? error.code : 'No code',
      stack: error && error.stack ? error.stack : 'No stack'
    });
  }
});

// API Route to fetch a specific nanny's complete profile
app.get('/api/nannies/:id', async (req, res) => {
  try {
    const nannyId = req.params.id;
    
    // Fetch basic info
    const [nannyRows] = await db.query('SELECT * FROM nannies WHERE id = ?', [nannyId]);
    if (nannyRows.length === 0) {
      return res.status(404).json({ error: 'Nanny not found' });
    }
    const nanny = nannyRows[0];

    // Fetch skills
    const [skillsRows] = await db.query('SELECT skill_name FROM nanny_skills WHERE nanny_id = ?', [nannyId]);
    nanny.skills = skillsRows.map(row => row.skill_name);

    // Fetch references
    const [refRows] = await db.query('SELECT name, relationship, phone_number FROM nanny_references WHERE nanny_id = ?', [nannyId]);
    nanny.references = refRows;

    // Fetch documents
    const [docRows] = await db.query('SELECT document_type, file_path FROM nanny_documents WHERE nanny_id = ?', [nannyId]);
    nanny.documents = docRows;

    res.json(nanny);
  } catch (error) {
    console.error('Error fetching nanny details:', error);
    res.status(500).json({ error: 'Failed to fetch nanny details' });
  }
});

// Global Error Handler (catches Multer/Cloudinary errors)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  // Write error to a file so I can read it!
  const fs = require('fs');
  const path = require('path');
  const errorLog = {
    time: new Date().toISOString(),
    message: err.message,
    code: err.http_code || err.code || 'Unknown',
    stack: err.stack
  };
  fs.writeFileSync(path.join(__dirname, 'uploads', 'error.log'), JSON.stringify(errorLog, null, 2));

  res.status(500).json({ 
    error: 'Internal Server Error (Middleware)', 
    details: err.message, 
    code: err.http_code || err.code || 'Unknown' 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
