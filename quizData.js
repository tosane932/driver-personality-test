:root {
    --primary-color: #2c3e50;
    --accent-color: #16a085;
    --bg-color: #f5f6fa;
    --card-bg: #ffffff;
    --text-color: #333333;
    --danger-color: #c0392b;
    --warning-color: #d35400;
    --success-color: #27ae60;
}

body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
}

.container {
    max-width: 700px;
    width: 100%;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

h1 {
    color: var(--primary-color);
    font-size: 1.8rem;
}

.quiz-card {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    display: none;
}

.quiz-card.active {
    display: block;
}

.category-badge {
    background-color: var(--accent-color);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 10px;
}

.question-text {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
    line-height: 1.5;
}

.options-list {
    list-style: none;
    padding: 0;
}

.option-item {
    margin-bottom: 12px;
}

.option-btn {
    width: 100%;
    text-align: left;
    padding: 14px 20px;
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.option-btn:hover {
    background-color: #e2e6ea;
    border-color: #ced4da;
}

#result-area {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: none;
}

.result-header {
    text-align: center;
    margin-bottom: 25px;
}

.score-display {
    font-size: 3rem;
    font-weight: bold;
    color: var(--accent-color);
    margin: 10px 0;
}

.result-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 15px;
}

.result-desc {
    line-height: 1.6;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 30px;
    white-space: pre-wrap;
    text-align: left;
}

.breakdown-title {
    font-size: 1.2rem;
    font-weight: bold;
    border-left: 5px solid var(--primary-color);
    padding-left: 10px;
    margin-bottom: 15px;
    color: var(--primary-color);
}

.breakdown-item {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
    text-align: left;
}

.breakdown-q {
    font-weight: bold;
    margin-bottom: 8px;
}

.breakdown-item:nth-child(even) {
    background-color: #fafbfc;
}

.breakdown-a {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 5px;
}

.score-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.85rem;
}
.score-p2 { background-color: #e8f8f5; color: var(--success-color); }
.score-p1 { background-color: #eaf2f8; color: #2980b9; }
.score-0  { background-color: #f4f6f7; color: #7f8c8d; }
.score-m1 { background-color: #fef9e7; color: var(--warning-color); }
.score-m2 { background-color: #fdebd0; color: #e67e22; }
.score-m3 { background-color: #fadbd8; color: var(--danger-color); }

.progress-bar {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 15px;
    text-align: right;
}