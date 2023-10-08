import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from "axios"

const ImageGallery = ({ images, signedIn, role }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPublicity, setNewPublicity] = useState('');

  const getDynamoDBUrl = 'https://1j6fw3pn24.execute-api.ap-southeast-1.amazonaws.com/calldynamodb/';

  
  const openModal = (image) => {
    setSelectedImage(image);
    setNewPublicity(image.Public); // Initialize with the current publicity
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalIsOpen(false);
  };

  const handlePublicityChange = (event) => {
    setNewPublicity(event.target.value);
  };

  const updatePublicity = () => {
    // Implement logic to update the publicity here
    console.log(`Updating image "${selectedImage.ImageName}" to "${newPublicity}"`);
    const queryStringParameters = {
      TableName: 'eugene-aws-temus-assignment-client-MyDynamoDBPhotosTable-1UTZYCV05H8FS',
      EditPhotoVisibility: JSON.stringify({ ImageName: selectedImage.ImageName, Public: newPublicity })
    };

    const queryString = Object.keys(queryStringParameters)
    .map((key) => `${key}=${encodeURIComponent(queryStringParameters[key])}`)
    .join('&');
  
    // call the API Gateway to return DynamoDB results
    const callGetDynamoDBEndpoint = async () => {
      try {
      const response = await axios.post(`${getDynamoDBUrl}?${queryString}`)
      if (response.data) {
        window.location.reload();
    }
      console.log('Response:', response.data)
      } catch (error) {
        console.error('Error:', error);
      }
    };
    callGetDynamoDBEndpoint();
    closeModal();

  };

  return (
    <div>
      <h1>Gallery</h1>
      <div className="image-list">
        {signedIn === false ? (
          // If not signed in, only display public images
          <>
            {images.map((image, index) => (
              <div key={index} className="image-card" onClick={() => openModal(image)}>
                {image.Public === 'public' ? (
                  <>
                    <div className="image-info">
                      <img src={image.ImageURL} alt={image.ImageName} />
                      <p className="image-name">{image.ImageName} ({image.Public})</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </>
        ) : (
          // If signed in, display all images
          <>
            {images.map((image, index) => (
              <div key={index} className="image-card" onClick={() => openModal(image)}>
                <div className="image-info">
                  <img src={image.ImageURL} alt={image.ImageName} />
                  <p className="image-name">{image.ImageName} ({image.Public})</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Details Modal"
      >
        <h2>Image Details</h2>
        {selectedImage && (
          <>
            <p>Name: {selectedImage.ImageName}</p>
            <p>Publicity: {selectedImage.Public}</p>
            {role == "admins"? <>
            <label>
              Change Publicity:
              <span>  </span>
              <select value={newPublicity} onChange={handlePublicityChange}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </label>
            <span>  </span>
            <button onClick={updatePublicity}>Update Publicity</button>
            </>:<></>}
          </>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ImageGallery;