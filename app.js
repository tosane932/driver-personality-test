let currentQuestionIndex = 0;
let userAnswers = [];
const quizContainer = document.getElementById('quiz-container');

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initQuiz() {
    quizContainer.innerHTML = '';
    quizData.forEach((qData, index) => {
        const card = document.createElement('div');
        card.className = `quiz-card ${index === 0 ? 'active' : ''}`;
        card.id = `question-${index}`;

        const progress = ((index) / quizData.length) * 100;
        const shuffledOptions = shuffleArray(qData.options);

        card.innerHTML = `
            <div class="progress-container"><div class="progress-bar" style="width: ${progress}%"></div></div>
            <div style="font-size:0.8rem; color:#636e72;">質問 ${index + 1} / ${quizData.length}</div>
            <div class="question-text">${qData.question}</div>
            <ul style="list-style:none; padding:0;">
                ${shuffledOptions.map((opt, oIdx) => `
                    <li><button class="option-btn" onclick="handleAnswer(${index}, ${oIdx}, '${opt.text.replace(/'/g, "\\'")}', ${opt.score})">${opt.text}</button></li>
                `).join('')}
                <li><button class="option-btn skip-btn" onclick="handleAnswer(${index}, -1, '回答なし', 0)">状況が判断できない／該当なし</button></li>
            </ul>
        `;
        quizContainer.appendChild(card);
    });
}

// 画面切り替え（start / quiz / result）をまとめて管理する関数
function showScreen(screen) {
    document.getElementById('start-screen').style.display = screen === 'start' ? 'block' : 'none';
    document.getElementById('quiz-container').style.display = screen === 'quiz' ? 'block' : 'none';
    document.getElementById('back-to-top-link').style.display = screen === 'quiz' ? 'block' : 'none';
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

window.startQuiz = function() {
    userAnswers = [];
    initQuiz();
    showScreen('quiz');
};

window.handleAnswer = function(qIdx, oIdx, text, score) {
    userAnswers[qIdx] = { question: quizData[qIdx].question, answer: text, score: score };
    document.getElementById(`question-${qIdx}`).classList.remove('active');

    if (qIdx + 1 < quizData.length) {
        document.getElementById(`question-${qIdx + 1}`).classList.add('active');
    } else {
        const totalScore = userAnswers.reduce((sum, a) => sum + (a ? a.score : 0), 0);
        document.getElementById('total-score').textContent = totalScore;
        saveScore(totalScore);
        // ※ result-status（慎重堅実型／バランス型／攻めの実践型）の判定ロジックはまだ未実装だよ
        showScreen('result');
    }
};

window.resetQuiz = function() {
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