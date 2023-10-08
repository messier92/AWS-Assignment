import React, { useEffect } from 'react';

// TODO: 

export default function AuthenticatedPage() {
  useEffect(() => {
    const currentURL = window.location.href;
    var newURL = "";
    // Split the URL by the '#' character
    const parts = currentURL.split('#');
    if (parts.length === 2) {
      newURL = parts[1]; // Get the part after the '#'
    } else {
    }
    
    const redirectTimer = setTimeout(() => {
      window.location.href = 'http://webpagefortemusassignmenteugene.s3-website-ap-southeast-1.amazonaws.com/home/' + newURL;
    }, 2000);

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div>
      <h1>Authenticating...</h1>
    </div>
  );
}