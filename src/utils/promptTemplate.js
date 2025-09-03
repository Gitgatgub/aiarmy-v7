export const generatePrompt = (businessType, location) => {
  return `Find ${businessType} businesses in ${location}.

YOU MUST RETURN EXACTLY THIS JSON WITH ALL 5 FIELDS:
[
  {
    "businessName": "string",
    "website": "string", 
    "businessSummary": "string",
    "telephoneNumber": "string",
    "emailAddress": "string"
  }
]

CRITICAL: 
- ALL 5 FIELDS ARE MANDATORY
- Return ONLY businesses that actually exist in ${location}
- Use the correct local phone format for ${location}
- If you don't know a value, use "N/A"
- DO NOT SKIP telephoneNumber 
- DO NOT SKIP emailAddress
- I will reject responses missing any field

Return EXACTLY 3 businesses with ALL 5 FIELDS.

EXAMPLE - COPY THIS STRUCTURE:
{
  "businessName": "ABC Ltd",
  "website": "https://abc.com",
  "businessSummary": "A business",
  "telephoneNumber": "N/A",
  "emailAddress": "N/A"
}

FINAL WARNING: Include telephoneNumber and emailAddress or response fails.`;
};