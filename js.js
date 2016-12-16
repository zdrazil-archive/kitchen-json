var foods = jsonObject.foods;
var resultFood = [];
var resultFoodSetDesc = new Set();
var delayTimer = 0;

var myDiv = document.getElementById("foodResults");
var selectList = document.createElement("select");
selectList.id = "mySelect";
myDiv.appendChild(selectList);

function searchFood(searchQuery) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {;
        resultFoodSetDesc.clear();
        while (selectList.hasChildNodes())
            selectList.removeChild(selectList.lastChild);

        k = 0
        for (food in foods) {
            var longDescription = foods[food].long_desc;
            if (longDescription.toLowerCase().includes(searchQuery.toLowerCase())) {
                resultFoodSetDesc.add(foods[food].long_desc);
                k++;
            }
            if (k > 20) {
                break;
            }
        }

        let resultFoodArrayDescLike = resultFoodSetDesc.values();
        let resultFoodArrayDesc = Array.from(resultFoodArrayDescLike);

        for (food in resultFoodArrayDesc) {
            var option = document.createElement("option");
            option.value = resultFoodArrayDesc[food].long_desc;
            option.text = resultFoodArrayDesc[food].long_desc;
            selectList.appendChild(option);
        }
    }, 500)
}
document.forms[0].elements.convertFrom.value;