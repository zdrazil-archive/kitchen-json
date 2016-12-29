var foods = jsonObject.foods;
var selectedElement = "empty";
var timer;


// Food to convert list

// Remove all entries
function cleanList(selectList) {
    while (selectList.hasChildNodes()) {
        selectList.removeChild(selectList.lastChild);
    }
}

// Insert foods to convert entries from array
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

// Insert convert from units as options to a list 
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

// Show selected food in Food you've selected for conversion: 
function populateChosenFood(chosenFoodDesc) {
    var element = document.getElementById("chosenFood").innerHTML = chosenFoodDesc;
}

// Get units of a given food description from JSON and return as a dictionary
// For usage in function populateFromChoices
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

// Insert units from conversion array
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

// Get food descrtipns from foods array, that was imported from JSON file
function fetchFoodDesc(foodsArray) {
    fetchedDesc = [];
    for (var food in foodsArray) {
        var longDescription = foods[food].long_desc;
        fetchedDesc.push(longDescription);
    }
    return fetchedDesc;
}

// Remove duplicates from an array
function dedupArray(inputArray) {
    var deduped = inputArray.filter(function(el, i, arr) {
        return arr.indexOf(el) === i;
    });
    return deduped;
}

function searchFood(searchQuery) {
    // Show spinning wheel
    if (document.getElementsByClassName('spinner').length === 0) {
                spinningWheelShow();
    }

    // Fuse.js search
    var options = {
      shouldSort: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      keys: []
    };

    var searchableList;
    searchableList = foodsDesc;
    
    var fuse = new Fuse(searchableList, options); // "list" is the item array
    var foodSearchResult = fuse.search(searchQuery);

    filteredFood = [];
    for (var food in foodSearchResult) {
        filteredFood.push(foodsDesc[foodSearchResult[food]]);
    }
    
    // Insert results to a foods to convert list and hide spinner
    spinningWheelStop();
    populateFoodChoices(filteredFood);
       
}

function delayedSearchFood() {
    // Show spinning wheel
    if (document.getElementsByClassName('spinner').length === 0) {
                spinningWheelShow();
    }

    // Delay search for better responsiveness
    clearTimeout(timer);
    timer = setTimeout(function() {
        searchFood(document.forms[0].elements.foodSearch.value);
    }, 500);
}

// Action when clicking on an item in a foods to convert list
function foodToConvertSelected() {
     // Action when clicking on an item:
    var ul = document.getElementById('foodList');
    ul.onclick = function(event) {
        // Get the element and its text
        var target = getEventTarget(event);
        var selectedFoodDesc = [];

        // Check what exactly was clicked and correctly parse the name of food
        if (target.tagName === 'A') {
           selectedFoodDesc = target.innerHTML; 
        } else if (target.tagName === 'LI') {
            selectedFoodDesc = target.firstChild.innerHTML;
        }

        // Populate Chosen food
        populateChosenFood(selectedFoodDesc);
        // populate convert from list
        populateFromChoices(selectedFoodDesc);
        // populate conversion to units list
        populateToChoices();
        document.getElementById("convertFromValue").focus();

        // remove id of a previously selected li item
        if (selectedElement !== "empty") {
            if (selectedElement.tagName === 'A') {
                selectedElement.parentElement.removeAttribute("id", "selected-food");
            } else if (selectedElement.tagName === 'LI') {
                selectedElement.removeAttribute("id", "selected-food");
            }
        }

        // add id to a selected li item
        selectedElement = target;
        if (target.tagName === 'A') {
           target.parentElement.setAttribute("id", "selected-food"); 
        } else if (target.tagName === 'LI') {
            target.setAttribute("id", "selected-food");
        }
    };
}

foodsDesc = fetchFoodDesc(foods);
foodsDesc = dedupArray(foodsDesc);
foodToConvertSelected();

// Conversion

// Conversion to units and their values
var conversions = {
    "grams": 1,
    "miligrams": 1000,
    "kilograms": 0.001,
    "ounce": 0.035274,
    "pounds": 0.0022046
};

// Get results of conversion
function getConversionResult(valueFrom, valueTo, conversionUnit) {
    return valueFrom * valueTo * conversionUnit;
}

// Get element that was clicked
function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

// Action when calculate button is clicked
function calculateClick() {
    // Get values from UI selections
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
        result.textContent = preText + ' ' + resultValue.toLocaleString({ maximumFractionDigits: 1 }) + ' ' + ConvertToText + '.';
    }
}

// Spinning wheel while waiting for the search results
var spinner;
function spinningWheelShow() {
    var opts = {
        lines: 13,
        length: 28,
        width: 14,
        radius: 42,
        scale: 0.2,
        corners: 1,
        color: '#000',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 60,
        fps: 20,
        zIndex: 2,
        className: 'spinner',
        left: '50%',
        top: '60%',
        shadow: false,
        hwaccel: false,
        position: 'absolute'
    };
    var target = document.getElementById('foodList');
    spinner = new Spinner(opts).spin(target);
}

function spinningWheelStop() {
    spinner.stop();
}

