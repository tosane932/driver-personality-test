let currentQuestionIndex = 0;
let userAnswers = [];

const quizContainer = document.getElementById('quiz-container');
const resultArea = document.getElementById('result-area');
const totalScoreSpan = document.getElementById('total-score');
const resultStatusDiv = document.getElementById('result-status');
const resultCommentaryDiv = document.getElementById('result-commentary');
const breakdownContainer = document.getElementById('breakdown-container');

// クイズの初期化画面を生成する関数
function initQuiz() {
    // 既存のカードをクリア（リセット時に重複生成されるのを防ぐ）
    quizContainer.innerHTML = '';
    
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

// 選択肢をクリックしたときの処理
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

// 診断結果を表示する関数（20点刻みの5段階判定にリファクタリング済み）
function showResult() {
    quizContainer.style.display = 'none';
    resultArea.style.display = 'block';

    const totalScore = userAnswers.reduce((sum, ans) => sum + ans.score, 0);
    totalScoreSpan.innerText = totalScore;

    let status = "";
    let commentary = "";

    // 20点刻みの厳格な5段階判定ロジック
    if (totalScore >= 80) {
        status = "判定：🏆 プラチナ・プロフェッショナル（80点以上）";
        commentary = "完璧な防衛運転の体現者です。リスクの予測、自身の疲労管理、悪天候への適応など、あらゆる場面で客観的かつ論理的な最適解を選択できています。現場でも模範となる最高峰のドライバーです。";
    } else if (totalScore >= 60) {
        status = "判定：🏅 優秀セーフティドライバー（60〜79点）";
        commentary = "プロとして高い安全意識と現場のセオリーをしっかりと実行できています。一般的な安全水準は十分にクリアしていますが、特定のシチュエーションでわずかにリスクを許容している部分がないか見直す余地があります。";
    } else if (totalScore >= 40) {
        status = "判定：⚠️ 一般ドライバー・要警戒（40〜59点）";
        commentary = "標準的な運転はできていますが、時間的な焦りや周囲の状況によっては判断の基準が甘くなる場面があります。プロの防衛運転として求められる「もらい事故の防止」の意識をもう一段高める必要があります。";
    } else if (totalScore >= 20) {
        status = "判定：🟡 イエローカード（20〜39点）";
        commentary = "感情の波や現場の焦りが直接運転操作に影響を及ぼし始めています。潜在的な事故リスクが非常に高い状態です。車間距離の確保や確認動作の徹底を即座に見直してください。";
    } else {
        status = "判定：🔴 レッドカード（20点未満）";
        commentary = "非常に危険な運転傾向が見られます。重大事故に直結するリスクを許容、あるいは軽視している可能性が高いです。プロとしての自覚と防衛運転の基本（安全速度・車間距離・下車確認など）を根本から叩き直す必要があります。";
    }

    resultStatusDiv.innerText = status;
    resultCommentaryDiv.innerText = commentary;

    // スコアバッジの色分け用マッピング
    const scoreClassMap = {
        '2': 'score-p2',
        '1': 'score-p1',
        '0': 'score-0',
        '-1': 'score-m1',
        '-2': 'score-m2',
        '-3': 'score-m3'
    };

    // 回答内訳の生成
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

// クイズを最初からやり直すリセット関数
window.resetQuiz = function() {
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 画面表示の切り替え
    resultArea.style.display = 'none';
    quizContainer.style.display = 'block';
    
    // クイズ画面の再生成と最初の質問のアクティブ化
    initQuiz();
    
    // ページ最上部へスムーズにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 初期化実行
initQuiz();