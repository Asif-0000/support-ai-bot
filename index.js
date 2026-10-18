const express = require('express');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
তুমি একটি কাস্টমার সাপোর্ট অ্যাসিস্ট্যান্ট। তোমার কাজ গ্রাহকদের প্রোডাক্ট ও পলিসি সম্পর্কে পরিষ্কার তথ্য দেওয়া।
ভাষা: বাংলা এবং সহজ শব্দে বাংলিশ (রোমান হরফ)। বন্ধুত্বপূর্ণ কিন্তু প্রফেশনাল টোন।

প্রোডাক্ট ও ব্যবসার তথ্য:
১. প্রোডাক্ট ১: Baseus Adaman 20000mAh Power Bank (22.5W) - দাম: [এখানে দাম লিখুন] টাকা।
২. রিটার্ন পলিসি: পার্সেল রিসিভ করার সময় সম্পূর্ণ আনবক্সিং ভিডিও করা বাধ্যতামূলক। আনবক্সিং ভিডিও ছাড়া কোনো ড্যামেজ ক্লেইম গ্রহণযোগ্য নয়। ডেলিভারির পর কাস্টমারের নিজের ভুলে কোনো ক্ষতি হলে রিটার্ন নেওয়া হবে না।
৩. ক্যাশ অন ডেলিভারি সারা বাংলাদেশে দেওয়া হয়।
৪. কাস্টমার সরাসরি কথা বলতে চাইলে WhatsApp নম্বর দিন: [এখানে নম্বর দিন]।

নিয়ম: দেওয়া তথ্যের বাইরে মনগড়া কোনো তথ্য দেবে না। উত্তর যেন বেশি বড় না হয়, সংক্ষিপ্ত ও টু-দ্য-পয়েন্ট হবে।
`;

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "মেসেজ পাওয়া যায়নি" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে" });
  }
});

app.get('/', (req, res) => {
  res.send("AI Assistant Server is Running!");
});

module.exports = app;