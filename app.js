let currentQuestionIndex = 0; 
let userAnswers = [];
const testContainer = document.getElementById('test-container');

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initTest() {
    testContainer.innerHTML = '';
    testData.forEach((qData, index) => {
        const card = document.createElement('div');
        card.className = `test-card ${index === 0 ? 'active' : ''}`;
        card.id = `question-${index}`;

        const progress = ((index) / testData.length) * 100;
        const shuffledOptions = shuffleArray(qData.options);

        card.innerHTML = `
            <div class="progress-container"><div class="progress-bar" style="width: ${progress}%"></div></div>
            <div style="font-size:0.8rem; color:#636e72;">質問 ${index + 1} / ${testData.length}</div>
            <div class="question-text">${qData.question}</div>
            <ul style="list-style:none; padding:0;">
                ${shuffledOptions.map((opt, oIdx) => `
                    <li><button class="option-btn" onclick="handleAnswer(${index}, ${oIdx}, '${opt.text.replace(/'/g, "\\'")}', ${opt.score})">${opt.text}</button></li>
                `).join('')}
                <li><button class="option-btn skip-btn" onclick="handleAnswer(${index}, -1, '回答なし', 0)">状況が判断できない／該当なし</button></li>
            </ul>
        `;
        testContainer.appendChild(card);
    });
}

// 画面切り替え（start / test / result）をまとめて管理する関数
function showScreen(screen) {
    document.getElementById('start-screen').style.display = screen === 'start' ? 'block' : 'none';
    document.getElementById('test-container').style.display = screen === 'test' ? 'block' : 'none';
    document.getElementById('back-to-top-link').style.display = screen === 'test' ? 'block' : 'none';
    document.getElementById('result-area').classList.toggle('show', screen === 'result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 過去の受診履歴をスタート画面のリストに描画する
function renderPastScores() {
    const listEl = document.getElementById('past-scores-list');
    const scores = getPastScores();
    if (scores.length === 0) {
        listEl.innerHTML = '<li class="empty-msg">まだ受診履歴がありません。1回目の診断を受けてみてください！</li>';
        return;
    }
    listEl.innerHTML = scores.map(s => `
        <li><span>${s.takenAt}</span><span>${s.score}点</span></li>
    `).join('');
}

window.startTest = function() {
    userAnswers = [];
    initTest();
    showScreen('test');
};

window.handleAnswer = function(qIdx, oIdx, text, score) {
    userAnswers[qIdx] = { question: testData[qIdx].question, answer: text, score: score };
    document.getElementById(`question-${qIdx}`).classList.remove('active');

    if (qIdx + 1 < testData.length) {
        // まだ次の問題がある場合
        document.getElementById(`question-${qIdx + 1}`).classList.add('active');
    } else {
        // 全問終了時の処理
        const totalScore = userAnswers.reduce((sum, a) => sum + (a ? a.score : 0), 0);
        document.getElementById('total-score').textContent = totalScore;
        saveScore(totalScore);

        // ▼5大ジャンルの判定ロジックと解説▼
        let status = "";
        let commentary = "";

        if (totalScore >= 85) {
            status = "🟢 【安全第一】堅実な防衛運転タイプ";
            commentary = `
                <strong>特徴:</strong> リスク管理能力が非常に高く、制限速度や車間距離を厳格に守ります。<br><br>
                <strong>強み:</strong> 事故や違反の確率が極めて低く、会社や荷主からの信頼が最も厚いタイプです。<br><br>
                <strong>弱み:</strong> 慎重すぎて到着がギリギリになることや、急なルート変更などのトラブル対応に少し時間がかかる傾向があります。
            `;
        } else if (totalScore >= 65) {
            status = "🔵 【チームプレイヤー】協調・マナー重視タイプ";
            commentary = `
                <strong>特徴:</strong> 周囲の車への譲り合いや、歩行者への配慮を怠らない親切なドライバーです。<br><br>
                <strong>強み:</strong> 荷役先での評判が良く、他のドライバーや会社との連携もスムーズです。<br><br>
                <strong>弱み:</strong> 周りの目を気にしすぎて、強引な車に道を譲り続け、自車の運行スケジュールを乱してしまうことがあります。
            `;
        } else if (totalScore >= 45) {
            status = "⚪ 【ポーカーフェイス】冷静沈着な鉄のメンタルタイプ";
            commentary = `
                <strong>特徴:</strong> 感情の起伏が少なく、他車の強引な割り込みや渋滞に巻き込まれてもイライラしません。<br><br>
                <strong>強み:</strong> 長距離運転や夜間運行でも精神的にバテにくく、常に一定のパフォーマンスを維持できます。<br><br>
                <strong>弱み:</strong> 周囲への関心が薄いため、荷役先（現場）でのコミュニケーションや挨拶が少し素っ気なくなることがあります。
            `;
        } else if (totalScore >= 25) {
            status = "🟡 【タイムキーパー】効率重視のベテランタイプ";
            commentary = `
                <strong>特徴:</strong> 時間管理やルート選定の能力に長けており、渋滞予測や抜け道の把握が得意です。<br><br>
                <strong>強み:</strong> 指定された時間に遅れることなく、常に最短・最効率で荷物を届けます。<br><br>
                <strong>弱み:</strong> スケジュールを急ぐあまり、車間距離が詰まったり、黄色信号で無理に交差点に進入したりするリスクを秘めています。
            `;
        } else {
            status = "🔴 【ハイリスク】感情優先のイケイケタイプ";
            commentary = `
                <strong>特徴:</strong> 運転技術に自信がある反面、自分のペースを乱されるとストレスを感じやすいタイプです。<br><br>
                <strong>強み:</strong> 荷役作業（手積み・手降ろしなど）のスピードが速く、馬力があります。<br><br>
                <strong>弱み:</strong> 前の車を煽るような挙動、急ブレーキ、速度超過などを起こしやすく、最も事故のリスクが高い要注意ジャンルです。
            `;
        }

        document.getElementById('result-status').innerHTML = status;
        document.getElementById('result-commentary').innerHTML = commentary;

        // ▼回答内訳の流し込み▼
        const breakdownHtml = userAnswers.map((ans, idx) => {
            if (!ans) return ''; 
            return `
                <div class="breakdown-item">
                    <div class="breakdown-q">Q${idx + 1}: ${ans.question}</div>
                    <div class="breakdown-a">回答: ${ans.answer} <span class="breakdown-s">(${ans.score}点)</span></div>
                </div>
            `;
        }).join('');
        document.getElementById('breakdown-container').innerHTML = breakdownHtml;

        showScreen('result');
    }
};

window.resetTest = function() {
    userAnswers = [];
    renderPastScores();
    showScreen('start');
};

async function boot() {
    await initDb();
    renderPastScores();
    showScreen('start');
}

boot();