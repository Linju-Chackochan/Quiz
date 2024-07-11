let quizData;
let sectionHeader;
let mainContainer;
let loadingContainer;
let currentQuestion = 0;            //Question Counter
let currentSection = 0;             //Section Counter
let optionArea;
let palletArea;
let totalTime;
let time = 60;
let submitExam;



async function getExamData() {                                          //Asynchronous Function
  let link = 'https://dreamthemonline.com/sample/getNewQuizData/600';   //Link of API data fetch from server
  fetch(link).then((value) => {                                         //value is the string  from server
    return value.json();                                                //link value converting string to JSON
    // // console.table(quizData);
  }).then((vale) => {                                                   //after convertion what to do
    quizData = vale;                                                  //assigning these values to quizData
    // console.table(quizData);
    displayQuizArea();
    updateSectionHeader();
    updateQuestion();
    updateOptions();
    displayPallete();
    timeFunction();
    legendCount();
    questionTimer();
    submitExam = document.getElementById('submitExam');       //When submit button is clicked examFinished() is called
    submitExam.addEventListener('click', () => {
      examFinished();
    })
  })
}
getExamData();

function examFinished() {                       //what happens when submit button is clicked
  console.log('finished');
  loadingContainer.innerHTML = '';            //to not display the loading container
  loadingContainer.innerHTML = '<div class="submit">Thank you for attending the exam.See you later</div>';      //div is created to display the message
  loadingContainer.style.display = 'block';       //Display the loadingContainer 
  sectionHeader.style.display = 'none';           //dont display sectionHeader
  mainContainer.style.display = 'none';           //dont display mainContainer
}

function displayQuizArea() {
  loadingContainer = document.getElementById('loading-container');
  loadingContainer.style.display = 'none';
  sectionHeader = document.getElementById('section-header');
  sectionHeader.style.display = 'block';
  mainContainer = document.getElementById('main-container');
  mainContainer.style.display = 'flex';
}
function updateSectionHeader() {        //to display section titles
  sectionHeader.innerHTML = '';     //blank
  for (i = 0; i < quizData.sections.length; i++) {
    if (i == currentSection) {      //When the positions are equal blue color should come
      sectionHeader.innerHTML += `<button class="section-btn section-btn-active" onclick="sectionButtonClicked(${i})">${quizData.sections[i].title}</button>`;
    }
    else {
      sectionHeader.innerHTML += `<button class="section-btn" onclick="sectionButtonClicked(${i})">${quizData.sections[i].title}</button>`;
    }
  }
}
function sectionButtonClicked(pos) {
  currentSection = pos;
  currentQuestion = 0;          //when each section is clicked display the first question
  updateQuestion();
  updateOptions();
  displayPallete();
  legendCount();
  updateSectionHeader();
}
function updateQuestion() {
  questionCounter = document.getElementById('question-counter');
  questionCounter.innerHTML = `Question no ${currentQuestion + 1}`;
  questions = document.getElementById('question');
  questions.innerHTML = quizData.sections[currentSection].data[currentQuestion].question;
}
function updateOptions() {
  optionArea = document.getElementById('options')
  optionArea.innerHTML = '';
  // console.log(quizData.sections[currentSection].data[currentQuestion].userSelectedOptions);
  for (i = 0; i < quizData.sections[currentSection].data[currentQuestion].options.length; i++) {
    // console.log(quizData.sections[currentSection].data[currentQuestion].options[i].option);
    if (quizData.sections[currentSection].data[currentQuestion].options[i].option == quizData.sections[currentSection].data[currentQuestion].userSelectedOptions[0]) {
      optionArea.innerHTML += `<li class="option selected" onClick="selectOption(${i})" >${quizData.sections[currentSection].data[currentQuestion].options[i].value}</li>`;
    } else {
      optionArea.innerHTML += `<li class="option" onClick="selectOption(${i})" >${quizData.sections[currentSection].data[currentQuestion].options[i].value}</li>`;
    }
  }
}
function selectOption(pos) {
  let opti = document.querySelectorAll('.option');      //node list
  // console.clear();
  opti.forEach((eachOption) => {
    eachOption.classList.remove('selected')
  });
  opti[pos].classList.add('selected')
  quizData.sections[currentSection].data[currentQuestion].userSelectedOptions = [quizData.sections[currentSection].data[currentQuestion].options[pos].option];
  console.log(quizData.sections[currentSection].data[currentQuestion].userSelectedOptions)
}
function displayPallete() {
  palletArea = document.getElementById('question-pallete-area');
  palletArea.innerHTML = '';
  for (i = 0; i < quizData.sections[currentSection].data.length; i++) {
    // console.log(quizData.sections[currentSection].data)
    if (quizData.sections[currentSection].data[i].userSelectedOptions.length > 0) {
      palletArea.innerHTML += `<button class="pallete-btn pallete-btn-success" onClick="questionPalleteOnclick(${i})">${i + 1}</button>`
    } else {
      palletArea.innerHTML += `<button class="pallete-btn" onClick="questionPalleteOnclick(${i})">${i + 1}</button>`

    }
  }
}

function questionPalleteOnclick(pos) {
  currentQuestion = pos;
  updateQuestion();
  updateOptions();
}


function nextQuestion() {
  optionSaverApi();
  if (currentQuestion < quizData.sections[currentSection].data.length - 1) {
    currentQuestion++;
    // displayQuizArea();
    updateQuestion();
    updateOptions();
    displayPallete();
    legendCount();


  } else {
    // console.log("end of section")
  }
}

function previousQuestion() {
  optionSaverApi();
  if (currentQuestion > 0) {
    currentQuestion--;
    // displayQuizArea(); '0000
    updateQuestion();
    updateOptions();
    displayPallete();
    legendCount();

  }

}

async function optionSaverApi() {       //sending details to API(time,selcted option,question ID)
  console.log('sent the data to server', quizData.sections[currentSection].data[currentQuestion].questionID, quizData.sections[currentSection].data[currentQuestion].userSelectedOptions, quizData.sections[currentSection].data[currentQuestion].userSpentTime)
}

function timeFunction() {
  let totalTime = document.getElementById('total-time');
  totalTime.innerHTML = time;
  setInterval(() => {
    if (time >= 1) {
      time--;
      totalTime.innerHTML = time;
      // console.log(time)
    } else {
      examFinished();
    }
  }, 60000);
}

// function displayInitialTime() {
//   let totalTime = document.getElementById('total-time');
//   totalTime.innerHTML = time;


// }
// let attended = 0;
// let unAttended = 0;
// let unAnswered = 0;
// let attended = 0;
// let unAttended = 0;
// let unAnswered = 0;
function questionTimer() {
  setInterval(() => {
    // console.clear();
    quizData.sections[currentSection].data[currentQuestion].userSpentTime++;
    // console.table(quizData.sections[currentSection].data)
  }, 1000);
}

function legendCount() {          //function to show the counts of Un-attended and Answered
  let attended = 0;
  let unAttended = 0;
  let unAnswered = 0;
  attended_element = document.querySelector('.attended');
  unAnswered_element = document.querySelector('.unattended');
  for (i = 0; i < quizData.sections[currentSection].data.length; i++) {
    if (quizData.sections[currentSection].data[i].userSelectedOptions.length > 0) {
      attended++;
      // console.log(attended);
    } else {
      unAnswered++;
      // console.log(unAnswered);
    }
  }
  attended_element.innerHTML = attended;
  unAnswered_element.innerHTML = unAnswered;
}
//1min=60s
//i hour=3600s
//total sec=7200s
//Math.floor=