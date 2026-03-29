import express from "express";
import Thread from "../models/Thread.js";
import { generateGeminiResponse } from "../utils/geminiUtils.js";
import fetchUsers from "../middleware/fetchUsers.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "ijk",
      title: "Testing new thread 3",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to save in database" });
  }
});

// Get all the thread

router.get("/thread", fetchUsers, async (req, res) => {
  try {
    const thread = await Thread.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });
    res.json(thread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetched threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch the chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      res.status(404).json({ error: "thread is not found" });
    }
    res.status(200).json({ success: "thread deleted successfully" });
  } catch (err) {
    console.log(err);
  }
});

// router.post("/chat",fetchUsers, async (req, res) => {
//     const { threadId, message } = req.body;
//     if (!threadId || !message) {
//         res.status(400).json({ error: "missing required fields" });
//     }
//     try {
//         let thread = await Thread.findOne({ threadId });
//         if (!thread) {
//             //create a new thread
//             thread = new Thread({
//                 user: req.user.id,
//                 threadId,
//                 title:message.substring(0, 30),
//                 message: [{ role: "user", content: message }]
//             })
//         }
//         else {
//             if (thread.user.toString() !== req.user.id) {
//                 return res.status(403).json({ error: "Not authorized to edit this chat" });
//             }
//             thread.message.push({ role: "user", content: message });
//         }
//         const geminiReply = await generateGeminiResponse(message);
//         thread.message.push({ role: "assistant", content: geminiReply });
//         thread.updatedAt = new Date();

//         await thread.save();
//         res.json({ success: geminiReply });
//     }
//     catch(err) {
//         console.log(err);
//     }
// })
router.post("/chat", fetchUsers, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    // A. If thread doesn't exist, create it
    if (!thread) {
      thread = new Thread({
        user: req.user.id,
        threadId,
        title: message.substring(0, 30) + "...", // Auto-generate title
        message: [],
      });
    }
    // B. If thread exists, verify ownership
    else {
      if (thread.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Not authorized to edit this chat" });
      }
    }

    // --- CONTEXT LOGIC ---

    // 1. Prepare History for Gemini
    // We map your DB 'assistant' role to Gemini's 'model' role
    // We explicitly DO NOT include the current new message in history yet;
    // sendMessage() handles that.
    const historyForGemini = thread.message.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    // console.log(historyForGemini);
    // 2. Add the User's NEW message to the Database
    thread.message.push({ role: "user", content: message });

    // 3. Generate Response (Pass history + new message)
    const geminiReply = await generateGeminiResponse(historyForGemini, message);

    // 4. Add the AI's response to the Database
    thread.message.push({ role: "assistant", content: geminiReply });

    // 5. Update timestamp and Save
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ success: geminiReply });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
