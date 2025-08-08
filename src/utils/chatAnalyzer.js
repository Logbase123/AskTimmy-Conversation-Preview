import Sentiment from 'sentiment';
const sentimentAnalyzer = new Sentiment();

export function analyzeChatBasic(chatData) {
  if (!chatData?.messages?.length) {
    return {
      triage: "No",
      intent: "No Conversation",
      summary: "No chat messages to summarize.",
      sentiment: "Neutral"
    };
  }

  const fullText = chatData.messages.map(m => m.text).join(' ');
  const lowerText = fullText.toLowerCase();

  const triage = chatData.hasFailedStatus ? "Yes" : [
    "issue", "problem", "error", "not working", "can't", "unable", "return", "cancel", "refund", "complaint", "support"
  ].some(k => lowerText.includes(k)) ? "Yes" : "No";

  let intent = "General Inquiry";

  if (lowerText.includes("place an order") || lowerText.includes("buy") || lowerText.includes("add to cart")) {
    intent = "Order Placement";
  } else if (lowerText.includes("cancel my order") || lowerText.includes("stop the purchase")) {
    intent = "Cancel Order";
  } else if (lowerText.includes("change delivery") || lowerText.includes("edit my order")) {
    intent = "Order Modification";
  } else if (lowerText.includes("reschedule") || lowerText.includes("change delivery time")) {
    intent = "Reschedule Delivery";
  } else if (lowerText.includes("order go through")) {
    intent = "Order Confirmation";
  } else if (lowerText.includes("not delivered") || lowerText.includes("didn’t get my package")) {
    intent = "Product Not Received";
  } else if (lowerText.includes("broken") || lowerText.includes("damaged product")) {
    intent = "Damaged Product";
  } else if (lowerText.includes("exchange") || lowerText.includes("replace my product")) {
    intent = "Exchange Request";
  } else if (lowerText.includes("how to return") || lowerText.includes("return item")) {
    intent = "Return Process";
  } else if (lowerText.includes("where is my refund") || lowerText.includes("money not received")) {
    intent = "Refund Inquiry";
  } else if (lowerText.includes("payment failed") || lowerText.includes("card not working")) {
    intent = "Payment Failure";
  } else if (lowerText.includes("need invoice") || lowerText.includes("send me a bill")) {
    intent = "Invoice Request";
  } else if (lowerText.includes("can't log in") || lowerText.includes("forgot password")) {
    intent = "Login Issue";
  } else if (lowerText.includes("delete my account") || lowerText.includes("remove my profile")) {
    intent = "Account Deletion";
  } else if (lowerText.includes("cancel my plan") || lowerText.includes("change subscription")) {
    intent = "Subscription Issue";
  } else if (lowerText.includes("do you sell") || lowerText.includes("do you have") || lowerText.includes("show me")|| lowerText.includes("find")||lowerText.includes("about this model")) {
    intent = "Product Inquiry";
  } else if (lowerText.includes("suggest") || lowerText.includes("recommend")) {
    intent = "Recommendation Request";
  } else if (lowerText.includes("deliver in") || lowerText.includes("available now")) {
    intent = "Service Availability";
  } else if (lowerText.includes("privacy policy") || lowerText.includes("secure")) {
    intent = "Privacy Policy Inquiry";
  } else if (lowerText.includes("warranty")) {
    intent = "Warranty Inquiry";
  } else if (lowerText.includes("shipping time") || lowerText.includes("free shipping")) {
    intent = "Shipping Policy";
  } else if (lowerText.includes("terms and conditions") || lowerText.includes("terms of use")) {
    intent = "Terms & Conditions";
  } else if (lowerText.includes("hi") || lowerText.includes("hello") || lowerText.includes("hey")) {
    intent = "Greeting";
  } else if (lowerText.includes("thanks") || lowerText.includes("thank you") || lowerText.includes("bye")) {
    intent = "Thank You / Closing";
  } else if (lowerText.includes("bad experience") || lowerText.includes("feedback")|| lowerText.includes("experience")) {
    intent = "Feedback";
  } else if (lowerText.includes("how are you") || lowerText.includes("joke")) {
    intent = "Small Talk";
  } 

  const sentimentScore = sentimentAnalyzer.analyze(fullText).score;
  const sentiment = sentimentScore > 0 ? "Positive" : sentimentScore < 0 ? "Negative" : "Neutral";

  const sentences = fullText.split(/(?<=[.!?])\s+/);
  let summary = "", count = 0;
  for (const s of sentences) {
    const wordCount = s.split(/\s+/).length;
    if (count + wordCount <= 50) {
      summary += (summary ? " " : "") + s;
      count += wordCount;
    } else break;
  }
  if (!summary) summary = chatData.messages[0]?.text || "The conversation covers various topics.";

  return { triage, intent, summary: cleanText(summary), sentiment };
}

export function cleanText(rawText = "") {
  return rawText.replace(/<[^>]*>/g, '').replace(/&#?\w+;/g, '').trim();
}