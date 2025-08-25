import React from 'react';
import '../landingscreen.css';
import hellosaysfinal from '../assets/hello.gif';
import { content } from '../components/content';

type Props = {
  onNext: () => void;
};

const LandingScreen: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="landing-container">
      {/* Background blur elements are added to make the background look soft*/}
      <div className="softbackground bg-blur-1"></div>
      <div className="softbackground bg-blur-2"></div>

      {/* Frame set-up for the character saying hello */}
      <div className="character-container">
        <div className="character-frame">
          <div className="character-gif-wrapper">
            <img
              src={hellosaysfinal}
              alt="Character greeting"
              className="hellosays-gif"
            />
          </div>
        </div>
      </div>

      {/* Greeting text */}
      <div className="content-section">
        <h1 className="main-title"> {content.landingscreen.title}</h1>
        <p className="subtitle">{content.landingscreen.subtitle}</p>
        {/*Start button section */}
        <button className="start-button" onClick={onNext}>
          <span>{content.landingscreen.button}</span>
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;