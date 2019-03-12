$(document).ready(function () {

    loadVendingMachine();

    addMoney();
    
    makePurchase();


});

function loadVendingMachine() {
    // clearVendingMachine();

    var vendingCard = $('#vendingCard');

    $.ajax ({
        type: 'GET',
        url: 'https://tsg-vending.herokuapp.com/items',
        success: function (data, status) {
            $.each(data, function(index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                var card = '<div class="col-4">'
                    card += '<div id="vendingItemCard">';
                    card += '<div class="card bg-light mb-3 mt-3 ml-4 mr-4">';
                    card += '<div class="card">';
                    card += '<div class="card-body text-center">';
                    card += '<button type="button" class="btn btn-primary card-btn" id="vendingMessagesItemButton" onclick="addItemToItemBox(' + id + ')">' + id + '</button>'; 
                    card += '<p class="card-text">' + name + '</p';
                    card += '<p class="card-text"> $' + price + '</p>';
                    card += '<p class="card-text"> quantity left : ' + quantity + '</p>';
                    vendingCard.append(card);
            });
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    });
}

function addMoney() {
    var currentFunds = document.getElementById("vendingTransactionMoney");
    var dollar = document.getElementById("addDollarButton");
    var quarter = document.getElementById("addQuarterButton");
    var dime = document.getElementById("addDimeButton");
    var nickel = document.getElementById("addNickelButton");

    dollar.addEventListener("click", function() {
        vendingTransactionMoney.stepUp(100);
    });

    quarter.addEventListener("click", function() {
        vendingTransactionMoney.stepUp(25);
    });

    dime.addEventListener("click", function() {
        vendingTransactionMoney.stepUp(10);
    });

    nickel.addEventListener("click", function() {
        vendingTransactionMoney.stepUp(5.0);
    });

    $('#vendingTransactionMoney').val(currentFunds);
}



function makePurchase() {
    $('#vendingChange').val('');
    document.getElementById("makePurchaseButton").addEventListener("click", function() {

        var currentFunds = $('#vendingTransactionMoney').val();

        var getItemToPurchase = $('#vendingMessagesItem').val();

        $.ajax({
        type: 'GET',
        url: 'https://tsg-vending.herokuapp.com/money/' + currentFunds + '/item/' + getItemToPurchase,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data, status) {
            var quarters = data.quarters;
            var dimes = data.dimes;
            var nickels = data.nickels;
            var pennies = data.pennies;
            $('#vendingChange').val(quarters + ' quarters ' + dimes + ' dimes ' + nickels + ' nickels ' + pennies + ' pennies ');
            $('#vendingMessages').val('Thank you!');
            loadVendingMachine();
        },
        error: function(xhr, status, error) {
            $('#vendingMessages').val(xhr.responseJSON.message);
        }
        });
        
    });
    
}

function addItemToItemBox(itemId) {
        $('#vendingMessagesItem').val(itemId);
    
}

function changeReturn() {
    var userMoney = $('#vendingTransactionMoney').val();
    if (userMoney != null) {
        $('#vendingChange').val(userMoney);
        $('#vendingTransactionMoney').val('');
    }
    $('#vendingMessages').val('');
    $('#vendingMessagesItem').val('');
}
