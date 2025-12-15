// Mock AI responses for common e-commerce queries
const mockResponses = {
  hello:
    "Hello! I'm Nova, your e-commerce assistant. How can I help you today?",
  hi: "Hi there! I'm Nova. What can I help you with today?",
  help: 'I can help you with: Product information, Order status, Returns and refunds, Account questions, Payment methods, and Shipping information. What do you need help with?',
  'order status':
    'To check your order status, please provide your order number or check your account dashboard.',
  'return policy':
    'We offer a 30-day return policy. Items must be unused and in original packaging. Would you like help starting a return?',
  shipping:
    'Standard shipping takes 3-5 business days. We also offer express shipping for an additional fee. Where would you like your order shipped?',
  'payment methods':
    'We accept all major credit cards, PayPal, and bank transfers. Which payment method would you prefer?',
  'contact support':
    'You can reach our support team at support@example.com or call us at (555) 123-4567. Our hours are Mon-Fri, 9am-5pm EST.',
  default:
    "I'm sorry, I can only answer questions about our e-commerce store. Try asking about products, orders, or account help.",
};

// Simple keyword matching for responses
function getResponse(message) {
  const lowerMsg = message.toLowerCase();

  // Check for matching keywords
  if (lowerMsg.includes('order')) return mockResponses['order status'];
  if (lowerMsg.includes('return') || lowerMsg.includes('refund'))
    return mockResponses['return policy'];
  if (lowerMsg.includes('ship') || lowerMsg.includes('delivery'))
    return mockResponses['shipping'];
  if (
    lowerMsg.includes('pay') ||
    lowerMsg.includes('card') ||
    lowerMsg.includes('payment')
  )
    return mockResponses['payment methods'];
  if (
    lowerMsg.includes('contact') ||
    lowerMsg.includes('support') ||
    lowerMsg.includes('help')
  )
    return mockResponses['contact support'];

  // Check for exact matches
  return mockResponses[lowerMsg] || mockResponses['default'];
}

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get a mock response based on the message
    const reply = getResponse(message);

    // Simulate network delay (optional)
    setTimeout(() => {
      res.status(200).json({ reply });
    }, 500);
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message,
    });
  }
}
