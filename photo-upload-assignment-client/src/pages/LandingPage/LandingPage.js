import './LandingPage.css';
import axios from "axios"
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header";
import ImageGallery from "../../components/Gallery/Gallery";

export default function LandingPage() {

  const [imagesData, setImagesData] = useState([]);
  const getDynamoDBUrl = 'https://1j6fw3pn24.execute-api.ap-southeast-1.amazonaws.com/calldynamodb/';
  const queryStringParameters = {
    TableName: 'eugene-aws-temus-assignment-client-MyDynamoDBPhotosTable-1UTZYCV05H8FS'
  };
  // Create a query string from the parameters
  const queryString = Object.keys(queryStringParameters)
    .map((key) => `${key}=${encodeURIComponent(queryStringParameters[key])}`)
    .join('&');
  
  // call the API Gateway to return DynamoDB results
  const callGetDynamoDBEndpoint = async () => {
    try {
      const response = await axios.post(`${getDynamoDBUrl}?${queryString}`)
      setImagesData(response.data.Items)
      console.log('Response:', response.data)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    callGetDynamoDBEndpoint();
  }, []);
  
  return (
    <div className="Main">
      <Header signedIn={false} displayName={"Guest"}/>
        <div className="container">
          <div className="column">
            <div className="titlePanel">
              <h1>Serverless Photo Viewer</h1>
              <h3>by Goh Han Long, Eugene</h3>
            </div>
          </div> 
          <div className="column">
            <div className="public-gallery">
              {imagesData != null? <>
              <ImageGallery images={imagesData} signedIn={false} role={"Guest"}/>
              </> :
              <>
              <h3>Please sign in to view more photos</h3>
              </>}
            </div>
          </div>
          </div>
      </div>
  );
}