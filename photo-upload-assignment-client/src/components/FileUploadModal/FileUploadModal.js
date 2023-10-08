import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import "./FileUploadModal.css";
Modal.setAppElement('#root'); // Set the root element for screen readers

function FileUploadModal({ isOpen, onClose, onFileUpload }) {
  const [selectedFile, setFile] = useState(null);
  const [privacy, setPrivacy] = useState('public');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleSubmit = () => {
    // Handle the form submission here, e.g., upload the file and privacy settings
    if (onFileUpload) {
      onFileUpload(selectedFile, privacy);
      const lambdaEndpoint = 'https://m0doxwc300.execute-api.ap-southeast-1.amazonaws.com/calls3/'; 
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result.split(',')[1]; // Get the base64 data part
        // Send the base64-encoded image to your Lambda function
        const response = await axios.post(
            lambdaEndpoint,
            {
            image: base64Image,
            name: selectedFile.name,
            public: privacy
            },{
            headers: {
                'Content-Type': 'application/json',
            },
            });  
        console.log('Image upload response:', response.data);
        if (response.data) {
            window.location.reload();
        }
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="File Upload Modal"
      style={{
        content: {
          width: '400px', // Set your desired width
          height: '300px', // Set your desired height
          margin: 'auto', // Center the modal horizontally
          border: '5px solid black',
          background: '#808080',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background color
        },
      }}
    >
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />

      <div>
        <label>
          <input
            type="radio"
            value="public"
            checked={privacy === 'public'}
            onChange={handlePrivacyChange}
          />
          Public
        </label>
        <label>
          <input
            type="radio"
            value="private"
            checked={privacy === 'private'}
            onChange={handlePrivacyChange}
          />
          Private
        </label>
      </div>
      <button onClick={handleSubmit}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
}

export default FileUploadModal;