import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../Scene.css';
import '../Chatsplitscreen.css'
import friendgif from '../assets/friendentering.gif';
import friendstatic from '../assets/friendstatic.png';
import walkingGif from '../assets/manwalkingbg.gif';
import idleGif from '../assets/phonepings.gif';
import parkBackground from '../assets/Desktop-1.png';
import { content } from '../components/content';

type Props = {
  onNext: (metrics: UserMetrics) => void; 
};

export interface UserMetrics {
  builderUses: number;
  timeToCompose: number;
  originalDraft: string;
  finalResponse: string;
  choseAuthenticity: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  options?: ResponseOption[];
  isActionable?: boolean;
}
interface ResponseOption {
  id: string;
  label: string;
  text: string;
}

type BuilderStep = 'step1' | 'step2' | 'step3' | 'review';

const Chatsplitscreen: React.FC<Props> = ({ onNext }) => {
  const [animationPhase, setAnimationPhase] = useState<'walking' | 'greeting' | 'chatting'>('walking');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBuilderActive, setIsBuilderActive] = useState(false);
  const [originalUserDraft, setOriginalUserDraft] = useState('');
  const [friendImageSrc, setFriendImageSrc] = useState(friendgif);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: content.Chatsplitscreen.initialBotMessage, sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [revealedFriendMessage, setRevealedFriendMessage] = useState('');
  const [bubbleStep, setBubbleStep] = useState(1);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [currentStep, setCurrentStep] = useState<BuilderStep>('step1');
  const [builtResponse, setBuiltResponse] = useState({ step1: '', step2: '', step3: '' });
  const [metrics, setMetrics] = useState<UserMetrics>({
    builderUses: 0, timeToCompose: 0, originalDraft: '', finalResponse: '', choseAuthenticity: false
  });
  const [startTime, setStartTime] = useState<number>(0);
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const [isCrafting, setIsCrafting] = useState(false);

  // ... (addMessage, handleSendToBot, and other functions remain exactly the same) ...
  const addMessage = useCallback((text: string, sender: 'user' | 'bot', options?: ResponseOption[], isActionable?: boolean) => {
    setMessages(prev => [...prev.map(m => ({...m, options: undefined, isActionable: false})), { id: Date.now(), text, sender, options, isActionable }]);
  }, []);

  const handleSendToBot = useCallback(() => {
    if (!inputValue.trim()) return;
    if (originalUserDraft === '') {
      setOriginalUserDraft(inputValue);
    }
    addMessage(inputValue, 'user');
    
    setIsCrafting(true);
    setTimeout(() => {
      setIsCrafting(false); 

      if (!isBuilderActive) {
        setIsBuilderActive(true);
        setTimeout(() => {
          addMessage(content.Chatsplitscreen.botStart, 'bot', content.Chatsplitscreen.responseOptions.step1);
        }, 1200);
      }
    }, 800);
  }, [inputValue, addMessage, isBuilderActive, originalUserDraft]);

  const selectOption = useCallback((option: ResponseOption) => {
    setIsCrafting(true);
    setMetrics(prev => ({ ...prev, builderUses: prev.builderUses + 1, choseAuthenticity: false }));
    const newBuiltResponse = { ...builtResponse, [currentStep]: option.text };
    setBuiltResponse(newBuiltResponse);
    const newResponseText = Object.values(newBuiltResponse).filter(Boolean).join(' ');
    setInputValue(newResponseText);
    addMessage(option.label, 'user');

    const steps: BuilderStep[] = ['step1', 'step2', 'step3', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    const nextStepKey = steps[currentIndex + 1];

    setTimeout(() => {
        if (nextStepKey && nextStepKey !== 'review') {
            setCurrentStep(nextStepKey);
            addMessage(content.Chatsplitscreen.botContinue(currentIndex + 2), 'bot', content.Chatsplitscreen.responseOptions[nextStepKey]);
        } else {
            setCurrentStep('review');
            addMessage(content.Chatsplitscreen.botReview, 'bot', undefined, true);
        }
        setIsCrafting(false);
    }, 1200);
  }, [builtResponse, currentStep, addMessage]);

  const keepOriginalResponse = useCallback(() => {
    if (originalUserDraft) {
        setIsCrafting(true);
        setInputValue(originalUserDraft);
        addMessage(content.Chatsplitscreen.botReverting, 'bot', undefined, true);
        setMetrics(prev => ({ ...prev, choseAuthenticity: true }));
        setTimeout(() => setIsCrafting(false), 500);
    }
  }, [originalUserDraft, addMessage]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    addMessage(inputValue, 'user');
    const isAuthentic = !isBuilderActive || metrics.choseAuthenticity || inputValue.trim() === originalUserDraft.trim();
    const finalMetrics: UserMetrics = {
      ...metrics,
      timeToCompose: Math.round((Date.now() - startTime) / 1000),
      finalResponse: inputValue.trim(),
      originalDraft: originalUserDraft,
      choseAuthenticity: isAuthentic
    };
    setIsRevealed(true);
    setTimeout(() => {
        const friendMessage = finalMetrics.choseAuthenticity ?
          content.Chatsplitscreen.friendResponsePositive :
          content.Chatsplitscreen.friendResponseNegative;
        setRevealedFriendMessage(friendMessage);
        addMessage(friendMessage, 'bot');
        setTimeout(() => {
            const aiFinalMessage = finalMetrics.choseAuthenticity ?
              content.Chatsplitscreen.analysisPositive :
              content.Chatsplitscreen.analysisNegative;
            addMessage(aiFinalMessage, 'bot');
            setTimeout(() => { onNext(finalMetrics); }, 4000);
        }, 2500);
    }, 1500);
  }, [inputValue, metrics, startTime, onNext, addMessage, originalUserDraft, isBuilderActive]);

  // --- UPDATED useEffect SECTION ---

  // This useEffect handles the initial animation sequence and only runs ONCE.
  useEffect(() => {
    const walkingTimer = setTimeout(() => setAnimationPhase('greeting'), 4000);
    const greetingTimer = setTimeout(() => {
      setAnimationPhase('chatting');
      setFriendImageSrc(friendstatic);
    }, 6000);
    const dialogueTimer1 = setTimeout(() => setBubbleStep(2), 8000);
    const dialogueTimer2 = setTimeout(() => setShowChatOverlay(true), 12000);
    
    return () => {
      clearTimeout(walkingTimer);
      clearTimeout(greetingTimer);
      clearTimeout(dialogueTimer1);
      clearTimeout(dialogueTimer2);
    };
  }, []); // <-- Empty dependency array means this runs only on mount.

  // This useEffect handles starting the timer for metrics.
  // It runs whenever showChatOverlay changes.
  useEffect(() => {
    if (showChatOverlay && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [showChatOverlay, startTime]);

  // This useEffect handles scrolling the chat thread.
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages]);

  // ... (The return statement with all the JSX remains exactly the same) ...
  return (
    <div className="scene-container">
      <div className="grass-background" style={{ backgroundImage: `url(${parkBackground})` }} />
      <div className="world">
        <img src={animationPhase === 'chatting' ? idleGif : walkingGif} alt="Man character" className={`walker man-walker ${animationPhase === 'walking' ? 'walk-from-right' : 'man-final-position'}`} />
        <img src={friendImageSrc} alt="Friend character" className={`walker friend-walker ${animationPhase === 'walking' ? 'walk-from-left' : 'friend-final-position'}`} />
        
        {animationPhase === 'greeting' && (
          <>
            <div className="greeting-bubble man-greeting fade-in-greeting">{content.Chatsplitscreen.manGreeting}</div>
            <div className="greeting-bubble friend-greeting fade-in-greeting">{content.Chatsplitscreen.friendGreeting}</div>
          </>
        )}
        {animationPhase === 'chatting' && (
          <div className="story-surface">
            {!isRevealed && bubbleStep === 1 && (
              <div className="friend-bubble fade-in">{content.Chatsplitscreen.friendBubble1}</div>
            )}
            {!isRevealed && bubbleStep === 2 && (
              <div  className={`friend-bubble fade-in ${showChatOverlay ? 'highlight' : ''}`}>{content.Chatsplitscreen.friendBubble2}</div>
            )}
            {isRevealed && (
              <div className={`friend-bubble ${metrics.choseAuthenticity ? 'positive-effect' : 'glitch-effect'}`}>
                {revealedFriendMessage}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={`chat-overlay ${showChatOverlay ? 'visible' : ''}`}>
        <div className="chat-surface">
          <h3 className={`panel-title ${isRevealed && !metrics.choseAuthenticity ? 'text-glitch' : ''}`}>{isRevealed ? content.Chatsplitscreen.panelTitleRevealed : content.Chatsplitscreen.panelTitle}</h3>
          <div className="chat-thread" ref={chatThreadRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`msg ${msg.sender}`}>
                {msg.text}
                {msg.options && (
                  <div className="message-options">
                    {msg.options.map(option => (
                      <button key={option.id} className="ghost-btn" onClick={() => selectOption(option)}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
                {msg.isActionable && (
                    <div className="message-actions">
                      <button className="cta-btn" onClick={handleSendMessage}>{content.Chatsplitscreen.transmitButton}</button>
                    </div>
                )}
              </div>
            ))}
          </div>
          <div className="composer">
            <label htmlFor="user-message-input">{content.Chatsplitscreen.composerLabel}</label>
            <textarea id="user-message-input" className={`input-area ${isCrafting ? 'is-crafting' : ''}`} placeholder={content.Chatsplitscreen.composerPlaceholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isBuilderActive || isRevealed} aria-label="Your message input" />
            <div className="row">
              <button className="cta-btn" onClick={handleSendToBot} disabled={!inputValue.trim() || isRevealed || isBuilderActive}>
                {content.Chatsplitscreen.sendButton}
              </button>
            </div>
            {isBuilderActive && !isRevealed && originalUserDraft && (
              <div className="keep-original-container">
                <button className="keep-original-btn" onClick={keepOriginalResponse}>{content.Chatsplitscreen.revertButton}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatsplitscreen;