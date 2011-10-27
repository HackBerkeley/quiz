require.paths.unshift('./node_modules')

var nowjs = require('now');
var express = require('express');
var fs = require('fs');
var app =  express.createServer();

var mongo = require('mongoskin');

var timer = 0; // javascript timer
var currentQ = -1; // index


var listQ = [
  {question: 'what is 3+3', answer: ['6', 'six'], time: 30},
  {question: 'what is 4+4', answer: ['9', 'eight'], time: 30},
  {question: 'what is 5+5', answer: ['10', 'ten'], time: 30},
  {question: 'what is 6+6', answer: ['12', 'twelve'], time: 30},
]; // array of questions

mongo.db('heroku:hackers@staff.mongohq.com:10065/app1491090').collection('quiz').find().toArray(function(err, items){
    listQ = items;
});

var scores = {}; // unique userids to objects which contain questionids mapped to scores.
var winners = [];
var timeLeft;
var intervalTimer = 0;

// string question, keywords that answer the question (array), time (int), optional key field (project, order, etc).

// Initialize main server
app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req,res){
  res.redirect('/index.htm');
});

app.listen(process.env.PORT || 8082);

var everyone = nowjs.initialize(app);

everyone.now.next = function(i) {
  clearTimeout(timer);
  clearInterval(intervalTimer);
  
  if(i !== undefined) {
    currentQ = i;
  } else {
    currentQ += 1;
  }
  console.log(currentQ);
  var current = listQ[currentQ];
  everyone.now.broadcast(current.question, current.time);
  winners = [];
  timer = setTimeout(function () { everyone.now.disable(); clearInterval(intervalTimer); }, current.time * 1000);
  timeLeft = current.time;
  intervalTimer = setInterval(function () { timeLeft -= 1; }, 1000);
  this.now.nextQ(current.question, currentQ);
}

everyone.now.guess = function(g) {
  var current = listQ[currentQ];
  for (var i in current.answer) {
    if (g.indexOf(current.answer[i]) > -1) {
      if (winners.length < 3) {
        someoneWon(this);
      }
      return true;
    }
  }
  this.now.wrongAns();
}

function updateDash () {
  var data = {};
  for(var id in scores) {
    data[id] = 0;
    for(var j in scores[id]) {
      data[id] += scores[id][j];
    }
  }
  everyone.now.updateTable(data);
}

someoneWon = function(self) {
  winners.push(self);
  var place = winners.length;
  if(!scores[self.now.name]) {
    scores[self.now.name] = {};
  }
  scores[self.now.name][listQ[currentQ].question] = timeLeft + 20;
  everyone.now.declareWinner(place, self.now.name, self.user.clientId);
  updateDash();
  self.now.correct();
  if (place == 3) {
    clearInterval(intervalTimer);
    clearTimeout(timer);
    everyone.now.disable();
  }
}

