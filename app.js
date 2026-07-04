let currentQuestionIndex = 0;
let userAnswers = [];

const quizContainer = document.getElementById('quiz-container');
const resultArea = document.getElementById('result-area');
const totalScoreSpan = document.getElementById('total-score');
const resultStatusDiv = document.getElementById('result-status');
const resultCommentaryDiv = document.getElementById('result-commentary');
const breakdownContainer = document.getElementById('breakdown-container');

function initQuiz() {
    quizData.forEach((qData, index) => {
        const card = document.createElement('div');
        card.className = `quiz-card ${index === 0 ? 'active' : ''}`;
        card.id = `question-${index}`;

        card.innerHTML = `
            <div class="progress-bar">質問 ${index + 1} / ${quizData.length}</div>
            <span class="category-badge">${qData.category}</span>
            <div class="question-text">${qData.question}</div>
            <ul class="options-list">
                ${qData.options.map((opt, oIdx) => `
                    <li class="option-item">
                        <button class="option-btn" onclick="selectOption(${index}, ${oIdx})">${opt.text}</button>
                    </li>
                `).join('')}
            </ul>
        `;
        quizContainer.appendChild(card);
    });
}

window.selectOption = function(qIdx, oIdx) {
    const selectedOption = quizData[qIdx].options[oIdx];
    userAnswers.push({
        question: quizData[qIdx].question,
        answer: selectedOption.text,
        score: selectedOption.score
    });

    document.getElementById(`question-${qIdx}`).classList.remove('active');
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        document.getElementById(`question-${currentQuestionIndex}`).classList.add('active');
    } else {
        showResult();
    }
};

function showResult() {
    quizContainer.style.display = 'none';
    resultArea.style.display = 'block';

    const totalScore = userAnswers.reduce((sum, ans) => sum + ans.score, 0);
    totalScoreSpan.innerText = totalScore;

    let status = "";
    let commentary = "";

    // 厳格な判定ロジック
    if (totalScore >= 95) {
        status = "判定：プロフェッショナル（95〜100点）";
        commentary = "すべての運行シチュエーションにおいて、突発的なリスクや自身の体調変化に対する予測・管理が客観的かつ論理的に行えています。現場の状況に左右されず、常に一貫した防衛運転を選択できる状態です。";
    } else if (totalScore >= 80) {
        status = "判定：プロフェッショナル（80〜94点）";
        commentary = "プロとして高い安全意識と判断力を有しています。現場のセオリーを高い水準で実行できていますが、満点に満たない部分は、特定のシチュエーション（疲労時や悪天候時など）における微細なリスク許容が影響している可能性があります。";
    } else if (totalScore >= 60) {
        status = "判定：優秀ドライバー（60〜79点）";
        commentary = "一般的な安全水準を十分にクリアしている優秀な状態です。ただし、時間的な焦りや周囲の状況によっては、ややリスクを許容した選択をしてしまう傾向が一部に見られます。";
    } else if (totalScore > 50) {
        status = "判定：一般ドライバー・要警戒（51〜59点）";
        commentary = "標準的な運転操作はできていますが、プロの防衛運転として求められる「もらい事故の防止」や「死角の完全な排除」に対して、判断の基準が甘くなる場面があります。";
    } else {
        status = "判定：イエローカード（50点以下）";
        commentary = "感情の波や状況の焦りが直接運転操作に影響しており、事故を引き起こす潜在的リスクが高い状態です。確認動作の徹底と車間距離の確保を即座に見直す必要があります。";
    }

    resultStatusDiv.innerText = status;
    resultCommentaryDiv.innerText = commentary;

    // スコアバッジ用マッピング
    const scoreClassMap = {
        '2': 'score-p2',
        '1': 'score-p1',
        '0': 'score-0',
        '-1': 'score-m1',
        '-2': 'score-m2',
        '-3': 'score-m3'
    };

    breakdownContainer.innerHTML = userAnswers.map((ans, idx) => {
        const scoreClass = scoreClassMap[ans.score.toString()] || 'score-0';

        return `
            <div class="breakdown-item">
                <div class="breakdown-q">問${idx + 1}. ${ans.question}</div>
                <div class="breakdown-a">あなたの回答: ${ans.answer}</div>
                <div>評価: <span class="score-badge ${scoreClass}">${ans.score >= 0 ? '+' : ''}${ans.score} 点</span></div>
            </div>
        `;
    }).join('');
}

// 初期化実行
initQuiz();