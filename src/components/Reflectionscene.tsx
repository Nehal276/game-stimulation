import React, { useState, useEffect } from 'react';
import '../Scene.css';
import '../Reflectionscene.css';
import { content } from '../components/content';

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
    const positiveContent = content.reflectionscene.positive;
    return (
      <div className="reflection-container">
        <div className={`reflection-content ${showContent ? 'visible' : ''}`}>
          {/* Postive Response - Scene 1 */}
          {positiveStep === 1 && (
            <div className="reveal-step fade-in">
              <h1 className="reflection-title">{positiveContent.step1Title}</h1>
              <p>
                {positiveContent.step1Body}
              </p>
              <div className="metric-card standout">
                <h3>{positiveContent.step1CardTitle}</h3>
                <p>"{metrics.finalResponse}"</p>
              </div>
              <button onClick={() => setPositiveStep(2)} className="reveal-button">
               {positiveContent.step1Button}
              </button>
            </div>
          )}

          {/* Positive Response - Scene 2 */}
          {positiveStep === 2 && (
            <div className="reveal-step fade-in">
              <h1 className="reflection-title">{positiveContent.step2Title}</h1>
              <p>
                {positiveContent.step2Body}
              </p>
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                 {positiveContent.step2Quote}
                </h3>
                <button onClick={onRestart} className="reveal-button">
                 {content.reflectionscene.restartButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Negative Path (User followed AI suggestions)
  const negativeContent = content.reflectionscene.negative;
  return (
    <div className="reflection-container">
      <div className={`reflection-content ${showContent ? 'visible' : ''}`}>
        {revealStep === 1 && (
          <div className="reveal-step fade-in">
            <h1 className="reflection-title">{negativeContent.step1Title}</h1>
            <div className="metric-card standout">
              <h3>{negativeContent.step1CardTitle}</h3>
              <p>"{metrics.finalResponse}"</p>
            </div>
            <p>
             {negativeContent.step1Body}
            </p>
            <button onClick={() => setRevealStep(2)} className="reveal-button">{negativeContent.step1Button}</button>
          </div>
        )}

        {revealStep === 2 && (
          <div className="reveal-step fade-in">
            <h1 className="reflection-title shock">{negativeContent.step2Title}</h1>
            <p style={{ fontStyle: 'italic', marginBottom: '3rem' }}>
              {negativeContent.step2Body}
            </p>

            {/* Questions about trust and effort */}
            <div>
              <h3>{negativeContent.trustTitle}</h3>
              <p>{negativeContent.trustBody}</p>
              <br />
              <div>
                <h5>{negativeContent.originalThoughtLabel}</h5>
                <p>"{metrics.originalDraft}"</p>
                <h6>{negativeContent.originalThoughtMeaning}</h6>
              </div>
              <br />
              <div>
                <h5>{negativeContent.systemResponseLabel}</h5>
                <p>"{metrics.finalResponse}"</p>
                <h6>{negativeContent.systemResponseMeaning}</h6>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>{negativeContent.effortTitle}</h3>
              <p>{negativeContent.effortBody(metrics.builderUses)}</p>
            </div>

            {/* Thought Provocking Question */}
            <div style={{ marginTop: '4rem' }}>
              <h3 className="shock-text" style={{ fontSize: '1.5rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                {negativeContent.finalQuote}
              </h3>
              <button onClick={onRestart} className="reveal-button">
               {content.reflectionscene.restartButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionScene;