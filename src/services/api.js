const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Helper function to get emails using GPT-4
const findEmailsWithGPT4 = async (businesses) => {
  try {
    const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key is missing');
    }

    // Create a prompt asking GPT-4 to find emails
    const prompt = `For each of these businesses, find their contact email address from their website if available. Return ONLY a JSON array with the email addresses in the same order. Use "N/A" if no email is found.

Businesses:
${businesses.map((b, i) => `${i + 1}. ${b.businessName} - Website: ${b.website}`).join('\n')}

Return format: ["email1", "email2", "email3", "email4", "email5"]`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get emails from GPT-4');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      const emails = JSON.parse(content);
      return emails;
    } catch {
      return businesses.map(() => 'N/A');
    }
  } catch (error) {
    console.error('GPT-4 email error:', error);
    return businesses.map(() => 'N/A');
  }
};

export const searchBusinesses = async (businessType, location) => {
  try {
    const apiKey = process.env.REACT_APP_SERPAPI_KEY;
    console.log('SerpAPI key exists:', !!apiKey); // DEBUG LINE
    
    if (!apiKey) {
      throw new Error('SerpAPI key is missing');
    }

    // Build SerpAPI request - moved to Netlify function
    // params are now handled in netlify/functions/search.js

    const response = await fetch('/.netlify/functions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessType, location })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${errorData}`);
    }

    const data = await response.json();
    console.log('SerpAPI raw data:', data); // Debug log
    
    // Check if we have results
    console.log('SerpAPI raw data:', JSON.stringify(data, null, 2));
    if (!data.local_results || !Array.isArray(data.local_results)) {
      throw new Error('No results found');
    }

    // Map SerpAPI results to your format (max 5 businesses)
    const businesses = data.local_results.slice(0, 5).map(result => ({
      businessName: result.title || 'Unknown Business',
      website: result.website || 'N/A',
      businessSummary: result.description || result.type || 'Local business',
      telephoneNumber: result.phone || 'N/A',
      emailAddress: 'N/A' // Will be filled by GPT-4
    }));

    // Get emails using GPT-4
    const emails = await findEmailsWithGPT4(businesses);
    
    // Add emails to businesses
    businesses.forEach((business, index) => {
      business.emailAddress = emails[index] || 'N/A';
    });

    return businesses;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};