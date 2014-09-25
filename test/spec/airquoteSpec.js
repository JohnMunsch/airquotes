/* global it, describe, beforeEach, inject, expect, scope, spyOn */
describe('app module', function () {
  'use strict';

  beforeEach(module('airquotes'));

  describe('airquotesCtrl', function () {
    var scope, controller;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller;

      // Create the controller.
      controller('airquotesCtrl', {$scope: scope});
    }));

    it ('will initialize it\'s values', function () {
      // Test the scope for values.
      expect(scope.numSmall).toBe(0);
      expect(scope.numMedium).toBe(0);
      expect(scope.numLarge).toBe(0);
      expect(scope.numXLarge).toBe(0);
      expect(scope.num2XLarge).toBe(0);
      expect(scope.num3XLarge).toBe(0);
      expect(scope.num4XLarge).toBe(0);
      expect(scope.num5XLarge).toBe(0);

      expect(scope.selectColor).toBeDefined();
      expect(scope.colorStyle).toBeDefined();
      expect(scope.quoteStatus).toBeDefined();
      expect(scope.betterParseInt).toBeDefined();
    });

    it ('will charge the same for one screen either front or back and the cost will be > $0', function () {
      var frontScreenCost = scope.screensCharge(1, 0);
      var backScreenCost = scope.screensCharge(0, 1);

      expect(frontScreenCost).toBe(backScreenCost);
      expect(frontScreenCost).toBeGreaterThan(0);
    });

    it ('will charge the same amount for screens front and back or two on the front or two on the back',
        function () {
          var frontAndBackCost = scope.screensCharge(1, 1);
          var twoOnFrontCost = scope.screensCharge(2, 0);
          var twoOnBackCost = scope.screensCharge(0, 2);

          expect(frontAndBackCost).toBe(twoOnFrontCost);
          expect(twoOnFrontCost).toBe(twoOnBackCost);
        }
    );

    it ('will charge more for large sizes', function () {
      var size2XLCost = scope.sizesCharge(1, 0, 0, 0);
      var size3XLCost = scope.sizesCharge(0, 1, 0, 0);
      var size4XLCost = scope.sizesCharge(0, 0, 1, 0);
      var size5XLCost = scope.sizesCharge(0, 0, 0, 1);

      expect(size2XLCost).toBeGreaterThan(0);
      expect(size3XLCost).toBeGreaterThan(0);
      expect(size4XLCost).toBeGreaterThan(0);
      expect(size5XLCost).toBeGreaterThan(0);
    });

    it ('will charge nothing extra if there are no large sizes', function () {
      expect(scope.sizesCharge(0, 0, 0, 0)).toBe(0);
    });

    it ('will charge more for printing on a dark color shirt (front imprint only)', function () {
      var printNormal = scope.printCharge(1, 0, 1, false);
      var printDark = scope.printCharge(1, 0, 1, true);

      expect(printDark).toBeGreaterThan(printNormal);
    });

    it ('will charge more for printing on a dark color shirt (back imprint only)', function () {
      var printNormal = scope.printCharge(1, 1, 0, false);
      var printDark = scope.printCharge(1, 1, 0, true);

      expect(printDark).toBeGreaterThan(printNormal);
    });

    it ('will charge more for printing on a dark color shirt (front and back imprint)', function () {
      var printNormal = scope.printCharge(1, 1, 1, false);
      var printDark = scope.printCharge(1, 1, 1, true);

      expect(printDark).toBeGreaterThan(printNormal);
    });

    it ('will return three levels of price breaks', function () {
      var priceBreaks = scope.getPriceBreaks(10);

      expect(priceBreaks.length).toBe(3);
    });

    it ('will have the same price breaks at quantity 22 and 23 but it different at 24', function () {
      var priceBreaks22 = scope.getPriceBreaks(22);
      var priceBreaks23 = scope.getPriceBreaks(23);
      var priceBreaks24 = scope.getPriceBreaks(24);

      expect(priceBreaks22).toEqual(priceBreaks23);
      expect(priceBreaks23).not.toEqual(priceBreaks24);
    });

    it ('will calculate a basic shirt example correctly', function () {
      var quantity = 5;
      var numFrontColors = 1;
      var numBackColors = 0;
      var darkColor = false;
      var shirtCharge = 5.23;
      var num2XL = 0;
      var num3XL = 0;
      var num4XL = 0;
      var num5XL = 0;
      var calculations = scope.calculationsForQuantity(quantity, numFrontColors, numBackColors, darkColor,
          shirtCharge, num2XL, num3XL, num4XL, num5XL);

      expect(calculations.totalPrice).toEqual(53.650000000000006);
      expect(calculations.eachPrice).toEqual(10.73);
    });

    it ('will calculate an example with plus-sized shirts correctly', function () {
      var quantity = 5;
      var numFrontColors = 1;
      var numBackColors = 0;
      var darkColor = false;
      var shirtCharge = 5.23;
      var num2XL = 1;
      var num3XL = 1;
      var num4XL = 1;
      var num5XL = 1;
      var calculations = scope.calculationsForQuantity(quantity, numFrontColors, numBackColors, darkColor,
          shirtCharge, num2XL, num3XL, num4XL, num5XL);

      expect(calculations.totalPrice).toEqual(63.650000000000006);
      expect(calculations.eachPrice).toEqual(12.73);
    });

    it ('will say we have too large an order if quantity is too high', function () {
      scope.numSmall = 1000;
      scope.numMedium = 1000;
      scope.numLarge = 1000;
      scope.numXLarge = 1000;
      scope.num2XLarge = 1000;
      scope.num3XLarge = 1000;
      scope.num4XLarge = 1000;
      scope.num5XLarge = 1000;

      expect(scope.quoteStatus()).toBe('tooLargeAnOrder');
    });

    it ('will say we don\'t have enough information without a color, size, and number of imprint colors',
        function () {
          expect(scope.quoteStatus()).toBe('notEnoughInformation');
        }
    );

    it ('will say if we don\'t have enough information without a color and size', function () {
      scope.numFrontImprintColors = 1;
      scope.numBackImprintColors = 0;

      expect(scope.quoteStatus()).toBe('notEnoughInformation');
    });

    it ('will say we don\'t have enough information without a color and number of imprint colors', function () {
      scope.numSmall = 10;
      scope.numMedium = 0;
      scope.numLarge = 0;
      scope.numXLarge = 0;
      scope.num2XLarge = 0;
      scope.num3XLarge = 0;
      scope.num4XLarge = 0;
      scope.num5XLarge = 0;

      expect(scope.quoteStatus()).toBe('notEnoughInformation');
    });

    it ('will say we don\'t have enough information without a size and number of imprint colors', function () {
      scope.color = { 'color': '#84c2d4', 'name': 'Aqua Blue' };

      expect(scope.quoteStatus()).toBe('notEnoughInformation');
    });

    it ('will say we can quote if color, size, and imprint colors are all set', function () {
      scope.color = { 'color': '#84c2d4', 'name': 'Aqua Blue' };
      scope.numSmall = 10;
      scope.numMedium = 0;
      scope.numLarge = 0;
      scope.numXLarge = 0;
      scope.num2XLarge = 0;
      scope.num3XLarge = 0;
      scope.num4XLarge = 0;
      scope.num5XLarge = 0;
      scope.numFrontImprintColors = 1;
      scope.numBackImprintColors = 0;

      spyOn(scope, 'allCalculations');

      expect(scope.quoteStatus()).toBe('quote');
      expect(scope.allCalculations).toHaveBeenCalled();
    });

    it ('will parse a variety of bad inputs as zero via betterParseInt', function () {
      expect(scope.betterParseInt('')).toBe(0);
      expect(scope.betterParseInt(null)).toBe(0);
      expect(scope.betterParseInt(undefined)).toBe(0);
      expect(scope.betterParseInt('blah')).toBe(0);
    });

    it ('will set the color if the user selects a color', function () {
      scope.selectColor({ 'color': '#84c2d4', 'name': 'Aqua Blue' });

      expect(scope.color).toEqual({ 'color': '#84c2d4', 'name': 'Aqua Blue' });
    });

    it ('will return a style without a checkmark for non-selected colors', function () {
      scope.color = { 'color': '#f4d694', 'name': 'Chamois Yellow' };
      var otherColor = { 'color': '#84c2d4', 'name': 'Aqua Blue' };

      expect(scope.colorStyle(otherColor)).toEqual(
          { background : '#84c2d4 ' }
      );
    });

    it ('will return a style which may be used to show a checkmark on a selected color', function () {
      scope.color = { 'color': '#f4d694', 'name': 'Chamois Yellow' };

      expect(scope.colorStyle(scope.color)).toEqual(
          { background : '#f4d694 url("img/checkmark.png") 3px 3px no-repeat' });
    });

    it ('will perform calculations and provide data we can display about prices at different quantities',
      function () {
        scope.shirt = {
          'name': 'Port & Company - Adult (PC61)',
          'description': 'Heavyweight 6.1-ounce, 100% cotton (preshrunk) Our best-selling t-shirt has been voted "most popular" by groups, teams, clubs and schools across America.',
          'image': 'img/thumb_shirt.jpg',
          'cost': 3.82,
          'colors': [
            { 'color': '#84c2d4', 'name': 'Aqua Blue' }
          ]
        };

        scope.color = { 'color': '#84c2d4', 'name': 'Aqua Blue' };
        scope.numSmall = 10;
        scope.numMedium = 0;
        scope.numLarge = 0;
        scope.numXLarge = 0;
        scope.num2XLarge = 0;
        scope.num3XLarge = 0;
        scope.num4XLarge = 0;
        scope.num5XLarge = 0;
        scope.numFrontImprintColors = 1;
        scope.numBackImprintColors = 0;

        scope.allCalculations();

        expect(scope.eachPrice).toBeGreaterThan(0);
        expect(scope.totalPrice).toBeGreaterThan(0);
        expect(scope.priceBreaks).toBeDefined();
      }
    );
  });
});