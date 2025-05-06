
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, conversationHistory } = req.body;
    
    if (!userMessage) {
      return res.status(400).json({ error: 'User message is required' });
    }

    // Formatage de l'historique pour l'API HuggingFace
    const pastUserInputs = conversationHistory
      ? conversationHistory.filter(msg => msg.sender === 'user').map(msg => msg.message)
      : [];
    
    const generatedResponses = conversationHistory
      ? conversationHistory.filter(msg => msg.sender === 'bot').map(msg => msg.message)
      : [];

    // Appel à l'API Hugging Face
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: pastUserInputs.slice(-5), // Limiter à 5 derniers messages pour la contexte
          generated_responses: generatedResponses.slice(-5),
          text: userMessage
        },
        parameters: {
          max_length: 150,
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
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Error from Hugging Face API', 
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json({ response: data.generated_text });
  } catch (error) {
    console.error('Error in Hugging Face proxy:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
