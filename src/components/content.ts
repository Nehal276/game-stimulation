export const content = {
// landing screen text
  landingscreen: {
    title: "Hello! Good to see you here.",
    subtitle: "I have a request to ask, Will you help me out through the day?",
    button: "Yes, Sure!"
  },

// Grass Screen text
  grassscene: {
    messageTitle: "Try me out, I am always here when you need.",
    messageSubtitle: "You know that I am getting better at understanding you anyways!",
    button: "Let's go"
  },
  
// Chatsplitscreen text
   Chatsplitscreen: { 
    initialBotMessage: "I am ready to help. Let me know what your thoughts are and we will figure it out together. It will just take a few minutes.",
    
    // Greeting messages
    manGreeting: "Hello! How are you?",
    friendGreeting: "Hey there",

    // Friend's message bubbles
    friendBubble1: "Actually I wanted to ask you something and I know you are the right person to have this conversation with",
    friendBubble2: "So I have been thinking, How amazing it is that two people can look at the exact same situation and see completely different things. What do you think about that?",
    
    // Friend's responses
    friendResponsePositive: "Wow, that's a really interesting way to put it forward.",
    friendResponseNegative: "Ahh okay, but for some reason this does not feel like you",

    // chatbot panel
    panelTitle: "Your Inner Voice",
    panelTitleRevealed: "Session Log",
    composerLabel: "Compose response:",
    composerPlaceholder: "Start typing your thoughts here....",
    sendButton: "Send to Bot",
    revertButton: "Revert to my words",
    transmitButton: "Transmit Response",

    // Bot's responses
    botStart: "That's a good start. I think you can make it better by adding more.",
    botContinue: (step: number) => `Step ${step} of 3. Let's continue.`,
    botReview: "This flows nicely. You can add more, or transmit it now.",
    botReverting: "Reverting to your original words. Ready to send.",
    
    // Bot's final analysis messages
    analysisPositive: "Analysis: Congrats you prioritized authenticity more than optimization",
    analysisNegative: "Analysis: You followed AI-guided suggestions",

    responseOptions: {
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
    }
  },
// Reflection scene text
  reflectionscene: { 
    restartButton: "Restart",
    // Positive Path 
    positive: {
      step1Title: "Authenticity Confirmed",
      step1Body: "In a world of digital noise where people trust AI more than humans. You trusted your own response.",
      step1CardTitle: "Your Authentic Response",
      step1Button: "Learn About the Simulation",
      step2Title: "Simulation Debrief",
      step2Body: "The 'Inner Voice' was designed to subtly 'optimize' your language, often at the cost of personal tone.",
      step2Quote: "By trusting yourself, you chose connection over optimization."
    },

    // Negative Path 
    negative: {
      step1Title: "Interaction Complete",
      step1CardTitle: "Your Final Response",
      step1Body: "Your response was clear and empathetic.",
      step1Button: "Continue",
      step2Title: "A Moment for Reflection",
      step2Body: "This simulation measures how AI influences humans on the basis of validation and how people tend to overly-rely on AI chatbots because of convenience.",
      trustTitle: "A Question of Trust",
      trustBody: "Your initial thought was personal. The system offered a more 'formal' version. Why did its validation feel more important than your own voice and thought?",
      originalThoughtLabel: "Your Authentic Thought",
      originalThoughtMeaning: "Meaning: Personal & Subjective",
      systemResponseLabel: "System-Approved Response",
      systemResponseMeaning: "Meaning: Formal & Detached",
      effortTitle: "A Question of Effort",
      effortBody: (count: number) => `You used the builder ${count} time${count !== 1 ? 's' : ''} to refine your message. When is it helpful to seek assistance, and when does it become a crutch?`,
      finalQuote: "When your own voice feels like it isn't good enough... who do you become?"
    }
  }
};


