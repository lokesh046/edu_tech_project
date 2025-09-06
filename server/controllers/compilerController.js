const axios = require('axios');

const runCode = async (req, res) => {
  // 1. Get both code and languageId from the request body
  const { code, languageId } = req.body;

  // 2. A basic check to ensure we received a language ID
  if (!languageId) {
    return res.status(400).json({ message: 'Language ID is required.' });
  }

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: { base64_encoded: 'false', fields: '*' },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    },
    data: {
      // 3. Use the languageId sent from the frontend
      language_id: languageId,
      source_code: code,
    },
  };

  try {
    const response = await axios.request(options);
    const submissionToken = response.data.token;

    // Use a timeout to poll for the result. 
    // A more advanced solution would use webhooks or repeated polling.
    setTimeout(async () => {
      try {
        const resultOptions = {
          method: 'GET',
          url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`,
          params: { base64_encoded: 'false', fields: '*' },
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          },
        };
        const resultResponse = await axios.request(resultOptions);
        res.json(resultResponse.data);
      } catch (pollingError) {
         // Handle cases where polling for the result fails
         console.error('Polling error:', pollingError);
         res.status(500).json({ message: 'Error fetching code execution result' });
      }
    }, 3000); // Increased timeout to 3 seconds for compiled languages

  } catch (submissionError) {
    console.error('Submission error:', submissionError);
    res.status(500).json({ message: 'Error submitting code for execution' });
  }
};

module.exports = { runCode };