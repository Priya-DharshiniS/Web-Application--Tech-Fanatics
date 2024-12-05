const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
const { MONGO_URL, PORT, SESSION_SECRET } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDb is connected successfully'))
  .catch((err) => console.error('MongoDb connection error:', err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


// Sample User model
const User = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
});
const QuizMarks = mongoose.model('QuizMarks', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  marks: {
    qns1: String,
    qns2: String,
    qns3: String,
    qns4: String,
    qns5: String,
    qns6: String,
    qns7: String,
    qns8: String,
    qns9: String,
    qns10: String,
  },
});
const Card = mongoose.model('Card', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cardId: String,
  cardState: String,
});

app.get('/signup', async (req, res) => {
  try {
    // Fetch user data from the database
    const data = await User.find();

    // Render the 'signup' view with user data
    res.render('signup', { message: req.flash('error'), data });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('error', 'Email already exists. Please choose a different email!');
      return res.redirect('/signup');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    // Save the user to the database
    await user.save();

    // Redirect to login after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

  
// Login route
app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ email });
  
      if (!user) {
        req.flash('error', 'Invalid mail id or password!');
        return res.redirect('/login');
      }
  
      // Check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        req.flash('error', 'Invalid mail id or password!');
        return res.redirect('/login');
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
  
      // Set the token in the cookie
      res.cookie('token', token);
  
      // Redirect to the index page after successful login
      res.redirect('/profile');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Authentication middleware
// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login'); 
  }

  jwt.verify(token, 'secret_key', async (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.redirect('/login');
      }

      req.user = { userId: decoded.userId, username: user.username };
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
};

  
  // Logout route
  app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
  });

  app.get('/signup',(req,res)=>{
    req.redirect('/signup')
  })

app.get('/', (req, res) => {
    res.render('home');
});

 // Index route (protected by authentication)
app.get('/profile', authenticateToken, (req, res) => {
    res.render('profile', { username: req.user.username }); // Pass the username to the template
  });
  

app.get('/kanban', authenticateToken, (req, res) => {
    res.render('kanban', { username: req.user.username });
  });
  

 // Assuming cardIndex is declared and assigned some value before the route handler
 app.get('/video1', authenticateToken, (req, res) => {
  res.render('video1', { username: req.user.username });
});
app.get('/video2', authenticateToken, (req, res) => {
  res.render('video2', { username: req.user.username });
});
app.get('/video3', authenticateToken, (req, res) => {
  res.render('video3', { username: req.user.username });
});
app.get('/video4', authenticateToken, (req, res) => {
  res.render('video4', { username: req.user.username });
});
app.get('/video5', authenticateToken, (req, res) => {
  res.render('video5', { username: req.user.username });
});
app.get('/video6', authenticateToken, (req, res) => {
  res.render('video6', { username: req.user.username });
});
app.get('/video7', authenticateToken, (req, res) => {
  res.render('video7', { username: req.user.username });
});
app.get('/video8', authenticateToken, (req, res) => {
  res.render('video8', { username: req.user.username });
});
app.get('/video9', authenticateToken, (req, res) => {
  res.render('video9', { username: req.user.username });
});
app.get('/video10', authenticateToken, (req, res) => {
  res.render('video10', { username: req.user.username });
});

app.get('/qns1', authenticateToken, (req, res) => {
  res.render('qns1', { username: req.user.username });
});
app.get('/qns2', authenticateToken, (req, res) => {
  res.render('qns2', { username: req.user.username });
});
app.get('/qns3', authenticateToken, (req, res) => {
  res.render('qns3', { username: req.user.username });
});
app.get('/qns4', authenticateToken, (req, res) => {
  res.render('qns4', { username: req.user.username });
});
app.get('/qns5', authenticateToken, (req, res) => {
  res.render('qns5', { username: req.user.username });
});
app.get('/qns6', authenticateToken, (req, res) => {
  res.render('qns6', { username: req.user.username });
});
app.get('/qns7', authenticateToken, (req, res) => {
  res.render('qns7', { username: req.user.username });
});
app.get('/qns8', authenticateToken, (req, res) => {
  res.render('qns8', { username: req.user.username });
});
app.get('/qns9', authenticateToken, (req, res) => {
  res.render('qns9', { username: req.user.username });
});
app.get('/qns10', authenticateToken, (req, res) => {
  res.render('qns10', { username: req.user.username });
});

app.get('/alogin',(req,res)=>{
  res.render('alogin');
});



app.post('/authenticate', (req, res) => {
  const password = req.body.password;

  // Check if the password is correct (replace with a secure authentication mechanism)
  if (password === 'I am admin.') {
    req.session.authenticated = true;
    res.redirect('/admin');
  } else {
    res.status(401).send('Incorrect password. Please try again.');
  }
});

app.get('/admin', (req, res) => {
  if (req.session.authenticated) {
    res.render('admin');
  } else {
    res.redirect('/alogin');
  }
});
app.get('/ausers', async (req, res) => {
  try {
    // Fetch user data from the database
    const data = await User.find();

    // Render the 'ausers' view with user data
    res.render('ausers', { data,userCount: data.length});
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/amarks', async (req, res) => {
  try {
    // Fetch quiz marks data from the database and select only the 'user' and 'marks' fields
    const data = await QuizMarks.find().populate('user').select('user marks');

    // Render the 'amarks' view with quiz marks data
    res.render('amarks', { data, userCount: data.length });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/aupdate', async (req, res) => {
  try {
    // Fetch user data from the database
    const data = await User.find();

    // Render the 'ausers' view with user data
    res.render('aupdate', { data,userCount: data.length });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/edit/:id',async (req,res)=>{
  try {
      const data = await User.findById(req.params.id);
      if(!data){
          return res.status(404).send('user not found')
      }
      res.render('edit',{data});
  }
  catch(err){
      console.log(err);
      res.status(500).send('Internal server error');
  }
})

app.post('/edit/:id', async (req, res) => {
  try{
      const{username,email,password} = req.body;

     await User.findByIdAndUpdate(req.params.id,{
         username,
         email,
         password,
      });
      res.redirect("/aupdate");

  }catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/delete/:id',async (req,res)=>{
  try {
      await User.findByIdAndDelete(req.params.id);
res.redirect('/aupdate');
  }
  catch(err){
      console.log(err);
      res.status(500).send('Internal server error');
  }
})



app.get('/profile', authenticateToken, (req, res) => {
  res.render('profile', { username: req.user.username }); // Pass the username to the template
});



// Modify the route handlers for quiz submissions
// Modify the route handlers for quiz submissions
// Modify the route handlers for quiz submissions
// Modify the route handlers for quiz submissions
app.post('/saveQuizMarks', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const { userAnswers } = req.body;
    const validAnswers = userAnswers.every(answer => typeof answer === 'number' || typeof answer === 'string');

    if (!validAnswers) {
      return res.status(400).json({ error: 'Invalid quiz answers provided.' });
    }
    
    // Save the quiz marks to your database
    // Update the logic based on your database schema and model
    // Example: Save userAnswers to a QuizMarks collection

    // Assuming you have a QuizMarks model
    const quizMarks = new QuizMarks({
      user: userId,
      marks: {
        qns1: userAnswers[0],
        qns2: userAnswers[1],
        qns3: userAnswers[2],
        qns4: userAnswers[3],
        qns5: userAnswers[4],
        qns6: userAnswers[5],
        qns7: userAnswers[6],
        qns8: userAnswers[7],
        qns9: userAnswers[8],
        qns10: userAnswers[9],
      },
    });

    await quizMarks.save();

    // Fetch quiz marks data from the database
    const data = await QuizMarks.find();

    // Redirect or render the appropriate view with quiz marks data
    res.render('amarks', { quizMarks: data }); // Pass the data as 'quizMarks' to the view
  } catch (error) {
    console.error('Error saving quiz marks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Save card state to the database
app.post('/saveCardState', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { cardId, cardState } = req.body;

    // Save the card state to your database
    // Update the logic based on your database schema and model
    // Example: Save cardState to a Cards collection

    // Assuming you have a Card model
    const card = new Card({
      user: userId,
      cardId,
      cardState,
    });

    await card.save();

    res.status(200).json({ message: 'Card state saved successfully.' });
  } catch (error) {
    console.error('Error saving card state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});



// Existing server-side code...
// Add the following code for handling quiz result
const QuizResult = mongoose.model('QuizResult', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userAnswers: [String],  // Change 'answers' to 'userAnswers'
  score: Number,
});

app.post('/saveQuizResult', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { userAnswers } = req.body;

    // Validate userAnswers format
    const validAnswers = Array.isArray(userAnswers) && userAnswers.length === 10 &&
      userAnswers.every(answer => typeof answer === 'string' || typeof answer === 'number');

    if (!validAnswers) {
      return res.status(400).json({ success: false, message: 'Invalid quiz answers provided.' });
    }

    // Example: Calculate the score (compare userAnswers with correctAnswers)
    const correctAnswers = ['b', 'c', 'c', 'b', 'b', 'd', 'd', 'd', 'b', 'a'];
    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
        score += 1;
      }
    }

    // Save the QuizResult document to the database
    const quizResult = new QuizResult({
      user: userId,
      userAnswers: userAnswers,
      score: score,
    });

    await quizResult.save();

    res.status(200).json({ success: true, message: 'Quiz result saved successfully.', score: score });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Existing server-side code...

