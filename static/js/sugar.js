// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/sugar', 'jquery','autocomplete', 'sugarAnim'], function ( Ractive, html, $, autocomplete, sugarAnim) {

	var sugarRactive = new Ractive({
	  el: 'sugar-div',
	  template: html,
	  data: {
	    greeting: "Hello, World"
	  }
	});

	$("#foodID").autocomplete({
	  //serviceUrl: './nutrients_suggest/',
	  lookup: function (query, done) {
	      $("#loader").css('display','block');
	      // Do ajax call or lookup locally, when done,
	      // call the callback and pass your results:$("#loader").css('display','block');
	      $.ajax({
	            url: "../../nutrients_suggest/"+query,
	            dataType: "json",
	            success: function(result) {
	              $("#loader").css('display','none');
	              done(result);
	            }
	        });

	  },
	  onSelect: function (suggestion) {
	      getSugar(suggestion.data.toString());
	  }
	});

	function getSugar(food_id) {
	  $("#loader").css('display','block');
	  $.ajax( {
	      url: "../../nutrients_sugarcontent/"+food_id,
	      dataType: "json",
	      success: function(result) {
	        $("#loader").css('display','none');
	        parseNutrients(result);
	      }
	  })
	}

	function parseNutrients(result) {
		for (nutrients in result) {
			console.log(result[nutrients]);
		}
		Materialize.toast("That has " + result + "g of sugar!", 6000);
		dropCubes(result);
	}

    return sugarRactive;

});
