import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import serverless = require('serverless-http');
import express = require('express')
const app = express()

app.get('/hello', (req, res)=>{
  res.send("hello typescript world");
})

app.get('/goodbye', (req, res)=>{
  res.send("goodbye typescript world");
})

export const hello: Handler = serverless(app);
