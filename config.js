 
 // Database connection URL
 exports.databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/archioweb';

 // Database port
 exports.port = process.env.PORT || '3000';

 exports.nodeEnv = process.env.NODE_ENV || 'test';

 // bcrypt Cost Factor number
 exports.bcryptCostFactor = 10;

 // JWT signing key
 exports.secretKey = process.env.SECRET_KEY ||'MikkelBoss';

 // Validate port is positive integer
 if (process.env.PORT) {
     const parsedPort = parseInt(process.env.PORT, 10);
     if (!Number.isInteger(parsedPort)) {
         throw new Error('Environment variable $PORT must be an integer')
     } else if (parsedPort < 1 || parsedPort > 655535) {
         throw new Error('Environment variable $PORT must be a valid port number')
     }
 }

