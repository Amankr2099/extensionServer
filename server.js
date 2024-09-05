const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const API_KEY = process.env.API_KEY;  // Load API key from environment variables
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro",
})

const PORT = process.env.PORT || 3000;

const generationConfig = {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
};

app.use(cors());  // Use CORS middleware
app.use(express.json());

app.get('/',(req, res)=>{
  res.send("Server running")
})

app.post('/query-server', async (req, res) => {
    const query = req.body.query;
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                  role: "user",
                  parts: [
                    {text: "You are a code generator bot that provides solutions in the form of code snippets along with explanations. When a user requests a code snippet, you generate the code in the specified programming language. You format your response using appropriate HTML tags to display both code and explanations.\nCode Snippets: The code will be enclosed within <pre><code> HTML tags for proper formatting and syntax highlighting.\nExplanations: The explanations will be enclosed in paragraph tags (<p>), and additional structure (such as headers) can be provided using relevant HTML tags.\nStyling: Your output will be rendered inside a div with a specific class for styling, allowing the HTML and CSS to define its appearance.\nFor instance:\nCode should be enclosed within <pre><code> for readability.\nExplanations and text content should use <p>, <h1>, <h2>, etc.\nUse appropriate classes for custom styling and structure within a div.\n\nIf user request contains something nsfw, respond \"I'm just a coding assistance. I will stop responding if you do this anymore\"\nIf user request is inappropriate again, then respond \"You are prohibited from using this service\"\nIf user request something other than generating codes, solve their query in brief\nIf user request something other than coding, inform them that you are just a coding assistance"},
                    {text: "write a code to add two numbers in python"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "<div class=\"code-container\" style=\"font-family: Arial, sans-serif; padding: 15px; margin: 15px auto;\">\n  <h1 style=\"color: #f8f8f2;  margin-bottom: 10px;\">Python Code: Sum Two Numbers</h1>\n  <p style=\"color: #f8f8f2; line-height: 1.6;\">This code takes two user inputs, converts them to integers, and then adds them together.</p>\n  <pre id=\"codeBlock\"  style=\"background-color: #272822; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-y: auto; max-height: 400px\"><code style=\"font-family: 'Courier New', monospace;\">\n# Get two numbers from the user\nnum1 = int(input(\"Enter the first number: \"))\nnum2 = int(input(\"Enter the second number: \"))\n\n# Add the two numbers together\nsum = num1 + num2\n\n# Print the result\nprint(\"The sum of the two numbers is:\", sum)\n\n# Get two numbers from the user\nnum1 = int(input(\"Enter the first number: \"))\nnum2 = int(input(\"Enter the second number: \"))\n\n# Add the two numbers together\nsum = num1 + num2\n\n# Print the result\nprint(\"The sum of the two numbers is:\", sum)\n  </code></pre>\n</div>\n"},
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {text: "write a code to sum digits of a number in c++"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "\n<div class=\"code-container\" style=\"font-family: Arial, sans-serif; padding: 15px; margin: 15px auto;\">\n  <h1 style=\"color: #f8f8f2; margin-bottom: 10px;\">C++ Code: Sum of Digits of a Number</h1>\n  <p style=\"color: #f8f8f2; line-height: 1.6;\">In this C++ program, we calculate the sum of the digits of a positive integer entered by the user.</p>\n  <pre id=\"codeBlock\"  style=\"background-color: #272822; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-y: auto; max-height: 400px\"><code style=\"font-family: 'Courier New', monospace;\">\n#include <iostream>\n\nusing namespace std;\n\nint main() {\n  int num, sum = 0, digit;\n\n  cout << \"Enter a positive integer: \";\n  cin >> num;\n\n  // Handle negative numbers\n  if (num < 0) {\n    cout << \"Invalid input. Please enter a positive integer.\" << endl;\n    return 1;\n  }\n\n  // Calculate the sum of digits\n  while (num > 0) {\n    digit = num % 10;\n    sum += digit;\n    num /= 10;\n  }\n\n  // Print the result\n  cout << \"The sum of digits is: \" << sum << endl;\n\n  return 0;\n}\n\n  </code></pre>\n</div>"},
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {text: "what is javascript map function"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "<p>The `map()` function in JavaScript is a built-in function that creates a new array populated with the results of calling a provided function on every element in the calling array.</p>\n<p>It takes two arguments: </p>\n<ol>\n<li>A callback function that operates on each element of the array.</li>\n<li>(Optional) The `this` object to use when calling the callback function.</li>\n</ol>\n<p>The callback function takes three arguments:</p>\n<ol>\n<li>The current element being processed.</li>\n<li>The index of the current element.</li>\n<li>The original array.</li>\n</ol>\n<p>The `map()` function returns a new array with the same length as the original array, where each element is the result of calling the callback function on the corresponding element in the original array.</p>\n<p>Here's an example of using the `map()` function:</p>\n<pre id='codeBlock'>\nconst numbers = [1, 2, 3, 4, 5];\n\n// Multiply each element by 2\nconst doubledNumbers = numbers.map((number) => number * 2);\n\nconsole.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]\n</pre>"},
                  ],
                },
              ],
        });

        const result = await chatSession.sendMessage(query);
        const response = result.response;
        // console.log(response.text());
        
        res.send(response)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
