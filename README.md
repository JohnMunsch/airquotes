# airquotes #

## Introduction ##

This was my first AngularJS project and yet it's surprisingly not that bad. It is an automatic quote generator for a t-shirt website which I developed for someone with whom I used to work. At the time of writing this it was not yet deployed because some of the PHP it has to hook to on the server side was less than stable. But all of the client side work I did was working like a champ.

It's a good example of an AngularJS application that's not completely trivial and yet one that does not depend upon having a service it has to connect to for getting and persisting data.

Note: I asked for and received permission to distribute the source code for this project before agreeing to do it. It was understood that I would be sharing the code and writing about it. I have removed a few PHP files and a PDF of the pricing information, though you could pick all of that out of the JavaScript code or just figure it out from pricing a few shirts, so it's not exactly the secret recipe for Coca Cola.

![Alt text](/img/get-a-t-shirt-quote.png "The interface as the user first sees it.")

![Alt text](/img/prices-and-the-order-more-and-save-sections-update-in-real-time.png "Prices and the quantity discounts update in real-time as the user changes colors, printing colors front and back, quantities, etc.")

## "Installation" ##

You don't really have to "install" anything to look at or use the code. But if you want to see it run locally or run the unit tests you'll need to do a few things. First off, make sure you've installed Node.js so you can run the Node Package Manager (npm). Then make sure you've installed both Grunt and Bower. I'm not going to tell you how to do all of that, but instead I'll just direct you to the Yeoman project (http://yeoman.io/gettingstarted.html) where they tell you about installing all of these great JavaScript tools. Fortunately, npm makes it all pretty darn easy and installing Node.js is easy too.

Now you can run a couple of commands in the root of the airquotes project to get installed what you need to run or test it locally.

sudo npm install -g karma

bower install

npm install
