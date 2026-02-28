const QUESTIONS = [
  {
    id: 'q1',
    text: 'HTMLの正式名称として正しいものはどれですか？',
    points: 10,
    options: [
      { label: 'Hyper Text Markup Language', value: 'a', correct: true },
      { label: 'High Transfer Machine Language', value: 'b', correct: false },
      { label: 'Hyper Transfer Main Link', value: 'c', correct: false }
    ]
  },
  {
    id: 'q2',
    text: 'JavaScriptが主に実行される場所として適切なのはどれですか？',
    points: 15,
    options: [
      { label: 'データベースのテーブル', value: 'a', correct: false },
      { label: 'ブラウザやNode.js実行環境', value: 'b', correct: true },
      { label: '画像ファイルそのもの', value: 'c', correct: false }
    ]
  },
  {
    id: 'q3',
    text: 'CSSの役割として最も適切なのはどれですか？',
    points: 20,
    options: [
      { label: 'Webページの見た目を定義する', value: 'a', correct: true },
      { label: 'サーバー証明書を発行する', value: 'b', correct: false },
      { label: 'HTTP通信を暗号化する', value: 'c', correct: false }
    ]
  }
];

const SUBMITTED_COOKIE = 'quiz_submitted';
const SCORE_COOKIE = 'quiz_score';

const quizForm = document.getElementById('quizForm');
const resultSection = document.getElementById('result');
const alreadyAnsweredSection = document.getElementById('alreadyAnswered');
const savedScoreElement = document.getElementById('savedScore');

init();

function init() {
  if (getCookie(SUBMITTED_COOKIE) === '1') {
    const savedScore = getCookie(SCORE_COOKIE);
    showAlreadyAnswered(savedScore);
    return;
  }

  renderQuiz();
}

function showAlreadyAnswered(savedScore) {
  alreadyAnsweredSection.classList.remove('hidden');
  quizForm.classList.add('hidden');
  resultSection.classList.add('hidden');

  if (savedScore) {
    savedScoreElement.textContent = `前回の得点: ${savedScore} 点`;
  }
}

function renderQuiz() {
  const maxScore = QUESTIONS.reduce((sum, question) => sum + question.points, 0);
  const intro = document.createElement('p');
  intro.textContent = `全${QUESTIONS.length}問 / 満点 ${maxScore} 点`;
  quizForm.appendChild(intro);

  QUESTIONS.forEach((question, index) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'question';

    const legend = document.createElement('legend');
    legend.textContent = `Q${index + 1}. ${question.text}（${question.points}点）`;
    fieldset.appendChild(legend);

    question.options.forEach((option) => {
      const label = document.createElement('label');
      label.className = 'option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = question.id;
      input.value = option.value;
      input.required = true;

      label.appendChild(input);
      label.append(` ${option.label}`);
      fieldset.appendChild(label);
    });

    quizForm.appendChild(fieldset);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = '回答を送信';
  quizForm.appendChild(submitButton);

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    gradeQuiz();
  });
}

function gradeQuiz() {
  let total = 0;

  QUESTIONS.forEach((question) => {
    const answer = new FormData(quizForm).get(question.id);
    const selected = question.options.find((option) => option.value === answer);

    if (selected && selected.correct) {
      total += question.points;
    }
  });

  const maxScore = QUESTIONS.reduce((sum, question) => sum + question.points, 0);

  resultSection.classList.remove('hidden');
  resultSection.innerHTML = `
    <h2>採点結果</h2>
    <p class="score">${total} / ${maxScore} 点</p>
    <p>回答ありがとうございました。このブラウザでは再回答できません。</p>
  `;

  setCookie(SUBMITTED_COOKIE, '1', 365);
  setCookie(SCORE_COOKIE, String(total), 365);

  Array.from(quizForm.elements).forEach((element) => {
    element.disabled = true;
  });
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const key = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    if (cookie.startsWith(key)) {
      return decodeURIComponent(cookie.substring(key.length));
    }
  }

  return null;
}
