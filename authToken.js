const jwt = require('jsonwebtoken');
const User = require('./Models/User');

const authToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
        console.log('error ga ada token')
      return res.status(401).json({ message: 'Unauthorized: Token is required' });
    }
  
    try {
      // Verify the token using the same secret key ('your_secret_key')
      console.log(token, 'cek token')
      const decodedToken = jwt.verify(token, 'your_secret_key');
      console.log('Decoded Token:', decodedToken);
      const userId = decodedToken.userId;
  
      // Attach userId to request for further processing
      req.userId = userId;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };

module.exports = authToken;
