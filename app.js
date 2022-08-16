const http = require('http');

const express = require('express');
const { rmSync } = require('fs');

const app = express();

app.use((req, res, next)=>{
  console.log('In middleware');
  next();
});

app.use((req, res, next)=>{
  console.log('In another middleware');
  res.send('');
});

app.listen(3000);