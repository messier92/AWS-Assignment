import './HomePage.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header"
import ImageGallery from "../../components/Gallery/Gallery";
import FileUploadModal from '../../components/FileUploadModal/FileUploadModal';
import jwt_decode from 'jwt-decode';
import { CognitoJwtVerifier } from "aws-jwt-verify";

export default function HomePage() {

  const [displayName, setDisplayedName] = useState(true);
  const [role, setRole] = useState('');
  const [imagesData, setImagesData] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  function extractTokensFromURL(url) {
    const tokens = {};
    const parts = url.split('home/');
    if (parts.length > 1) {
      const queryString = parts[1];
      const queryParams = queryString.split('&');
      for (const param of queryParams) {
        const [key, value] = param.split('=');
        tokens[key] = value;
      }
    }
    return tokens;
  }
  
  useEffect(() => {
    const currentURL = window.location.href;
    const urlParams = extractTokensFromURL(currentURL);
    const accessToken = urlParams['access_token'];

    // check if jwt token is valid 
    const verifier = CognitoJwtVerifier.create({
      userPoolId: "ap-southeast-1_Zn7vqPHjf",
      tokenUse: "access",
      clientId: "5ia57cv71p7o9qklsta304metp",
    });
    
    try {
      const payload = verifier.verify(accessToken);
      console.log("Token is valid. Payload:", payload);
      callGetDynamoDBEndpoint();
      var decodedaccessToken = jwt_decode(accessToken);
      setDisplayedName(decodedaccessToken.username)
      setRole(decodedaccessToken["cognito:groups"][0]);
    } catch {
      alert("Token is not valid! Please sign in again.")
      // redirect to home
    }
  }, []); 

  const handleUpload = async () => {    
    closeModal()
  };

  return (
    <div className="Main">
    <Header signedIn={true} displayName={displayName}/>
      <div className="container">
        <div className="column">
          <div className="titlePanel">
            <h1>Serverless Photo Viewer</h1>
            <h3>by Goh Han Long, Eugene</h3>
          </div>
        </div> 
        <div className="column">
          <div className="file-upload">
          {role == "admins"? 
            <><div>
            <button onClick={openModal}>Upload a Photo</button>
            <FileUploadModal isOpen={isModalOpen} onClose={closeModal} onFileUpload={handleUpload}/>
            </div></>
            :
            <></>}
          </div>
        </div>
        <div className="column">
          <div className="public-gallery">
          {imagesData != null? <>
              <ImageGallery images={imagesData} signedIn={true} role={role}/>
              </> :
              <>
              <h3>There are no photos in this gallery</h3>
              </>}
          </div>
        </div>
        </div>
    </div>
  );
}