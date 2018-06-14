function Lotto() {
  var lotto = new Array(6); // New array
  var count = 0; // Num of generated lottery
  var overl = true; // Check duplicate numbers

  while (count < 6) {
    var number = 0;
    number = parseInt(Math.random() * 45) + 1; // Get random number between 1~45

    for (var i = 0; i < count; i++) { // check duplicates
      if (lotto[i] == number) { // If not duplicate continue
        overl = false;
      }
    }

    if (overl) { // Increase count
      lotto[count] = number; // Append number
      count++;
    }

    overl = true;
  }

  var lottery_numbers = lotto[0] + ', ' + lotto[1] + ', ' + lotto[2] + ', ' + lotto[3] + ', ' + lotto[4] + ', ' + lotto[5];
  return lottery_numbers;

}

//context.session.randomLotto = Lotto();
var new_lottery = Lotto();
console.log(Lotto());

//callback();
