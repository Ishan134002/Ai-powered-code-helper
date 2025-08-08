require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const showdown = require("showdown");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Retry wrapper for generateContent
async function retryGenerateContent(model, prompt, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying... (${i + 1})`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

app.post("/getHints", async (req, res) => {
  const { problemName } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).send("Missing API_KEY in environment");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `${problemName}: Give only one concise hint (not the solution, not a restatement of the problem, and not multiple approaches) for how to solve this problem, in 2-3 sentences, in plain text and no markdown, easily parsable by html.`;

  try {
    const result = await retryGenerateContent(model, prompt);
    // The Gemini API returns a response object with a 'text' property or method
    let text;
    if (typeof result.response.text === 'function') {
      text = await result.response.text();
    } else {
      text = result.response.text;
    }
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    res.json({ hint: html });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("Error generating hints");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/`);
});
