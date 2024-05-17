const mongoose = require('mongoose')


mongoose.connect(
  process.env.MONGO_URI,
  {
  }
)
  .then(() => console.log('connected to MongoDB successfully'))
  .catch(error => console.log('MongoDB connection error: ', error))

module.exports = mongoose