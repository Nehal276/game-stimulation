import React, { useEffect, useState } from 'react';
import '../Scene.css';
import '../Grassscene.css'
import walkingGif from '../assets/manwalkingbg.gif';
import idleGif from '../assets/phonepings.gif';
import { content } from '../components/content'

// controls the props which were directed to this file
type Props = {
  onNext: () => void;
};

const GrassScene: React.FC<Props> = ({ onNext }) => {
  // Helps on moving the gif front and back
  const [walkPhase, setWalkPhase] = useState<'forward' | 'backward' | 'done'>('forward');
  // Makes the message bubble visible
  const [showMessage, setShowMessage] = useState(false);

  // After the character finishes the walking animation, this helps in making the messages visible
  useEffect(() => {
    if (walkPhase === 'done') {
      const t2 = setTimeout(() => setShowMessage(true), 2000);
      return () => {
        clearTimeout(t2);
      };
    }
  }, [walkPhase]);
// Helps in the forward backward moment
  const handleWalkAnimationEnd = () => {
    if (walkPhase === 'forward') {
      setWalkPhase('backward');
    } else if (walkPhase === 'backward') {
      setWalkPhase('done');
    }
  };

  return (
    <div className="scene-container">
      <div className="grass-background" />

      {/* Adds dark vignette effect at the start of the scene for story effect */}
      <div className="vignette-overlay" aria-hidden />
      <div className="bloom-overlay" aria-hidden />
      <div className="grain-overlay" aria-hidden />

      {/* background Grass Scene */}
      <div className="world">
        {/* Character gif */}
        <img
          src={walkPhase === 'done' ? idleGif : walkingGif}
          alt="Illustrated person"
          className={`walker ${
            walkPhase === 'forward'
              ? 'walk-forward'
              : walkPhase === 'backward'
              ? 'walk-backward'
              : 'walk-finished zoom-effect'
          }`}
          onAnimationEnd={handleWalkAnimationEnd}
          style={{
            opacity: walkPhase === 'done' ? 0.95 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Message pop-up on the right*/}
        <div className="message-popup">

          {showMessage && (
            <div className="letsgo-message fade-in">
              <h4>
               {content.grassscene.messageTitle}
              </h4>
              <br></br>
              <h5>{content.grassscene.messageSubtitle}</h5>
              <button onClick={onNext}>{content.grassscene.button}</button>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default GrassScene;