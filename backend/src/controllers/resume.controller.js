const pdfParse = require('pdf-parse');
const { getGroqChatCompletion } = require('../ai/llmClient');
const apiResponse = require('../utils/apiResponse');

const analyzeResume = async (req, res) => {
  if (!req.file) {
    return apiResponse(res, 400, false, 'No file uploaded');
  }

  try {
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf8');
    }

    if (!text || text.trim() === '') {
       return apiResponse(res, 400, false, 'Could not extract text from file');
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert AI Resume Analyzer. 
You will receive the text of a resume. Analyze it and output JSON matching exactly this schema:
{
  "overallScore": number (0-100),
  "categories": [
    { "label": "Formatting", "value": number },
    { "label": "Keywords", "value": number },
    { "label": "Impact", "value": number },
    { "label": "Skills match", "value": number }
  ],
  "suggestions": [
    { "text": string, "tone": "primary" | "warning" | "accent" }
  ]
}
Ensure there are exactly 4 categories and at least 3 suggestions. Only return valid JSON without markdown tags.`
      },
      { role: 'user', content: text.substring(0, 5000) }
    ];

    const aiResponse = await getGroqChatCompletion(messages);
    const content = aiResponse.choices[0]?.message?.content || '{}';
    
    // Extract JSON in case AI wraps it in markdown
    let analysis;
    try {
       const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
       analysis = JSON.parse(jsonStr);
    } catch (e) {
       console.error("Failed to parse JSON", content);
       return apiResponse(res, 500, false, 'AI response format error');
    }

    return apiResponse(res, 200, true, 'Resume analyzed successfully', analysis);
  } catch (error) {
    console.error("Resume analysis error:", error);
    return apiResponse(res, 500, false, 'Error analyzing resume');
  }
};

module.exports = { analyzeResume };
