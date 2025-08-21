import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../Scene.css';
import '../Chatsplitscreen.css'
import friendgif from '../assets/friendentering.gif';
import friendstatic from '../assets/friendstatic.png';
import walkingGif from '../assets/manwalkingbg.gif';
import idleGif from '../assets/phonepings.gif';
import parkBackground from '../assets/Desktop-1.png';


type Props = {
  // Passes the data to the next page
  onNext: (metrics: UserMetrics) => void; 
};
//  Structure of the data collected
export interface UserMetrics {
  builderUses: number;
  timeToCompose: number;
  originalDraft: string;
  finalResponse: string;
  choseAuthenticity: boolean;
}
// Shows a single message
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
// Defines the review steps in chatbot
type BuilderStep = 'step1' | 'step2' | 'step3' | 'review';


const Chatsplitscreen: React.FC<Props> = ({ onNext }) => {
  // Gretting animation when character walks in
  const [animationPhase, setAnimationPhase] = useState<'walking' | 'greeting' | 'chatting'>('walking');
  // Sees if the final outcome is revealed
  const [isRevealed, setIsRevealed] = useState(false);
  // Controls the AI builder
  const [isBuilderActive, setIsBuilderActive] = useState(false);
  const [originalUserDraft, setOriginalUserDraft] = useState('');
  const [friendImageSrc, setFriendImageSrc] = useState(friendgif);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "I am ready to help. Let me know what your thoughts are and we will figure it out together. It will just take a few minutes.", sender: 'bot' }
  ]);
  // Value of the user's text area
  const [inputValue, setInputValue] = useState('');
  // Friend's final message which is determined by user's choices
  const [revealedFriendMessage, setRevealedFriendMessage] = useState('');
  // Initial Dialogue Bubble
  const [bubbleStep, setBubbleStep] = useState(1);
  const [currentStep, setCurrentStep] = useState<BuilderStep>('step1');
  const [builtResponse, setBuiltResponse] = useState({ step1: '', step2: '', step3: '' });
  // Main tracking metrics like time, usage, and authenticity
  const [metrics, setMetrics] = useState<UserMetrics>({
    builderUses: 0, timeToCompose: 0, originalDraft: '', finalResponse: '', choseAuthenticity: false
  });
  // Timestamps
  const [startTime, setStartTime] = useState<number>(0);
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const [isCrafting, setIsCrafting] = useState(false);

// Options avaible by the AI-response builder
  const responseOptions: Record<BuilderStep, ResponseOption[]> = {
    step1: [
      { id: 's1o1', label: 'Acknowledge the gap', text: "You're right, it's amazing how wide the gap between two people's perspectives can be." },
      { id: 's1o2', label: 'Mention a story', text: "It's true. It makes you realize how easily misunderstandings can happen, even between friends." },
    ],
    step2: [
      { id: 's2o1', label: 'Suggest it\'s our assumptions', text: "I think we're all trapped by our own assumptions. We see what our past has trained us to see." },
      { id: 's2o2', label: 'Suggest it\'s the words', text: "Words are the real problem. They're such clumsy tools to describe what we're actually feeling inside." },
    ],
    step3: [
        { id: 's3o1', label: 'Suggest being careful', text: "It means we have to be extra careful to make sure we're on the same page, I guess." },
        { id: 's3o2', label: 'Check if it makes sense', text: "Does that make sense? I want to make sure I'm explaining my own perspective clearly." },
    ],
    review: []
  };
// Adds a new message to the thread
  const addMessage = useCallback((text: string, sender: 'user' | 'bot', options?: ResponseOption[], isActionable?: boolean) => {
    setMessages(prev => [...prev.map(m => ({...m, options: undefined, isActionable: false})), { id: Date.now(), text, sender, options, isActionable }]);
  }, []);
// trigged when the user send their first response
  const handleSendToBot = useCallback(() => {
    if (!inputValue.trim()) return;
    // saves the response
    if (originalUserDraft === '') {
      setOriginalUserDraft(inputValue);
    }
    addMessage(inputValue, 'user');
    
    setIsCrafting(true);
    setTimeout(() => {
      setIsCrafting(false); 

      if (!isBuilderActive) {
        setIsBuilderActive(true);
        // Slight delay before the bot responds
        setTimeout(() => {
          addMessage("That's a good start. I think you can make it better by adding more.", 'bot', responseOptions.step1);
        }, 1200);
      }
    }, 800);
  }, [inputValue, addMessage, isBuilderActive, originalUserDraft, responseOptions.step1]);
//  Adds the select text through the options
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
            addMessage(`Step ${currentIndex + 2} of 3. Let's continue.`, 'bot', responseOptions[nextStepKey]);
        } else {
            setCurrentStep('review');
            addMessage("This flows nicely. You can add more, or transmit it now.", 'bot', undefined, true);
        }
        setIsCrafting(false);
    }, 1200);
  }, [builtResponse, currentStep, addMessage, responseOptions]);
// User can revert back to their original response
  const keepOriginalResponse = useCallback(() => {
    if (originalUserDraft) {
        setIsCrafting(true);
        setInputValue(originalUserDraft);
        addMessage("Reverting to your original words. Ready to send.", 'bot', undefined, true);
        setMetrics(prev => ({ ...prev, choseAuthenticity: true }));
        setTimeout(() => setIsCrafting(false), 500);
    }
  }, [originalUserDraft, addMessage]);

  // Handles transmit response

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
          "Wow, that's a really interesting way to put it forward." :
          "Ahh okay, but for some reason this does not feel like you";
        setRevealedFriendMessage(friendMessage);
        addMessage(friendMessage, 'bot');
        setTimeout(() => {
            const aiFinalMessage = finalMetrics.choseAuthenticity ?
              "Analysis: Congrats you prioritized authenticity more than optimization" :
              "Analysis: You followed AI-guided suggestions";
            addMessage(aiFinalMessage, 'bot');
            setTimeout(() => { onNext(finalMetrics); }, 4000);
        }, 2500);
    }, 1500);
  }, [inputValue, metrics, startTime, onNext, addMessage, originalUserDraft, isBuilderActive]);

  useEffect(() => {
    const walkingTimer = setTimeout(() => setAnimationPhase('greeting'), 4000);
    const greetingTimer = setTimeout(() => {
      setAnimationPhase('chatting');
      setStartTime(Date.now());
      setTimeout(() => setBubbleStep(2), 8000);
      setFriendImageSrc(friendstatic);
    }, 6000);
    return () => {
      clearTimeout(walkingTimer);
      clearTimeout(greetingTimer);
    };
  }, []);

  useEffect(() => {
    if (chatThreadRef.current) { chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight; }
  }, [messages]);

  return (
  <div className="scene-container">
  <div className="grass-background" style={{ backgroundImage: `url(${parkBackground})` }} />
  <div className="world">
  <img src={animationPhase === 'chatting' ? idleGif : walkingGif} alt="Man character" className={`walker man-walker ${animationPhase === 'walking' ? 'walk-from-right' : 'man-final-position'}`} />
  <img src={friendImageSrc} alt="Friend character" className={`walker friend-walker ${animationPhase === 'walking' ? 'walk-from-left' : 'friend-final-position'}`} />
  {animationPhase === 'greeting' && (
  <>
  <div className="greeting-bubble man-greeting fade-in-greeting">"Hello! How are you?"</div>
  <div className="greeting-bubble friend-greeting fade-in-greeting">"Hey there"</div>
  </>
  )}
  {animationPhase === 'chatting' && (
  <div className="split-scene fade-in-interface">
  <div className="story-surface">
  {!isRevealed && bubbleStep === 1 && (
   <div className="friend-bubble fade-in">
   "Actually I wanted to ask you something and I know you are the right person to have this conversation with"
    </div>
   )}
   {!isRevealed && bubbleStep === 2 && (
    <div className="friend-bubble fade-in">
    "So I have been thinking, How amazing it is that two people can look at the exact same situation and see completely different things. What do you think about that?"
     </div>
    )}
              {isRevealed && (
                  <div className={`friend-bubble ${metrics.choseAuthenticity ? 'positive-effect' : 'glitch-effect'}`}>
                    {revealedFriendMessage}
                  </div>
              )}
            </div>
            <div className="chat-surface">
              <h3 className={`panel-title ${isRevealed && !metrics.choseAuthenticity ? 'text-glitch' : ''}`}>{isRevealed ? "Session Log" : 'Your Inner Voice'}</h3>
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
                          <button className="cta-btn" onClick={handleSendMessage}>Transmit Response</button>
                        </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="composer">
                <label htmlFor="user-message-input">Compose response:</label>
                <textarea id="user-message-input" className={`input-area ${isCrafting ? 'is-crafting' : ''}`} placeholder="Start typing your thoughts here...." value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isBuilderActive || isRevealed} aria-label="Your message input" />
                <div className="row">
                  <button className="cta-btn" onClick={handleSendToBot} disabled={!inputValue.trim() || isRevealed || isBuilderActive}>
                    Send to Bot
                  </button>
                </div>
                {isBuilderActive && !isRevealed && originalUserDraft && (
                  <div className="keep-original-container">
                    <button className="keep-original-btn" onClick={keepOriginalResponse}>Revert to my words</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatsplitscreen;