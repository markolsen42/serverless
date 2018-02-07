import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import serverless = require('serverless-http');
import express = require('express')
import AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

AWS.config.update({region: "us-east-1"});
const dynamoDb: DocumentClient = new AWS.DynamoDB.DocumentClient();

const app = express();

app.get('/hello', (req, res)=>{ 
  res.send("hello typescript world");
})

app.get('/goodbye', (req, res)=>{
  res.send("goodbye typescript world");
})

app.get("/write", (req, res) => {
  console.log(JSON.stringify(process.env))
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
   // TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: "123"+Math.random(),
      text: "4 score ...",
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  dynamoDb.put(params, (error) => {
    if (error){
    console.log(error);
  } else {
    console.log(JSON.stringify(params));
    res.send(JSON.stringify(params))
  }
  })
  
})

export const api: Handler = serverless(app);
