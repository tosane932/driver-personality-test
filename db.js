let db = null; 

async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
    // 固有のキー名に変更
    const STORAGE_KEY = 'truck_driver_test_db_v1';

    // 1. まずブラウザのLocalStorageに過去のDBデータ（ロッカーの荷物）がないか確認
    const savedDb = localStorage.getItem(STORAGE_KEY);
    if (savedDb) {
        // 過去のデータがあれば、それを復元してDBを起動
        const binaryArray = JSON.parse(savedDb);
        db = new SQL.Database(new Uint8Array(binaryArray));
    } else {
        // 初めての起動なら、まっさらな状態でDBを作成してテーブルを作る
        db = new SQL.Database();
        db.run(`
            CREATE TABLE scores (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                score INTEGER,\n                taken_at TEXT\n            );
        `);
    }
}

function saveScore(score) {
    if (!db) return;
    const takenAt = new Date().toLocaleString('ja-JP');
    db.run(`INSERT INTO scores (score, taken_at) VALUES (?, ?);`, [score, takenAt]);

    // 2. データが追加されたら、現在のDBの状態を丸ごとLocalStorageに保存する
    const exportedData = db.export(); // データベースをバイナリデータ（Uint8Array）に変換
    const arrayForJson = Array.from(exportedData); // JSONにできるように普通の配列に変換
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayForJson));
}

function getPastScores() {
    if (!db) return [];
    const result = db.exec(`SELECT score, taken_at FROM scores ORDER BY id DESC;`);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({ score: row[0], takenAt: row[1] }));
}