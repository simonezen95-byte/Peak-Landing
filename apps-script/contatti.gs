// PEAK - riceve i contatti dal form del sito e li scrive nel foglio PEAK CONTATTI.
// Risponde al sito con {"ok":true} solo se la riga e' stata salvata davvero.

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // evita righe sovrapposte se arrivano due invii insieme

    const d = JSON.parse(e.postData.contents);
    if (!d.nome || (!d.telefono && !d.email)) {
      return risposta({ ok: false, errore: "dati mancanti" });
    }

    const foglio = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    foglio.appendRow([
      d.data || new Date(),
      d.nome || "",
      d.telefono || "",
      d.email || "",
      d.interesse || "",
      ""
    ]);
    SpreadsheetApp.flush();

    return risposta({ ok: true });
  } catch (err) {
    return risposta({ ok: false, errore: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function risposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
