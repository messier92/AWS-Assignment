import React, {useState} from 'react';
import './Header.css'; // Import your CSS file for styling

const Header = ({signedIn, displayName}) => {

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <header className="navbar">
      <div className="left-section">
        {signedIn? <>
          <h1 className="greeting">Hello, {displayName}!</h1></> :
          <>
          <h1 className="greeting">Hello, {displayName}!</h1>
        </>}
      </div>
      <div className="right-section">
      {signedIn? <>
        <button className="sign-out-button" onClick={() => openInNewTab("https://photoappdomain.auth.ap-southeast-1.amazoncognito.com/login?client_id=5ia57cv71p7o9qklsta304metp&response_type=token&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthenticated")}>Sign Out</button> </>
        :
        <>
        <button className="sign-in-up-button" onClick={() => openInNewTab("https://photoappdomain.auth.ap-southeast-1.amazoncognito.com/login?client_id=5ia57cv71p7o9qklsta304metp&response_type=token&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthenticated")}>Sign Up/Sign In</button>
        </>}

      </div>
    </header>
  );
};

export default Header;