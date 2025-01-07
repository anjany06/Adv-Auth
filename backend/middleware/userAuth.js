import jwt from "jsonwebtoken";
import winston from "winston"; // Import winston for logging

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const userAuth = async (req, res, next) => {
  const { token } = req.cookies; // Only declare token once
  logger.info(`Received token: ${token}`); // Log the received token

  if (!token) {
    return res.status(401).json({ msg: "Not Authorised Login again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Token decoded: ${JSON.stringify(tokenDecode)}`); // Log the decoded token
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({ message: "Not Authorised Login again" });
    }

    next();
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`); // Log any verification errors
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
