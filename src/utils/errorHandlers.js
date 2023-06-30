const handleErrors = (error, req, res, next) => {
    // Error handling logic
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  };
  
  module.exports = handleErrors;
  