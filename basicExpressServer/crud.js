// const express = require('express');
// const app = express();
// app.use(express.json());

// let books = [];

// // Create
// app.post('/books', (req, res) => {
//   // basic validation
//   const { title, author } = req.body;
//   if (!title || !author) return res.status(400).json({ error: 'title and author required' });

//   const b = { ...req.body, id: Date.now().toString() }; // id last so client can't override
//   books.push(b);
//   res.status(201).json(b);
// });

// // Read
// app.get('/books', (req, res) => res.json(books));

// // Update
// app.put('/books/:id', (req, res) => {
//   const id = req.params.id;
//   let found = false;
//   books = books.map(b => {
//     if (b.id === id) {
//       found = true;
//       return { ...b, ...req.body, id: b.id }; // preserve id
//     }
//     return b;
//   });

//   if (!found) return res.status(404).json({ error: 'book not found' });
//   res.json({ ok: true });
// });

// // Delete
// app.delete('/books/:id', (req, res) => {
//   const id = req.params.id;
//   const prevLen = books.length;
//   books = books.filter(b => b.id !== id);
//   if (books.length === prevLen) return res.status(404).json({ error: 'book not found' });
//   res.status(204).send(); // no content
// });

// app.listen(3002, () => console.log('Server listening on http://localhost:3002'));


// step3-1.js
// step3-2.js
// const express = require('express');
// const multer = require('multer');
// const upload = multer({ dest: './uploads/' });
// const app = express();
// app.post('/upload-avatar', upload.single('avatar'), (req,res)=> {
//   if(!req.file) return res.status(400).send('no file');
//   res.json({ filename: req.file.filename, original: req.file.originalname });
// });
// app.listen(3004);
// step4-1.js
// const express = require('express');
// const app = express(); app.use(express.json());
// const favsByUser = {}; // {email: [{id,title}]}
// app.post('/:user/favorites', (req,res)=>{
//   const u = req.params.user; favsByUser[u] = favsByUser[u] || [];
//   const item = { id: Date.now().toString(), title: req.body.title };
//   favsByUser[u].push(item);
//   res.status(201).json(item);
// });
// app.get('/:user/favorites',(req,res)=> res.json(favsByUser[req.params.user]||[]));
// app.listen(3005);

// step5-1-complex-mongo.js
// require('dotenv').config();
// const express = require('express');
// const { MongoClient, ObjectId } = require('mongodb');

// const app = express();
// app.use(express.json());

// // Use the correct env variable name
// const uri = process.env.MONGO_URI;  
// if (!uri) {
//   throw new Error("❌ MONGO_URI is not defined in .env");
// }

// const client = new MongoClient(uri);

// async function borrowBook(userId, bookId) {
//   const db = client.db('userDb'); // your database name
//   const books = db.collection('books');
//   const borrows = db.collection('borrows');
//   const reservations = db.collection('reservations');
//   const borrowLogs = db.collection('borrow_logs');
//   const stockAlerts = db.collection('stock_alerts');

//   const session = client.startSession();

//   try {
//     await session.withTransaction(async () => {
//       // 1️⃣ Check borrow limit per user (max 5)
//       const userBorrowsCount = await borrows.countDocuments(
//         { user_id: userId, returned_at: { $exists: false } },
//         { session }
//       );
//       if (userBorrowsCount >= 5) {
//         throw new Error('User borrow limit reached');
//       }

//       // 2️⃣ Get book document and check availability
//       const book = await books.findOne({ _id: new ObjectId(bookId) }, { session });
//       if (!book) throw new Error('Book not found');

//       if (book.copies < 1) {
//         // 3️⃣ Add reservation if no copies
//         await reservations.insertOne(
//           { user_id: userId, book_id: book._id, reserved_at: new Date() },
//           { session }
//         );

//         // Log reservation
//         await borrowLogs.insertOne(
//           { user_id: userId, book_id: book._id, action: 'reserved', action_time: new Date() },
//           { session }
//         );

//         throw new Error('No copies available. You are added to the reservation list.');
//       }

//       // 4️⃣ Decrement copies
//       await books.updateOne(
//         { _id: book._id },
//         { $inc: { copies: -1 } },
//         { session }
//       );

//       // 5️⃣ Insert borrow with due date (14 days)
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 14);
//       await borrows.insertOne(
//         { user_id: userId, book_id: book._id, borrowed_at: new Date(), due_date: dueDate },
//         { session }
//       );

//       // 6️⃣ Log borrow action
//       await borrowLogs.insertOne(
//         { user_id: userId, book_id: book._id, action: 'borrow', action_time: new Date() },
//         { session }
//       );

//       // 7️⃣ Low-stock alert if remaining copies < 2
//       if (book.copies - 1 < 2) {
//         await stockAlerts.insertOne(
//           { book_id: book._id, alert_at: new Date() },
//           { session }
//         );
//       }
//     });

//     console.log('✅ Book borrowed successfully!');
//   } catch (e) {
//     console.error('❌ Transaction failed:', e.message);
//     throw e;
//   } finally {
//     await session.endSession();
//   }
// }

// // API endpoint for borrowing a book
// app.post('/borrow/:userId/:bookId', async (req, res) => {
//   try {
//     await borrowBook(req.params.userId, req.params.bookId);
//     res.json({ success: true, message: "Book borrowed successfully" });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// });

// async function start() {
//   try {
//     await client.connect();
//     console.log("✅ Connected to MongoDB Atlas");
//     app.listen(process.env.PORT || 3007, () => {
//       console.log("🚀 Server is running on port", process.env.PORT || 3007);
//     });
//   } catch (err) {
//     console.error("❌ Failed to connect to DB:", err.message);
//     process.exit(1);
//   }
// }

// start();
// step6-1.js
// const fetch = require('node-fetch'); // npm i node-fetch@2
// const express = require('express');
// const app = express();
// app.use(express.json());

// const API_KEY = "3647a41f5491184e26d10f72695655eb"; // replace with your actual key

// app.post('/fetch-weather', async (req, res) => {
//   try {
//     const city = req.body.city || 'Berlin';

//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     if (!response.ok) {
//       return res.status(500).json({ ok: false, error: 'Weather API failed' });
//     }

//     const data = await response.json();
//     res.json({
//       ok: true,
//       city: data.name,
//       temperature: data.main.temp,
//       description: data.weather[0].description,
//       wind_speed: data.wind.speed
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ ok: false, error: 'Something went wrong' });
//   }
// });

// app.listen(3007, () => console.log('Server running on port 3007'));
// // step6-2.js
// const express = require('express');
// const app = express(); app.use(express.json());
// const processed = new Set(); // store event ids (persist in real DB)
// app.post('/webhooks/github', (req,res)=>{
//   const id = req.headers['x-github-delivery'] || req.body.id;
//   if(processed.has(id)) return res.status(200).send('ignored');
//   processed.add(id);
//   // process event...
//   console.log('Received', req.body.action || 'event');
//   res.status(200).send('ok');
// });
// app.listen(3008);
// step7-retry.js
// const express = require('express');
// const Queue = require('bull');

// // Bull Board Imports
// const { createBullBoard } = require('@bull-board/api');
// const { BullAdapter } = require('@bull-board/api/bullAdapter');
// const { ExpressAdapter } = require('@bull-board/express');

// const app = express();
// app.use(express.json());

// // ------------------------------------
// // 🔹 1. Initialize Bull Queue
// // ------------------------------------
// const emailQueue = new Queue('email', {
//   redis: { host: '127.0.0.1', port: 6379 },
// });

// // ------------------------------------
// // 🔹 2. Processor Logic with Retry Simulation
// // ------------------------------------
// emailQueue.process(async (job) => {
//   console.log('📤 Sending email to', job.data.to);

//   // Simulate 50% random failure
//   if (Math.random() < 0.5) {
//     console.log('❌ SMTP Down! Retrying soon...');
//     throw new Error('SMTP Down!');
//   }

//   console.log('✅ Email sent successfully to', job.data.to);
//   return { success: true };
// });

// // ------------------------------------
// // 🔹 3. Express Endpoint to Add Job
// // ------------------------------------
// app.post('/send-email', async (req, res) => {
//   try {
//     const { to } = req.body;

//     if (!to) {
//       return res.status(400).json({ error: 'Recipient email (to) is required' });
//     }

//     // Add job with retry & exponential backoff
//     const job = await emailQueue.add(
//       { to },
//       {
//         attempts: 5,
//         backoff: { type: 'exponential', delay: 1000 }, // 1s, 2s, 4s, 8s, 16s
//       }
//     );

//     res.json({
//       message: '📨 Email job added to queue',
//       jobId: job.id,
//     });
//   } catch (err) {
//     console.error('❌ Error adding job:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------------------------
// // 🔹 4. Optional Endpoint: Get Job Status
// // ------------------------------------
// app.get('/job/:id', async (req, res) => {
//   try {
//     const job = await emailQueue.getJob(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     const state = await job.getState();
//     const attemptsMade = job.attemptsMade;
//     const failedReason = job.failedReason;

//     res.json({ id: job.id, state, attemptsMade, failedReason });
//   } catch (err) {
//     console.error('❌ Error fetching job:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------------------------
// // 🔹 5. Bull Board Dashboard Setup
// // ------------------------------------
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');

// createBullBoard({
//   queues: [new BullAdapter(emailQueue)],
//   serverAdapter,
// });

// app.use('/admin/queues', serverAdapter.getRouter());

// // ------------------------------------
// // 🔹 6. Start the Server
// // ------------------------------------
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at: http://localhost:${PORT}`);
//   console.log(`📊 Bull Board running at: http://localhost:${PORT}/admin/queues`);
// });
const express = require('express');
const Queue = require('bull');
const nodemailer = require('nodemailer');

// Bull Board Imports
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const app = express();
app.use(express.json());

// ------------------------------------
// 🔹 1. Initialize Email Queue
// ------------------------------------
const emailQueue = new Queue('email', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// ------------------------------------
// 🔹 2. Configure Nodemailer Transport
// ------------------------------------
// ⚙️ Option A — Using Mailtrap (safe for testing)
// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "YOUR_MAILTRAP_USER",
//     pass: "YOUR_MAILTRAP_PASS",
//   },
// });

// ⚙️ Option B — Using Gmail SMTP (less recommended for testing)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kanhaiya03102000@gmail.com',
    pass: 'hfyg atde jeom dpnv', // Use App Password (not your Gmail password)
  },
});

// ------------------------------------
// 🔹 3. Processor with Controlled Failure
// ------------------------------------
emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  console.log(`📤 Sending email to ${to}...`);

  // Artificial failure: simulate a bad job
  if (subject && subject.toLowerCase().includes('fail')) {
    console.log('❌ Simulated failure triggered for testing retries...');
    throw new Error('Simulated Email Failure');
  }

  // Send real email
  await transporter.sendMail({
    from: '"Test Mailer" <noreply@example.com>',
    to,
    subject,
    text,
  });

  console.log(`✅ Email successfully sent to ${to}`);
  return { delivered: true };
});

// ------------------------------------
// 🔹 4. Add Email Job API
// ------------------------------------
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({
        error: 'Fields required: to, subject, text',
      });
    }

    // Add job with retry + exponential backoff
    const job = await emailQueue.add(
      { to, subject, text },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      }
    );

    res.json({
      message: '📨 Email job added to queue',
      jobId: job.id,
    });
  } catch (err) {
    console.error('❌ Error adding job:', err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------
// 🔹 5. Check Job Status API
// ------------------------------------
app.get('/job/:id', async (req, res) => {
  try {
    const job = await emailQueue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const state = await job.getState();
    const attemptsMade = job.attemptsMade;
    const failedReason = job.failedReason;

    res.json({ id: job.id, state, attemptsMade, failedReason });
  } catch (err) {
    console.error('❌ Error fetching job:', err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------
// 🔹 6. Bull Board Dashboard
// ------------------------------------
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// ------------------------------------
// 🔹 7. Start Server
// ------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/admin/queues`);
});
