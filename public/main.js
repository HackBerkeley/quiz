function begin(){
  var timeLeft = 90;
  var timer;

  now.correct = function(){ 
    modal('Nice you got it right!'); 
  }

  function modal(msg) {
    $('#modal #text').text(msg);
    $('#modal').show();
  }

  function hideModal() {
    $('#modal').hide();
  }


  var wrong =  ['You\'re doing it wrong. Stop doing it wrong.','Keyboard error: please type the right letters.','Error 0xDEADBEEF : Unknown fatal error','That answer is against my programming.','Error: There is an error in your answer.','You can\'t have your wrong answer and eat it too.','Your answer is beyond help.','Your answer will not receive sponsorship from Flotype.','Kernel panic! Man all lifeboats! Women and children first!','#f','There are wrong answers. Yours is one.','0','No.','Not enough memory to display the error m'];
  var wrongI = 0;

  now.wrongAns = function(){
      if(wrongI >= wrong.length) {
        wrongI == 0;
      } else {
        wrongI++;
      }
      $('#result').html(wrong[wrongI]); 
      $("#result").stop().css({opacity: 0}).animate({opacity: 1});
  }


  function refreshTime(){
      $('.time').html(timeLeft);
  }

  now.declareWinner = function(place, name, id){
     if(place == 1) {
      var msg = $("<p>"+name+" just placed 1st!</p>");    
     } else if(place == 2) {
      var msg = $("<p>"+name+" just got 2nd</p>");   
     } else if(place == 3) {
      var msg = $("<p>"+name+" just placed 3rd</p>");
     }
     $('#result').html(msg); 
     $("#result").stop().css({opacity: 0}).animate({opacity: 1});
  }


  now.disable = function(){
      clearInterval(timer);
      modal('Rounds over');
  }

  now.broadcast = function(question, time){
    clearInterval(timer);
    $("#result").css({opacity: 0});
    $("#answer").val('');
    hideModal();
    timeLeft = time;
    refreshTime();
    timer = setInterval(function(){timeLeft--; refreshTime();}, 1000);
  }

  $(document).ready(function(){
    $("#answer").keypress(function(e){
      if(e.which === 13) {
        now.guess($(this).val());
        $(this).val('');
      }
    });
    now.name = 'asdf'+ (new Date() - 0);
  });
  
  modal('Round is starting soon');
  
}

$(document).ready(function(){
  $("#name").keypress(function(e){
    if(e.which === 13 && $(this).val().length > 0) {
      now.name = $(this).val();
      begin();
    }
  });
});