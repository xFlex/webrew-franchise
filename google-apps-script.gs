/**
 * Webrew Franchise — form → Google Sheet
 * ------------------------------------------------------------------
 * SETUP (one time):
 *   1. Create a Google Sheet. First row (row 1) headers, in this order:
 *        submitted_at | name | phone | city | budget | email | message | source
 *   2. In that sheet:  Extensions → Apps Script
 *   3. Delete whatever is there, paste this whole file, Save.
 *   4. Run ▸ (pick `setup`) once and grant permissions when asked.
 *   5. Deploy ▸ New deployment ▸ type "Web app"
 *        - Description:  webrew franchise form
 *        - Execute as:   Me
 *        - Who has access:  Anyone
 *      Deploy → copy the Web app URL (ends with /exec).
 *   6. Paste that URL into index.html →  SHEET_ENDPOINT = "...".
 *
 * To change the sheet later just edit SHEET_NAME below and redeploy
 * (Deploy ▸ Manage deployments ▸ edit ▸ Version: New version).
 */

var SHEET_NAME = 'Sheet1'; // tab name that holds the submissions
var NOTIFY_EMAIL = '';     // optional: put an address here to get an email per lead

var HEADERS = ['submitted_at', 'name', 'phone', 'city', 'budget', 'email', 'message', 'source'];

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);

    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
             || SpreadsheetApp.getActive().insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    var p = (e && e.parameter) ? e.parameter : {};
    var row = HEADERS.map(function (h) {
      if (h === 'submitted_at') return p.submitted_at || new Date().toISOString();
      return p[h] || '';
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'طلب امتياز جديد — ' + (p.name || 'بدون اسم'),
        body: HEADERS.map(function (h) { return h + ': ' + (p[h] || ''); }).join('\n')
      });
    }

    lock.releaseLock();
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'webrew-franchise-form' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create headers + authorize. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
}
