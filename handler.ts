import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import serverless = require('serverless-http');
import express = require('express')
import util = require('util');
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

app.get("/write/:id/:text", (req, res) => {
  console.log(req.params.id);
  console.log(req.params.text);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
   // TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: req.params.id,
      text: req.params.text,
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

app.get("/read/:id", (req, res) => {
  console.log(req.params.id);
  let id = ""+req.params.id;
  const params = {
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
        ":id": id,
    },
    KeyConditionExpression: "#id = :id",
    TableName : process.env.DYNAMODB_TABLE
};
  dynamoDb.query(params, (err, data) => {
    if (err) console.log(err);
    else res.send(data);
  });
})

export const api: Handler = serverless(app);
