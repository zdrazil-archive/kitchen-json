var foods = jsonObject.foods;
var resultFood = [];
var resultFoodsDesc = [];
var delayTimer = 0;
var selectedElement = "empty";

function cleanList(selectList) {
    while (selectList.hasChildNodes()) {
        selectList.removeChild(selectList.lastChild);
    }
}

function populateFoodChoices(choicesArray) {
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

function populateFromChoices(chosenFoodDesc) {
    var fromChoicesDict = getJsonForFoodDict(chosenFoodDesc);
    var selectList = document.getElementById('convertFromList');
    cleanList(selectList);
    for (var choice in fromChoicesDict) {
        option = document.createElement("option");
        option.textContent = choice;
        option.value = fromChoicesDict[choice];
        selectList.add(option);
    }
}

function getJsonForFoodDict(foodDescription) {
    var fromChoicesDict = {};
    var foodFound = false;
    for (var food in foods) {
        var longDescription = foods[food].long_desc;
        if (foodFound) {
            break;
        } else if (foodDescription === longDescription) {
            var key = foods[food].msre_desc;
            var keyValue = foods[food].gm_wgt;
            fromChoicesDict[key] = keyValue;
        }
    }
    return fromChoicesDict;
}

function populateToChoices() {
    var selectList = document.getElementById('convertToList');
    cleanList(convertToList);
    for (var conversion in conversions) {
        option = document.createElement("option");
        option.textContent = conversion;
        option.value = conversions[conversion];
        selectList.add(option);
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
            if (k > 30) {
                break;
            }
            if (resultFoodsDesc[food].toLowerCase().includes(searchQuery.toLowerCase())) {
                filteredFood.push(resultFoodsDesc[food]);
                k++;
            }
        }
        populateFoodChoices(filteredFood);

        var ul = document.getElementById('foodList');
        ul.onclick = function(event) {
            var target = getEventTarget(event);
            var selectedFoodDesc = target.innerHTML;
            populateFromChoices(selectedFoodDesc);
            populateToChoices();

            if (selectedElement !== "empty") {
                if (selectedElement.tagName === 'A') {
                    selectedElement.parentElement.removeAttribute("id", "selected-food");
                } else if (selectedElement.tagName === 'LI') {
                    selectedElement.removeAttribute("id", "selected-food");
                }
            }

            selectedElement = target;
            if (target.tagName === 'A') {
               target.parentElement.setAttribute("id", "selected-food"); 
            } else if (target.tagName === 'LI') {
                target.setAttribute("id", "selected-food");
            }

            // scrollToSettings();
        };
    }, 100);
}

resultFoodsDesc = fetchFoodDesc(foods);
resultFoodsDesc = dedupArray(resultFoodsDesc);

// Conversion

var conversions = {
    "kilograms": 0.001,
    "miligrams": 1000,
    "grams": 1,
    "ounce": 0.035274,
    "pounds": 0.0022046
};

function getConversionResult(valueFrom, valueTo, conversionUnit) {
    return valueFrom * valueTo * conversionUnit;
    // if (switchedValues) {
    //     return (valueFrom / valueTo) / conversionUnitValue;
    // } else {
    //     return valueFrom * valueTo * conversionUnit;
    // }
}

function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

function calculateClick() {
    var conversionUnit = document.getElementById("convertFromList").value;
    var valueFrom = document.getElementById('convertFromValue').value;
    var valueTo = document.getElementById("convertToList").value;

    if (valueFrom === null) {
        window.alert("Please enter both ");
    } else {
        var result = document.getElementById('result');
        var resultValue = getConversionResult(valueFrom,
            valueTo,
            conversionUnit);
        var preText = "It weights";
        var selectElement = document.getElementById("convertToList");

        var ConvertToText = selectElement.options[selectElement.selectedIndex].text;
        result.textContent = preText + ' ' + resultValue + ' ' + ConvertToText + '.';
        // result.textContent = getConversionResult(valueFrom,
        //     valueTo,
        //     conversionUnit);
    }
}

// Scroll to settings
function scrollToSettings() {
    document.getElementById("convertFromList").scrollIntoView({
        behavior: 'smooth'
    });
}


