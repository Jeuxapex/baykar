function fetchQuestions() {
  return fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => data.slice(0, 10))
    .catch(error => {
      console.error('Soru verileri çekilirken bir hata oluştu:', error);
      return [];
    });
}
function generateChoices(question) {
  const choices = ['A', 'B', 'C', 'D'];
  return choices.sort()
    .map((choice, index) => ({
      id: `${question.id}-${index}`,
      content: `${choice}. ${getRandomWord(question.body)}`
    }));
}

function getRandomWord(text) {
  const words = text.split(' ');
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}
function createQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  const resultsContainer = document.getElementById('results-container');
  const questionNumber = document.getElementById('question-number');
  const questionText = document.getElementById('question');
  const choicesList = document.getElementById('choices');
  const timerContainer = document.getElementById('timer-container');
  const timerElement = document.getElementById('timer');
  const nextButton = document.getElementById('next-button');
  const resultsBody = document.getElementById('results-body');

  let questions = [];
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let timer = null;
  function startTimer() {
    let time = 30;
    timerElement.textContent = time;
  
    timer = setInterval(() => {
      time--;
      timerElement.textContent = time;
  
      if (time === 20) {
        timerContainer.classList.add('active');
        nextButton.disabled = false; 

      }
  
      if (time === 0) {
        clearInterval(timer);
        nextQuestion();
      }
    }, 1000);
  }
  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    const choices = question.choices;
  
    questionNumber.textContent = `Soru ${currentQuestionIndex + 1}`;
    questionText.textContent = question.title;
  
    choicesList.innerHTML = '';
    choices.forEach(choice => {
      const li = document.createElement('li');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = choice.id;
  
      li.appendChild(input);
      li.appendChild(document.createTextNode(choice.content));
      choicesList.appendChild(li);
    });
  
    nextButton.disabled = true;
  
    startTimer();
  }
  

  function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const answer = selectedAnswer ? selectedAnswer.value : '';
    clearInterval(timer);

    userAnswers.push(answer);
    currentQuestionIndex++;
  
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      displayResults();
    }
    
    nextButton.disabled = true; 
  }
  
  function displayResults() {
    clearInterval(timer);
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    userAnswers.forEach((answer, index) => {
      const question = questions[index];
      const resultRow = document.createElement('tr');
      const questionCell = document.createElement('td');
      const answerCell = document.createElement('td');

      questionCell.textContent = question.title;
      answerCell.textContent = answer ? question.choices.find(choice => choice.id === answer).content : '-';

      resultRow.appendChild(questionCell);
      resultRow.appendChild(answerCell);
      resultsBody.appendChild(resultRow);
    });
  }

  nextButton.addEventListener('click', nextQuestion);
  fetchQuestions().then(data => {
    questions = data.map(question => ({
      id: question.id,
      title: question.title,
      choices: generateChoices(question)
    }));

    displayQuestion();
    nextButton.disabled = true; 
  });
}
createQuiz();
