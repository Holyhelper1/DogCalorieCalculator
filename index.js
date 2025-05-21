document.getElementById("calculate").addEventListener("click", function () {
  const age = document.getElementById("age").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const caloriesPerKilogram = parseFloat(
    document.getElementById("calories").value
  );
  const activity = parseFloat(document.getElementById("activity").value);

  let calories;
  if (age == 0 || age == 1) {
    calories = 2 * (70 * Math.pow(weight, 0.75)); 
  } else {
    calories = 2 * (30 * weight + 70); 
  }

  const caloricNeeds = calories * activity;
  const foodPerGram = 1000 / caloriesPerKilogram;

  const dailyFood = caloricNeeds * foodPerGram;

  if (isNaN(weight) || isNaN(caloriesPerKilogram)) {
    console.log("test");
    return (document.getElementById("result").innerHTML =
      "Вес или калорийность корма не указаны!");
  } else {
    

    document.getElementById(
      "result"
    ).innerText = `Вам нужно давать ${dailyFood.toFixed(
      2
    )} грамм корма в день.`;
  }
});
