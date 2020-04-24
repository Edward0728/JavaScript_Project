//  BUDGET CONTROLLER
var budgetController = (function (){
   /* var budget = 23;
    
    var add = function (budget){
        return x + budget;
    }
    
    return {
        publicBudget: function (b){  //?is this a function prototype
            console.log(add(b));
                    } 
           }*/


    var Expense = function(id, des, val){
    
        this.id = id;
        this.description = des;
        this.value = val;
        this.percentage = -1;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome){
    if(totalIncome>0){
        this.percentage = Math.round((this.value / totalIncome) * 100);} 
    else{this.percentage = -1;}
    };
                                     
    Expense.prototype.getPercentage = function(){
          return this.percentage;  
        };
 
    var Income = function(id, des, val){
 
     this.id = id;
     this.description = des;
     this.value = val;
 };
 
    var calculateTotal= function(type){
    var sum, budget, percent;  
    sum = 0;

    data.allItems[type].forEach(function(cur){
        sum+=cur.value;
    }) 
    data.totals[type]=sum;
}


   var data = {
       allItems:{
           exp:[],
           inc:[]
       },
       totals:{
       exp: 0,
       inc: 0
   },
        budget: 0,
        percentage: -1,
       
 };
                        
return {
    addItem: function(type, description, value){
    var newItem,id;
        
        // id=last id + 1
        // creat new id
        if(data.allItems[type].length >0){
        id = data.allItems[type][data.allItems[type].length-1].id + 1;}else{
            id = 0;
        }
        
        //creat new item on 'inc' or 'exp' type
        if(type==='exp'){
            newItem = new Expense(id,description,value);
        }else if (type==='inc'){
            newItem = new Income(id,description,value);
        }
        
        //Push it into our data structure
        data.allItems[type].push(newItem);
        
        // return the new item for future use
        return newItem;
    },
    
    deleteItem: function(type, id){
        
        // id =6
        //data.allItems[type][id];
        //ids = [1 2 4  8]
        // index = 3
        
        var ids, index;
        ids = data.allItems[type].map(function(current){
           return current.id; 
        });
        
        index = ids.indexOf(id);
        
       if(index!== -1){
        data.allItems[type].splice(index,1);  
       }
        
    },
    
    calculateBudget: function(){
     
        //calculate the total income and expense
        calculateTotal('exp');
        calculateTotal('inc');
               
        //calculate the budget: income-expense
        data.budget = data.totals.inc-data.totals.exp;
        
        //calculate the percentage
        if (data.totals.inc > 0)
        {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else {data.percentage = -1; }
    },
    
    getBudget: function (){
    return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
        };
    },
    calculatePercentages:function(){
    data.allItems.exp.forEach(function(cur){
        cur.calculatePercentage(data.totals.inc);
    })
},
    
    getPercentages:function(){
        var allPerc = data.allItems.exp.map(function(cur){
        return cur.getPercentage();
    })   
        return allPerc;
    },
    
    testing: function(){
        console.log(data);
    }
 };
    
    
})();




// UI CONTROLLER
var UIController = (function(){
  // some code  
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton:'.add__btn',
        inputEnter:'keypress',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLable:'.budget__expenses--percentage',
        container:'.container',
        expensePercLabel:'.item__percentage',
        monthLabel:'.budget__title--month'
       
    }
    
           
    var formatItem = function(num, type){
            var splitNum;
            num = Math.abs(num);
            num = num.toFixed(2);
            splitNum = num.split('.');
            
            int = splitNum[0];
            dec = splitNum[1];
            //console.log(int.length);
            if(int.length>3){
                int = int.substr(0, (int.length)%3) + ',' + int.substr((int.length)%3, int.length)
            }
           
            //(type==='exp'?'-':'+') + 
            return formatNum = int+'.'+dec;
        
        }
    
        var nodeListForEach = function(list, callback){
        for(var i = 0; i<list.length; i++){
                    callback(list[i],i)
            }
        }
        
    
    return {
        getInput:function(){
            return{
                
                type: document.querySelector(DOMstrings.inputType).value,  //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },
        
        addListItem: function(obj, type){
            var html,newHtml,element;
            if(type==='inc'){
                element = DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
        
            if(type==='exp'){
                element = DOMstrings.expensesContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
            
            //replace the placeholder in the html with the actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%', formatItem(obj.value,type));
            
           //insert the HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
                       
        },
        
        removeListItem: function(selectorID){
            var item;
            item = document.getElementById(selectorID); 
            item.parentNode.removeChild(item);
        },
        
        clearFields: function(){
           var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = "";
            })
             
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            obj.budget>0? type = 'inc':type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatItem(obj.budget,type);
             document.querySelector(DOMstrings.incomeLabel).textContent = '+' + formatItem(obj.totalInc,type);
            document.querySelector(DOMstrings.expenseLabel).textContent = '-' + formatItem(obj.totalExp,type);
            document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            
            if(obj.percentage > 0){  
                 document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLable).textContent = '---'}
              
        },
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
            
            var nodeListForEach = function(list, callback){
                for(var i = 0; i<list.length; i++){
                    callback(list[i],i)
                }
            }
            
            nodeListForEach(fields,function(currentField, index){
                if(percentages[index]>0){
                    currentField.textContent = percentages[index] + '%';
                }else {currentField.textContent = '---';}
            })
        },
        
        displayMonth: function(){
            var now, year;
            now =  new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            document.querySelector(DOMstrings.monthLabel).textContent = months[month] +' '+year;
            
            
        },
        
        changedType: function(){
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            nodeListForEach (fields, function(cur){
                cur.classList.toggle('red-focus');  //addClass
                }
            )
            
        document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        
        
        getDOMstrings:function(){return DOMstrings;}
    }
})();




//GOLABL APP CONTROLLER
var controller =(function (budgetCtrl, UICtrl){
   /* var z = budgetController.publicBudget(5);
    
    return {
        anotherPublic: function(){
            console.log(z);
            
        }
    }*/
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener   ('click', ctrlAddItem) ;
        document.addEventListener(DOM.inputEnter, function(event){
            if (event.keyCode===13 || event.which===13){
            ctrlAddItem();        
            }
        })  
        
       document.querySelector(DOM.container).addEventListener ('click', ctrlDeleteItem);     
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    };
    
    
    
    
    
    
    
    var updateBudget = function(){
        //5. calculate the new budget
        budgetCtrl.calculateBudget();
                    
        //6. return the budget
        var budget = budgetCtrl.getBudget();  
        //7. display the new budget
        UICtrl.displayBudget(budget);
        //console.log('click or enter')
    }
    
    
    var updatePercentages = function(){
        //8. calculate the percentages
        budgetCtrl.calculatePercentages();
        //9. read the percentages from bugetController
        var percentages = budgetCtrl.getPercentages();
        //10. update the UI the new percentages
        UICtrl.displayPercentages(percentages);
    }
    var ctrlAddItem = function(){
        var input, newItem;
        
        //1. get the input field value from the UIController
        input = UICtrl.getInput();
        
        
        //2. add the value to the budgetController moduel
        if(input.description!=="" && !isNaN(input.value) && input.value>0 ){
                   newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3. add the value to the UIController moduel
        UICtrl.addListItem(newItem,input.type);
        
        //4. clear the fields
        UICtrl.clearFields();
        
        //5. Calculate and update budget
        updateBudget();
            
        //6. calculate and update the percentages
        updatePercentages();
        }
    };
    
    var ctrlDeleteItem = function(event){
        var itemID,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            //inc-1
        splitID = itemID.split('-');//return an array
        type= splitID[0];           
        ID = parseInt(splitID[1]);
        // 1. delete the item from data structure
        budgetCtrl.deleteItem(type, ID);
        // 2. delete the item from the UI list
        UICtrl.removeListItem(itemID);
        // 3. update and show the new budget
        updateBudget();
        // 6. calculate and update the percentages
        updatePercentages();
        
        }
       
      
    };
    
    
  
        return{
            init: function(){
            console.log('Application has started!');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
            });
            setupEventListeners();
        }
    

    };
                     
    
})(budgetController,UIController);


controller.init();
