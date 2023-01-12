import jwt from 'jsonwebtoken';
import config from 'config';

//passport authentication
export default function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token!, authorizaion denied' });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    // req.admin= decoded;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}