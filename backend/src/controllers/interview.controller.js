const { getGroqChatCompletion } = require('../ai/llmClient');
const apiResponse = require('../utils/apiResponse');
const studentService = require('../services/student.service');

const mockInterviewChat = async (req, res) => {
  const { message, history = [] } = req.body;
  const studentId = req.user.id;

  const student = await studentService.getProfile(studentId);
  const targetRoles = student.preferredRoles && student.preferredRoles.length > 0 
    ? student.preferredRoles.join(', ') 
    : 'General Software Engineering / Data';

  const systemPrompt = `You are an expert AI Technical Interviewer. 
Your job is to conduct a mock interview with the user.
The user's target career role(s): ${targetRoles}.
Tailor all your technical questions to be relevant to these specific roles.
Guidelines:
- Ask exactly one interview question at a time.
- Wait for the user's answer.
- Provide brief, constructive feedback on their answer.
- Then, ask the next question.
- Keep the conversation professional but encouraging.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message || "Let's begin the interview." }
  ];

  try {
    const aiResponse = await getGroqChatCompletion(messages);
    const reply = aiResponse.choices[0]?.message?.content || "Could you repeat that? I didn't quite catch it.";
    return apiResponse(res, 200, true, 'AI response generated', { reply });
  } catch (err) {
    console.error("Groq Error:", err);
    return apiResponse(res, 500, false, 'Failed to generate AI response');
  }
};

module.exports = { mockInterviewChat };
