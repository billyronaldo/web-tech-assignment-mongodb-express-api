const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const productRoutes = require('./API Routes/Product');
const userRoutes = require('./API Routes/User');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://billyronaldo:Barcelona98@cluster0.nzsutwh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.use(productRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})