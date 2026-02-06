/**
 * Google Apps Script for Psychotherapy Website Contact and Feedback Forms
 * 
 * This script handles form submissions from the website:
 * 1. Contact form - sends notification to therapist and auto-reply to client
 * 2. Feedback form - sends feedback to therapist only (no auto-reply for confidentiality)
 * 
 * Deploy this as a Web App with "Anyone" access to receive form submissions.
 * 
 * Current deployment URL:
 * https://script.google.com/macros/s/AKfycby2WYqRABpQNUM2xyWJvValAoUjXU_B9bD-Qr3Rzva8VOQpkgfOE3_rOzXNQDs4mA69Fw/exec
 */

function doPost(e) {
  try {
    // Get form data
    const data = JSON.parse(e.postData.contents);
    
    // Your email address
    const myEmail = "jennifer.wei.du@gmail.com";
    
    // Determine language
    const language = data.language || 'en';
    const languageLabel = language === 'zh-Hans' ? '简体中文' : 
                          language === 'zh-Hant' ? '繁體中文' : 'English';
    
    // Check if this is a feedback form submission
    const isFeedback = data.subject === "New Feedback Submission" || 
                       data.subject === "新反馈提交";
    
    if (isFeedback) {
      // Handle feedback form
      GmailApp.sendEmail(
        myEmail,
        "New Feedback: " + (data.from_name || "Anonymous"),
        `You have received new feedback from your website.\n\n` +
        `Language: ${languageLabel}\n` +
        `Name: ${data.from_name || 'Anonymous'}\n` +
        `Email: ${data.reply_to || 'Not provided'}\n\n` +
        `Feedback:\n${data.message}`
      );
      
      // Send auto-reply if email was provided
      if (data.reply_to) {
        sendFeedbackAutoReply(data);
      }
    } else {
      // Handle contact form - send notification and auto-reply
      GmailApp.sendEmail(
        myEmail,
        "New inquiry: " + data.subject,
        `You have a new inquiry from your website.\n\n` +
        `Language: ${languageLabel}\n` +
        `Name: ${data.from_name}\n` +
        `Email: ${data.reply_to}\n` +
        `Phone: ${data.phone || 'Not provided'}\n\n` +
        `Subject: ${data.subject}\n\n` +
        `Message:\n${data.message}`,
        {
          replyTo: data.reply_to
        }
      );
      
      // Send auto-reply to client in appropriate language
      sendAutoReply(data);
    }
    
    // Optional: Log to Google Sheet
    // logToSheet(data, isFeedback);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendAutoReply(data) {
  const language = data.language || 'en';
  
  let subject, body;
  
  if (language === 'zh-Hans') {
    // Simplified Chinese
    subject = "感谢您的咨询 - 杜薇心理治疗";
    body = `${data.from_name} 您好，\n\n` +
      `感谢您与我联系。我已收到您的咨询，将在周一至周五24小时内回复。\n\n` +
      `如果您有任何紧急问题，请随时通过短信联系我：+44 (0) 7840 232 467。\n\n` +
      `您的留言：\n` +
      `主题：${data.subject}\n` +
      `${data.message}\n\n` +
      `此致，\n` +
      `杜薇\n` +
      `UKCP和BACP认证心理治疗师\n\n` +
      `电邮：jennifer.wei.du@gmail.com\n` +
      `短信：+44 (0) 7840 232 467\n` +
      `地点：Maida Vale (W9)、在线`;
  } else if (language === 'zh-Hant') {
    // Traditional Chinese
    subject = "感謝您的諮詢 - 杜薇心理治療";
    body = `${data.from_name} 您好，\n\n` +
      `感謝您與我聯絡。我已收到您的諮詢，將在週一至週五24小時內回覆。\n\n` +
      `如果您有任何緊急問題，請隨時透過短信聯絡我：+44 (0) 7840 232 467。\n\n` +
      `您的留言：\n` +
      `主題：${data.subject}\n` +
      `${data.message}\n\n` +
      `此致，\n` +
      `杜薇\n` +
      `UKCP和BACP認證心理治療師\n\n` +
      `電郵：jennifer.wei.du@gmail.com\n` +
      `短信：+44 (0) 7840 232 467\n` +
      `地點：Maida Vale (W9)、線上`;
  } else {
    // English (default)
    subject = "Thank you for your inquiry - Jennifer Wei Du Psychotherapy";
    body = `Dear ${data.from_name},\n\n` +
      `Thank you for reaching out to me. I have received your inquiry and will respond within 24 hours, Monday to Friday.\n\n` +
      `In the meantime, if you have any urgent questions, please feel free to text me on 07840 232 467.\n\n` +
      `Your message:\n` +
      `Subject: ${data.subject}\n` +
      `${data.message}\n\n` +
      `Best regards,\n` +
      `Jennifer Wei Du\n` +
      `UKCP & BACP Registered Psychotherapist\n\n` +
      `Email: jennifer.wei.du@gmail.com\n` +
      `Text: 07840 232 467\n` +
      `Locations: Maida Vale (W9), Online`;
  }
  
  GmailApp.sendEmail(data.reply_to, subject, body);
}

function sendFeedbackAutoReply(data) {
  const language = data.language || 'en';
  const name = data.from_name || '';
  
  let subject, body;
  
  if (language === 'zh-Hans') {
    // Simplified Chinese
    subject = "感谢您的反馈 - 杜薇心理治疗";
    body = `${name ? name + ' 您好，' : '您好，'}\n\n` +
      `非常感谢您的反馈。我已收到您的留言。\n\n` +
      `如果您希望进一步联系，欢迎回复此邮件或发送短信至 +44 (0) 7840 232 467。我将尽力在周一至周五24小时内回复。\n\n` +
      `此致，\n` +
      `杜薇\n` +
      `UKCP和BACP认证心理治疗师\n\n` +
      `电邮：jennifer.wei.du@gmail.com\n` +
      `短信：+44 (0) 7840 232 467`;
  } else if (language === 'zh-Hant') {
    // Traditional Chinese
    subject = "感謝您的反饋 - 杜薇心理治療";
    body = `${name ? name + ' 您好，' : '您好，'}\n\n` +
      `非常感謝您的反饋。我已收到您的留言。\n\n` +
      `如果您希望進一步聯絡，歡迎回覆此郵件或發送短信至 +44 (0) 7840 232 467。我將盡力在週一至週五24小時內回覆。\n\n` +
      `此致，\n` +
      `杜薇\n` +
      `UKCP和BACP認證心理治療師\n\n` +
      `電郵：jennifer.wei.du@gmail.com\n` +
      `短信：+44 (0) 7840 232 467`;
  } else {
    // English (default)
    subject = "Thank you for your feedback - Jennifer Wei Du Psychotherapy";
    body = `${name ? 'Dear ' + name + ',' : 'Hello,'}\n\n` +
      `Thank you very much for your feedback. I acknowledge receipt of your message.\n\n` +
      `If you would like to make further contact, you are welcome to reply to this email or text me on 07840 232 467. I will endeavour to respond within 24 hours, Monday to Friday.\n\n` +
      `Best regards,\n` +
      `Jennifer Wei Du\n` +
      `UKCP & BACP Registered Psychotherapist\n\n` +
      `Email: jennifer.wei.du@gmail.com\n` +
      `Text: 07840 232 467`;
  }
  
  GmailApp.sendEmail(data.reply_to, subject, body);
}

// Optional: Uncomment to enable Google Sheet logging
/*
function logToSheet(data) {
  // Optional: Create a Google Sheet named "Contact Form Submissions" to log entries
  const sheetName = "Contact Form Submissions";
  let sheet;
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(["Timestamp", "Language", "Name", "Email", "Phone", "Subject", "Message"]);
    }
  } catch (e) {
    // If no active spreadsheet, create one
    const ss = SpreadsheetApp.create("Contact Form Submissions");
    sheet = ss.getSheets()[0];
    sheet.setName(sheetName);
    sheet.appendRow(["Timestamp", "Language", "Name", "Email", "Phone", "Subject", "Message"]);
  }
  
  sheet.appendRow([
    new Date(),
    data.language || 'en',
    data.from_name,
    data.reply_to,
    data.phone || '',
    data.subject,
    data.message
  ]);
}
*/
