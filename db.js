// ブラウザ内だけで動く軽量SQLite（sql.js）
// メモリ上にしか保存されないので、ページを閉じる・リロードすると自動でリセットされるよ
let db = null;

async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
    db = new SQL.Database();
    db.run(`
        CREATE TABLE scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            score INTEGER,
            taken_at TEXT
        );
    `);
}

function saveScore(score) {
    if (!db) return;
    const takenAt = new Date().toLocaleString('ja-JP');
    db.run(`INSERT INTO scores (score, taken_at) VALUES (?, ?);`, [score, takenAt]);
}

function getPastScores() {
    if (!db) return [];
    const result = db.exec(`SELECT score, taken_at FROM scores ORDER BY id DESC;`);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({ score: row[0], takenAt: row[1] }));
}