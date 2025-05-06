
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messageContainerRef = useRef(null);
  
  // Simulation des messages de bienvenue au chargement
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        sender: 'bot',
        message: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date()
      },
      {
        id: 2,
        sender: 'bot',
        message: 'Vous pouvez me poser des questions sur les produits, les commandes, les retours, ou autre chose !',
        timestamp: new Date(Date.now() + 1000)
      }
    ];
    
    setMessages(initialMessages);
    
    // Simulation de la présence en ligne/hors ligne
    const onlineInterval = setInterval(() => {
      // 90% de chance d'être en ligne
      setIsOnline(Math.random() < 0.9);
    }, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(onlineInterval);
  }, []);
  
  // Auto-scroll vers le dernier message
  useEffect(() => {
    if (messageContainerRef.current && isOpen) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    
    // Activer l'indicateur de frappe
    setIsTyping(true);
    
    try {
      // Utiliser le proxy serveur pour éviter l'exposition des clés API côté client
      // Pour les réponses rapides, on peut utiliser les réponses locales
      const lowerInput = inputMessage.toLowerCase();
      
      if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
        await simulateTypingDelay(800);
        const botResponse = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
        addBotMessage(botResponse);
        return;
      }
      
      if (lowerInput.includes('merci')) {
        await simulateTypingDelay(600);
        const botResponse = "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?";
        addBotMessage(botResponse);
        return;
      }
      
      if (lowerInput.includes('au revoir') || lowerInput.includes('bye')) {
        await simulateTypingDelay(700);
        const botResponse = "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.";
        addBotMessage(botResponse);
        return;
      }
      
      // Pour les autres messages, utiliser l'API
      // Simuler un délai de frappe réaliste (entre 1.5 et 3.5 secondes)
      const typingDelay = Math.floor(Math.random() * 2000) + 1500;
      
      // Essayer d'abord d'utiliser l'API locale avec notre proxy
      try {
        const response = await fetch('/api/chat/huggingface-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMessage: inputMessage,
            conversationHistory: updatedMessages.slice(-10) // Envoyer les 10 derniers messages pour contexte
          }),
        });
        
        // Simuler un délai de frappe naturel
        await simulateTypingDelay(typingDelay);
        
        if (response.ok) {
          const data = await response.json();
          addBotMessage(data.response);
        } else {
          // Si le proxy échoue, utiliser la fonction de secours
          const fallbackResponse = await generateBotResponse(inputMessage);
          addBotMessage(fallbackResponse);
        }
      } catch (error) {
        console.error('Erreur avec le proxy API:', error);
        
        // Si l'API proxy échoue, utiliser directement la fonction de secours après un léger délai
        await simulateTypingDelay(typingDelay);
        const fallbackResponse = await generateBotResponse(inputMessage);
        addBotMessage(fallbackResponse);
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      
      // Attendre au moins un court délai pour l'effet naturel
      await simulateTypingDelay(1000);
      
      // Message d'erreur en cas d'échec
      addBotMessage("Désolé, je rencontre des difficultés à traiter votre demande. Puis-je vous aider avec autre chose ?");
    } finally {
      setIsTyping(false);
    }
  };
  
  // Fonction utilitaire pour ajouter un message du bot
  const addBotMessage = (messageText) => {
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      message: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Fonction pour simuler un délai naturel de frappe
  const simulateTypingDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  // Fonction pour générer une réponse du bot via l'API Hugging Face
  const generateBotResponse = async (userInput) => {
    try {
      // Vérifier si le message requiert une réponse rapide prédéfinie
      const lowerInput = userInput.toLowerCase();
      
      // Réponses rapides pour les salutations pour une meilleure réactivité
      if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
        return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
      }
      
      if (lowerInput.includes('merci')) {
        return "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?";
      }
      
      if (lowerInput.includes('au revoir') || lowerInput.includes('bye')) {
        return "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.";
      }
      
      // Pour tout autre message, utiliser l'API Hugging Face
      const apiUrl = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || 'hf_api_key_here'}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: [],
            generated_responses: [],
            text: userInput
          },
          parameters: {
            max_length: 100,
            min_length: 10,
            temperature: 0.7,
            top_p: 0.9,
          },
          options: {
            wait_for_model: true
          }
        }),
      });
      
      if (!response.ok) {
        // Si l'API est indisponible, utiliser des réponses de secours
        console.error("Erreur API Hugging Face:", await response.text());
        
        // Réponses de secours contextuelles basées sur des mots-clés
        if (lowerInput.includes('commande')) {
          return "Vous pouvez suivre votre commande dans la section 'Mes commandes' de votre compte client. Si vous avez des problèmes, n'hésitez pas à nous contacter au support avec votre numéro de commande.";
        }
        
        if (lowerInput.includes('retour') || lowerInput.includes('rembours')) {
          return "Notre politique de retour vous permet de retourner les articles dans les 30 jours suivant la réception. Vous pouvez initier un retour depuis votre compte client dans la section 'Mes commandes'.";
        }
        
        if (lowerInput.includes('livraison')) {
          return "Nos délais de livraison standard sont de 3 à 5 jours ouvrables. Nous proposons également une livraison express en 24h pour certaines régions.";
        }
        
        if (lowerInput.includes('paiement')) {
          return "Nous acceptons plusieurs méthodes de paiement : cartes de crédit, PayPal, et virement bancaire. Toutes les transactions sont sécurisées.";
        }
        
        return "Désolé, je rencontre des difficultés à traiter votre demande. Comment puis-je vous aider autrement ?";
      }
      
      const data = await response.json();
      
      // Traiter la réponse de l'API
      let botResponse = data.generated_text || "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?";
      
      // Adapter la réponse au contexte e-commerce si nécessaire
      botResponse = adaptResponseToEcommerce(botResponse, lowerInput);
      
      return botResponse;
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      return "Désolé, je rencontre un problème technique. Un membre de notre équipe sera disponible bientôt. Pouvez-vous réessayer dans quelques instants ?";
    }
  };
  
  // Fonction pour adapter la réponse au contexte e-commerce
  const adaptResponseToEcommerce = (response, userInput) => {
    // Vérifier si la réponse est appropriée pour un contexte e-commerce
    const ecommerceReferences = [
      {keyword: "produit", replacement: "Je suis là pour vous aider à trouver les meilleurs produits adaptés à vos besoins."},
      {keyword: "acheter", replacement: "Notre processus d'achat est simple et sécurisé. Je peux vous guider à travers les différentes étapes."},
      {keyword: "prix", replacement: "Tous nos prix sont clairement indiqués sur les pages produits, et nous proposons régulièrement des offres spéciales."},
      {keyword: "promotion", replacement: "N'hésitez pas à consulter notre page d'offres spéciales pour découvrir nos promotions en cours."}
    ];
    
    // Si la réponse contient des éléments inappropriés ou hors sujet, la remplacer
    if (response.includes("I don't know") || 
        response.includes("I can't help") || 
        response.includes("I am an AI") ||
        response.toLowerCase().includes("not sure")) {
      
      // Chercher des mots-clés dans la question de l'utilisateur pour donner une réponse contextuelle
      for (const ref of ecommerceReferences) {
        if (userInput.includes(ref.keyword)) {
          return ref.replacement;
        }
      }
      
      return "Je suis là pour vous aider avec toutes vos questions concernant nos produits, commandes ou services. Comment puis-je vous être utile aujourd'hui ?";
    }
    
    return response;
  };
  
  // Formater l'heure du message
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="live-chat-container">
      {/* Bouton pour ouvrir/fermer le chat */}
      <Button
        onClick={toggleChat}
        className="chat-toggle-button"
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        variant="primary"
      >
        {isOpen ? (
          <i className="icofont-close"></i>
        ) : (
          <>
            <i className="icofont-chat me-2"></i>
            Chat
          </>
        )}
      </Button>
      
      {/* Fenêtre de chat */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <Card className="chat-card border-0 shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-2">
            <div className="d-flex align-items-center">
              <div className="chat-avatar me-2">
                <img 
                  src="/images/avatar.jpg" 
                  alt="Support" 
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">Support Client</h6>
                <div className="text-white-50 small d-flex align-items-center">
                  <span className={`status-indicator ${isOnline ? 'online' : 'offline'} me-1`}></span>
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </div>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-white p-0" 
              onClick={toggleChat}
            >
              <i className="icofont-close"></i>
            </Button>
          </Card.Header>
          
          <Card.Body className="p-0 d-flex flex-column">
            <div className="messages-container px-3 py-2" ref={messageContainerRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    {msg.message}
                  </div>
                  <div className="message-time">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message-bubble bot-message typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="chat-footer p-2 border-top">
              <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    placeholder="Tapez votre message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="custom-textarea"
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={!inputMessage.trim()}
                  >
                    <i className="icofont-paper-plane"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </div>
      
      <style jsx>{`
        .live-chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .chat-toggle-button {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: absolute;
          bottom: 0;
          right: 0;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .chat-toggle-button i {
          font-size: 1.5rem;
        }
        
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          transform-origin: bottom right;
          transition: all 0.3s ease;
          visibility: hidden;
        }
        
        .chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          visibility: visible;
        }
        
        .chat-card {
          height: 450px;
          display: flex;
          flex-direction: column;
        }
        
        .messages-container {
          flex-grow: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: calc(450px - 110px);
        }
        
        .message-bubble {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 15px;
          margin-bottom: 5px;
          position: relative;
          word-break: break-word;
          display: flex;
          flex-direction: column;
        }
        
        .user-message {
          align-self: flex-end;
          background-color: #007bff;
          color: white;
          border-bottom-right-radius: 5px;
        }
        
        .bot-message {
          align-self: flex-start;
          background-color: #f0f2f5;
          color: #333;
          border-bottom-left-radius: 5px;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          align-self: flex-end;
          margin-top: 3px;
        }
        
        .bot-message .message-time {
          color: rgba(0, 0, 0, 0.5);
        }
        
        .custom-textarea {
          resize: none;
          overflow: hidden;
          min-height: 38px;
        }
        
        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .status-indicator.online {
          background-color: #4CAF50;
        }
        
        .status-indicator.offline {
          background-color: #9e9e9e;
        }
        
        .typing-indicator {
          padding: 8px 13px;
        }
        
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        
        .typing-dots span {
          width: 8px;
          height: 8px;
          background-color: #aaa;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.5s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
          animation-delay: 0.3s;
        }
        
        .typing-dots span:nth-child(3) {
          animation-delay: 0.6s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }
        
        @media (max-width: 576px) {
          .chat-window {
            width: 300px;
            bottom: 70px;
          }
          
          .chat-card {
            height: 400px;
          }
          
          .messages-container {
            max-height: calc(400px - 110px);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveChat;
