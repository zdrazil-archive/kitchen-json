var foods = jsonObject.foods;
var resultFood = [];
var resultFoodsDesc = [];
var delayTimer = 0;
var selectList = document.createElement("select");

function createList() {
    var myDiv = document.getElementById("foodResults");
    selectList.id = "mySelect";
    myDiv.appendChild(selectList);
}

function cleanList() {
    while (selectList.hasChildNodes())
        selectList.removeChild(selectList.lastChild);
}

function populateChoices(choicesArray) {
    cleanList();
    for (var choice in choicesArray) {
        var option = document.createElement("option");
        option.value = choicesArray[choice];
        option.text = choicesArray[choice];
        selectList.appendChild(option);
        console.log(option);
    }
}

function fetchFoodDesc(foodsArray) {
    fetchedDesc = [];
    for (var food in foodsArray) {
        var longDescription = foods[food].long_desc;
        fetchedDesc.push(longDescription);
    }
    return fetchedDesc;
}

function dedupArray(inputArray) {
    var deduped = inputArray.filter(function(el, i, arr) {
        return arr.indexOf(el) === i;
    });
    return deduped;
}

function searchFood(searchQuery) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        var filteredFood = [];
        var k = 0;
        for (var food in resultFoodsDesc) {
            if (k > 20) {
                break;
            }
            if (resultFoodsDesc[food].toLowerCase().includes(searchQuery.toLowerCase())) {
                filteredFood.push(resultFoodsDesc[food]);
                k++;
            }
        }
        populateChoices(filteredFood);
    }, 100);
}

createList();
resultFoodsDesc = fetchFoodDesc(foods);
resultFoodsDesc = dedupArray(resultFoodsDesc);