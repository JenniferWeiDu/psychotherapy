/**
 * Google Apps Script for Psychotherapy Website Contact Form
 * 
 * This script handles form submissions from the website contact form.
 * It sends two emails:
 * 1. Notification to the therapist (jennifer.wei.du@gmail.com)
 * 2. Auto-reply confirmation to the client
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
    
    // Send email to yourself
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
    
    // Optional: Log to Google Sheet
    // logToSheet(data);
    
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
      `地点：Bayswater (W2)、Maida Vale (W9)、在线`;
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
      `地點：Bayswater (W2)、Maida Vale (W9)、線上`;
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
      `Locations: Bayswater (W2), Maida Vale (W9), Online`;
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
