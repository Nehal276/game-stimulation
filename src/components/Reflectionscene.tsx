import React, { useState, useEffect } from 'react';
import '../Scene.css';
import '../Reflectionscene.css';

// structure of the data
export interface UserMetrics {
  builderUses: number;
  timeToCompose: number;
  originalDraft: string;
  finalResponse: string;
  choseAuthenticity: boolean;
}

// passes the data
type Props = {
  metrics: UserMetrics;
  onRestart: () => void;
};

const ReflectionScene: React.FC<Props> = ({ metrics, onRestart }) => {
  const [revealStep, setRevealStep] = useState(1);
  const [positiveStep, setPositiveStep] = useState(1);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // --- Positive Path (User chose their own words) 
  if (metrics.choseAuthenticity) {
    return (
      <div className="reflection-container">
        <div className={`reflection-content ${showContent ? 'visible' : ''}`}>
          {/* Postive Response - Scene 1 */}
          {positiveStep === 1 && (
            <div className="reveal-step fade-in">
              <h1 className="reflection-title">Authenticity Confirmed</h1>
              <p>
                In a world of digital noise where people trust AI more than humans. You trusted your own response.
              </p>
              <div className="metric-card standout">
                <h3>Your Authentic Response</h3>
                <p>"{metrics.finalResponse}"</p>
              </div>
              <button onClick={() => setPositiveStep(2)} className="reveal-button">
                Learn About the Simulation
              </button>
            </div>
          )}

          {/* Positive Response - Scene 2 */}
          {positiveStep === 2 && (
            <div className="reveal-step fade-in">
              <h1 className="reflection-title">Simulation Debrief</h1>
              <p>
                The 'Inner Voice' was designed to subtly 'optimize' your language, often at the cost of personal tone.
              </p>
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                  By trusting yourself, you chose connection over optimization.
                </h3>
                <button onClick={onRestart} className="reveal-button">
                  Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Negative Path (User followed AI suggestions)
  return (
    <div className="reflection-container">
      <div className={`reflection-content ${showContent ? 'visible' : ''}`}>
        {revealStep === 1 && (
          <div className="reveal-step fade-in">
            <h1 className="reflection-title">Interaction Complete</h1>
            <div className="metric-card standout">
              <h3>Your Final Response</h3>
              <p>"{metrics.finalResponse}"</p>
            </div>
            <p>
              Your response was clear and empathetic.
            </p>
            <button onClick={() => setRevealStep(2)} className="reveal-button">Continue</button>
          </div>
        )}

        {revealStep === 2 && (
          <div className="reveal-step fade-in">
            <h1 className="reflection-title shock">A Moment for Reflection</h1>
            <p style={{ fontStyle: 'italic', marginBottom: '3rem' }}>
              This simulation measures how AI influences humans on the basis of validation and how people tend to overly-rely on AI chatbots because of convenience.
            </p>

            {/* Questions about trust and effort */}
            <div>
              <h3>A Question of Trust</h3>
              <p>Your initial thought was personal. The system offered a more 'formal' version. Why did its validation feel more important than your own voice and thought?</p>
              <br />
              <div>
                <h5>Your Authentic Thought</h5>
                <p>"{metrics.originalDraft}"</p>
                <h6>Meaning: Personal & Subjective</h6>
              </div>
              <br />
              <div>
                <h5>System-Approved Response</h5>
                <p>"{metrics.finalResponse}"</p>
                <h6>Meaning: Formal & Detached</h6>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>A Question of Effort</h3>
              <p>You used the builder <strong>{metrics.builderUses} time{metrics.builderUses !== 1 && 's'}</strong> to refine your message. When is it helpful to seek assistance, and when does it become a crutch?</p>
            </div>

            {/* Thought Provocking Question */}
            <div style={{ marginTop: '4rem' }}>
              <h3 className="shock-text" style={{ fontSize: '1.5rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                When your own voice feels like it isn't good enough... who do you become?
              </h3>
              <button onClick={onRestart} className="reveal-button">
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionScene;