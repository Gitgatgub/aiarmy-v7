exports.handler = async (event) => {
  const { businessType, location } = JSON.parse(event.body);
  
  const params = new URLSearchParams({
    engine: 'google_maps',
    q: `${businessType} in ${location}`,
    api_key: process.env.REACT_APP_SERPAPI_KEY,
    type: 'search'
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' })
    };
  }
};