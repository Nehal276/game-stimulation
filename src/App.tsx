import { useState } from 'react';
import './App.css';
import LandingScreen from './components/landingscreen';
import GrassScene from './components/Grassscene';
import Chatsplit from './components/Chatsplitscreen';
import Reflectionscene from './components/Reflectionscene';

// This helps in giving the data structure which is taken from the chatbot section in Chatsplit Screen //
interface UserMetrics {
  builderUses: number;
  timeToCompose: number;
  finalResponse: string;
  choseAuthenticity: boolean;
  originalDraft: string; 
}

function App() {
  // This controls which scene is active and rendered
  const [scene, setScene] = useState<'landing' | 'grass' | 'chat' | 'reflection'>('landing');
  // This helps in storing the metrics which are needed for the Reflection scene
  const [finalMetrics, setFinalMetrics] = useState<UserMetrics | null>(null);

  const handleChatComplete = (metrics: UserMetrics) => {
    setFinalMetrics(metrics);
    setScene('reflection');
  };
// This restarts the entire stimulation with button by returning to the landing page
  const handleRestart = () => {
    setFinalMetrics(null);
    setScene('landing');
  };
  
  

  return (
    <div className="App">
      {/* Each component will receive a callback prop which is 'onNext' or 'on Restart' to transition to the next state */}
      {scene === 'landing' && <LandingScreen onNext={() => setScene('grass')} />}
      
      {scene === 'grass' && <GrassScene onNext={() => setScene('chat')}/>}
      
      {scene === 'chat' && <Chatsplit onNext={handleChatComplete} />}
      
      {scene === 'reflection' && finalMetrics && (
        <Reflectionscene metrics={finalMetrics} onRestart={handleRestart} />
      )}
    </div>
  );
}
export default App;