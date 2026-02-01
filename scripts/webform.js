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
 * https://script.google.com/macros/s/AKfycbyFJsHWzGDmfCUakE-hE5N_-zziuCUhI75VdCnIbI4whR8BgRADSjXJUoxuqgZB7vfQuA/exec
 */

function doPost(e) {
  try {
    // Get form data
    const data = JSON.parse(e.postData.contents);
    
    // Your email address
    const myEmail = "jennifer.wei.du@gmail.com";
    
    // Send email to yourself
    GmailApp.sendEmail(
      myEmail,
      "New inquiry: " + data.subject,
      `You have a new inquiry from your website.\n\n` +
      `Name: ${data.from_name}\n` +
      `Email: ${data.reply_to}\n` +
      `Phone: ${data.phone || 'Not provided'}\n\n` +
      `Subject: ${data.subject}\n\n` +
      `Message:\n${data.message}`,
      {
        replyTo: data.reply_to
      }
    );
    
    // Send auto-reply to client
    GmailApp.sendEmail(
      data.reply_to,
      "Thank you for your inquiry - Jennifer Wei Du Psychotherapy",
      `Dear ${data.from_name},\n\n` +
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
      `Locations: Bayswater (W2), Maida Vale (W9), Online`
    );
    
    // Optional: Log to Google Sheet
    logToSheet(data);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logToSheet(data) {
  // Optional: Create a Google Sheet named "Contact Form Submissions" to log entries
  const sheetName = "Contact Form Submissions";
  let sheet;
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Subject", "Message"]);
    }
  } catch (e) {
    // If no active spreadsheet, create one
    const ss = SpreadsheetApp.create("Contact Form Submissions");
    sheet = ss.getSheets()[0];
    sheet.setName(sheetName);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Subject", "Message"]);
  }
  
  sheet.appendRow([
    new Date(),
    data.from_name,
    data.reply_to,
    data.phone || '',
    data.subject,
    data.message
  ]);
}
