/* global inkData, shirtData, maxOrderSize, surchargeDarkColor, surchargeDarkColor, surcharge2XL, surcharge3XL */
/* global surcharge4XL, surcharge5XL, maxOrderSize, maxOrderSize, maxOrderSize */
function airquotesCtrl($scope, $routeParams, $log) {
  'use strict';

  // We start by selecting a default shirt from the available shirts (see quoteData.js for the info about each shirt).
  $scope.shirtID = $routeParams.shirtID;
  $scope.shirt = shirtData[$scope.shirtID];

  // Initial values for color, shirt counts, and number of colors front and back.
  $scope.color = undefined;

  $scope.numSmall = 0;
  $scope.numMedium = 0;
  $scope.numLarge = 0;
  $scope.numXLarge = 0;
  $scope.num2XLarge = 0;
  $scope.num3XLarge = 0;
  $scope.num4XLarge = 0;
  $scope.num5XLarge = 0;

  $scope.numFrontImprintColors = 0;
  $scope.numBackImprintColors = 0;

  $scope.selectColor = function (shirtColor) {
    $scope.color = shirtColor;
  };

  // This is used by each of the color boxes to determine it's style. Only the selected color, if any, will
  // have a check mark on it.
  $scope.colorStyle = function (shirtColor) {
    var checkmark = '';

    if ($scope.color === shirtColor) {
      checkmark = 'url("img/checkmark.png") 3px 3px no-repeat';
    }

    return {
      'background' : shirtColor.color + ' ' + checkmark
    };
  };

  $scope.betterParseInt = function (value) {
    if (value === undefined || value === null || value === '') {
      return 0;
    } else {
      var retVal = parseInt(value, 10);

      if (retVal === undefined || isNaN(retVal)) {
        return 0;
      } else {
        return retVal;
      }
    }
  };

  $scope.quantity = function () {
    return ($scope.betterParseInt($scope.numSmall) + $scope.betterParseInt($scope.numMedium) +
        $scope.betterParseInt($scope.numLarge) + $scope.betterParseInt($scope.numXLarge) +
        $scope.betterParseInt($scope.num2XLarge) + $scope.betterParseInt($scope.num3XLarge) +
        $scope.betterParseInt($scope.num4XLarge) + $scope.betterParseInt($scope.num5XLarge));
  };

  $scope.allCalculations = function () {
    var numFrontColors = parseInt($scope.numFrontImprintColors, 10);
    var numBackColors = parseInt($scope.numBackImprintColors, 10);
    var darkColor = $scope.color.dark;
    var shirtCharge = $scope.shirt.cost;

    var num2XL = $scope.betterParseInt($scope.num2XLarge);
    var num3XL = $scope.betterParseInt($scope.num3XLarge);
    var num4XL = $scope.betterParseInt($scope.num4XLarge);
    var num5XL = $scope.betterParseInt($scope.num5XLarge);

    var quantity = $scope.quantity();

    // Calculate the total price and the each price.
    var calculations = $scope.calculationsForQuantity(quantity, numFrontColors, numBackColors, darkColor,
      shirtCharge, num2XL, num3XL, num4XL, num5XL);

    $scope.eachPrice = calculations.eachPrice;
    $scope.totalPrice = calculations.totalPrice;

    $scope.priceBreaks = $scope.getPriceBreaks(quantity);
    $scope.pbEachPrice = [];
    $scope.pbTotalPrice = [];

    // Figure out prices for some higher quantities and make that data available as well.
    calculations = $scope.calculationsForQuantity($scope.priceBreaks[0], numFrontColors, numBackColors, darkColor,
      shirtCharge, num2XL, num3XL, num4XL, num5XL);
    $scope.pbEachPrice[0] = calculations.eachPrice;
    $scope.pbTotalPrice[0] = calculations.totalPrice;

    calculations = $scope.calculationsForQuantity($scope.priceBreaks[1], numFrontColors, numBackColors, darkColor,
      shirtCharge, num2XL, num3XL, num4XL, num5XL);
    $scope.pbEachPrice[1] = calculations.eachPrice;
    $scope.pbTotalPrice[1] = calculations.totalPrice;

    calculations = $scope.calculationsForQuantity($scope.priceBreaks[2], numFrontColors, numBackColors, darkColor,
      shirtCharge, num2XL, num3XL, num4XL, num5XL);
    $scope.pbEachPrice[2] = calculations.eachPrice;
    $scope.pbTotalPrice[2] = calculations.totalPrice;
  };

  $scope.quoteStatus = function () {
    var quantity = $scope.quantity();

    if (quantity > maxOrderSize) {
      return 'tooLargeAnOrder';
    } else {
      var noColor = ($scope.color === undefined);
      var noSizes = ($scope.quantity() === 0);
      var noImprintColors = ($scope.betterParseInt($scope.numFrontImprintColors) === 0) &&
          ($scope.betterParseInt($scope.numBackImprintColors) === 0);

      if (noColor || noSizes || noImprintColors) {
        return 'notEnoughInformation';
      } else {
        // Perform all the calculations we need to perform so we have a full set of data.
        $scope.allCalculations();

        // Then return an indicator that there's enough data to show a quote.
        return 'quote';
      }
    }
  };

  // The following functions have been refactored to have all their information passed in. They don't touch their
  // environment at all so they are eminently testable.
  $scope.calculationsForQuantity = function (quantity, numFrontColors, numBackColors, darkColor,
                                             shirtCharge, num2XL, num3XL, num4XL, num5XL) {
    var printCharge = $scope.printCharge(quantity, numFrontColors, numBackColors, darkColor);
    var screensCharge = $scope.screensCharge(numFrontColors, numBackColors);
    var sizesCharge = $scope.sizesCharge(num2XL, num3XL, num4XL, num5XL);

    $log.log(quantity, numFrontColors, numBackColors, darkColor, shirtCharge);
    $log.log(printCharge, screensCharge, sizesCharge);

    var costPerShirtExcludingScreens = (printCharge + shirtCharge) * quantity;

    var totalPrice = (costPerShirtExcludingScreens + sizesCharge + screensCharge);

    // Calculates the average price of each shirt. Note: This can be skewed by surcharges on the larger shirts.
    var eachPrice = totalPrice / quantity;

    return { 'eachPrice' : eachPrice, 'totalPrice' : totalPrice };
  };

  $scope.printCharge = function (quantity, numFrontColors, numBackColors, darkColor) {
    var charge = 0;

    // Charges are calculated independenly for the front and the back.
    if (darkColor) {
      if (numFrontColors > 0) {
        charge = charge + surchargeDarkColor;
      }

      if (numBackColors > 0) {
        charge = charge + surchargeDarkColor;
      }
    }

    for (var i = 0; i < inkData.length; i++) {
      if (quantity < inkData[i].lessThan) {
        if (numFrontColors > 0) {
          // We have to subtract one from the number of colors because it's a zero based array.
          charge = charge + inkData[i].inkPrices[numFrontColors - 1];
        }

        if (numBackColors > 0) {
          // We have to subtract one from the number of colors because it's a zero based array.
          charge = charge + inkData[i].inkPrices[numBackColors - 1];
        }
        break;
      }
    }

    return charge;
  };

  $scope.screensCharge = function (numFrontColors, numBackColors) {
    // There's a $15 charge per color because a silk screen has to be made for each color.
    return (numFrontColors + numBackColors) * 15.00;
  };

  $scope.sizesCharge = function (num2XL, num3XL, num4XL, num5XL) {
    return (num2XL * surcharge2XL) + (num3XL * surcharge3XL) + (num4XL * surcharge4XL) + (num5XL * surcharge5XL);
  };

  $scope.getPriceBreaks = function (quantity) {
    var priceBreakLevels = [ maxOrderSize, maxOrderSize, maxOrderSize ];

    for (var i = 0; i < inkData.length; i++) {
      if (quantity < inkData[i].lessThan) {
        priceBreakLevels[0] = inkData[i].lessThan;
        priceBreakLevels[1] = inkData[i + 1].lessThan;
        priceBreakLevels[2] = inkData[i + 2].lessThan;
        break;
      }
    }

    return priceBreakLevels;
  };
}

// The AngularJS module for quoting.
angular.module('airquotes', [ 'ngRoute' ]).
  config(['$routeProvider', function($routeProvider) {
    'use strict';

    // This code sets up both a route handler that will pull out the particular shirt we want to display if the
    // url is of the form 'page.html#/shirts/<ID>'
    //
    // Note 1: The IDs used in the URL come from the shirtData in the quoteData.js file.
    // Note 2: If no particular shirt is specified then a default shirt is automatically selected for display.
    $routeProvider.
      when('/shirts/:shirtID', {
        templateUrl: 'quote.html',
        controller: airquotesCtrl
      }).
      otherwise({
        redirectTo: '/shirts/PC61'
      });
  }]);

