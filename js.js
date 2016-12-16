var foods = jsonObject.foods;
var resultFood = [];
var resultFoodsDesc = [];
var delayTimer = 0;

function cleanList(selectList) {
    while (selectList.hasChildNodes())
        selectList.removeChild(selectList.lastChild);
}

function populateChoices(choicesArray) {
    var selectList = document.getElementById('foodList');
    cleanList(selectList);
    for (var choice in choicesArray) {
        var a = document.createElement('a');
        var entry = document.createElement('li');
        a.textContent = choicesArray[choice];
        entry.appendChild(a);
        selectList.appendChild(entry);
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

resultFoodsDesc = fetchFoodDesc(foods);
resultFoodsDesc = dedupArray(resultFoodsDesc);