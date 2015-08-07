// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/sugar', 'jquery','autocomplete'], function ( Ractive, html, $, autocomplete) {



    var sugarRactive = new Ractive({
      el: 'sugar-div',
      template: html,
      data: {
        greeting: "Hello, World"
      }
    });



    return sugarRactive;

});
