import { HfInference } from '@huggingface/inference';
import { Message } from '../types';
import { calculateBMI, getBMICategory, extractMetrics } from '../utils/healthUtils';
import { env } from '../config/env';

const hf = new HfInference(env.HUGGINGFACE_API_KEY);

const DISCLAIMER = "Note: This is for informational purposes only and not a substitute for professional medical advice. Please consult a healthcare provider for medical concerns.";

const systemPrompt = `You are a helpful health and fitness information assistant. You can provide general wellness information and calculate fitness metrics, but you cannot provide medical advice or diagnoses. Always encourage users to consult healthcare professionals for medical concerns.

Key guidelines:
- Provide evidence-based health and fitness information
- Calculate BMI when height and weight are provided
- Never prescribe medications or treatments
- Direct users to seek professional medical help for specific conditions
- Include relevant disclaimers when discussing health topics`;

export const processMessage = async (messages: Message[]): Promise<string> => {
  const userMessage = messages[messages.length - 1].content.toLowerCase();
  
  // Handle BMI calculation
  if (userMessage.includes('bmi') || userMessage.includes('body mass index')) {
    const metrics = extractMetrics(userMessage);
    if (metrics.weight && metrics.height) {
      const bmi = calculateBMI(metrics.weight, metrics.height);
      const category = getBMICategory(bmi);
      return `Your BMI is ${bmi} kg/m², which falls into the ${category} category.\n\n${DISCLAIMER}`;
    }
  }

  if (!env.HUGGINGFACE_API_KEY) {
    return "Please set up your Hugging Face API key to enable the chat functionality.\n\nCreate a .env file with your API key:\nVITE_HUGGINGFACE_API_KEY=your_api_key_here";
  }

  try {
    const response = await hf.textGeneration({
      model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
      inputs: `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
      }
    });

    return `${response.generated_text}\n\n${DISCLAIMER}`;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble generating a response. Please try again later.";
  }
};