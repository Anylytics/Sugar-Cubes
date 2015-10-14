// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/sugar-study', 'jquery','autocomplete'], function ( Ractive, html, $, autocomplete) {

	var sugarStudy = new Ractive({
		el: 'sugar-study-div',
		template: html,
		data: {
			nutrients: {},
			foodIndex: "",
			builtSettings : [],
			builtSettingsObjects : [],
			defaultSettings : [
				{
					id: 203,		dv:50, 		good:true
				},
				{
					id: 291,		dv:25,		good:true
				},
				{
					id: 318,		dv:5000,	good:true
				},
				{
					id: 401,		dv:60,		good:true
				},
				{
					id: 573,		dv:30,		good:true
				},
				{
					id: 301,		dv:1000,	good:true
				},
				{
					id: 303,		dv:18,		good:true
				},
				{
					id: 304,		dv:400,		good:true
				},
				{
					id: 306,		dv:3500,	good:true
				},
				{
					id: 606,		dv:20,		good:false
				},
				{
					id: 269,		dv:42,		good:false
				},
				{
					id: 307,		dv:2400,	good:false
				}
			],
			addedFoods:[
			{
				name:"eggs",
				index:22
			}
			]
		}
	});


	$("#loader").css('display','block');
	$.ajax( {
		url: "../nutrient_dictionary/",
		dataType: "json",
		success: function(result) {
			$("#loader").css('display','none');
			sugarStudy.set('nutrients',result.nutrients);
			updateResults();
		}
	});

	$("#foodID").autocomplete({
		//serviceUrl: './nutrients_suggest/',
		lookup: function (query, done) {
			$("#loader").css('display','block');
				// Do ajax call or lookup locally, when done,
				// call the callback and pass your results:$("#loader").css('display','block');
			$.ajax({
				url: "./nutrients_suggest/"+query,
				dataType: "json",
				success: function(result) {
					$("#loader").css('display','none');
					done(result);
				}
			});
		},
		onSelect: function (suggestion) {
			getIndexNutrients(suggestion.data.toString());
		}
	});

	function getIndexNutrients(food_id) {
		var nutrients_array = buildCurrentSettings();
		$("#loader").css('display','block');
		$.ajax( {
			url: "./nutrient_query/"+food_id+"/"+nutrients_array,
			dataType: "json",
			success: function(result) {
				$("#loader").css('display','none');
				calculateIndex(result);
			}
		})
	}

	function calculateIndex(nutrients) {
		var nutrients_settings  = sugarStudy.get("builtSettingsObjects");
		var current_nutrients = nutrients.nutrients;
		var index = 0;
		sugarStudy.set("foodIndex", 0);
		var thisContribution = 0;

		for (nutrient in nutrients_settings) {
			for (current_nutrient in current_nutrients.nutrients) {
				var thisNutrientValue = current_nutrients.nutrients[current_nutrient];
				var recommendedNutrientValue = nutrients_settings[nutrient];
				if (thisNutrientValue.nutr_code == recommendedNutrientValue.id) {

					thisContribution = thisNutrientValue.value / recommendedNutrientValue.dv;

					if (recommendedNutrientValue.good) {
						index += thisContribution;
					} else {
						index -= thisContribution;
					}
				}
			}
		}
		sugarStudy.set("foodIndex", Math.floor(index*100));
	}

	function updateResults() {
		var settings  = sugarStudy.get("defaultSettings");
		var nutrients = sugarStudy.get("nutrients");

		for (setting in settings) {

			var currentId = settings[setting].id;
			var currentDv = settings[setting].dv;
			var currentGood = settings[setting].good;

			for (nutrient in nutrients) {
				var currentNutrient = nutrients[nutrient];
				if (currentNutrient.key==currentId) {
					sugarStudy.set("nutrients["+nutrient+"].checked",true);
					sugarStudy.set("nutrients["+nutrient+"].good",currentGood);
					sugarStudy.set("nutrients["+nutrient+"].dv",currentDv);
				}
			}
		}
	}

	function buildCurrentSettings() {
		var nutrients = sugarStudy.get("nutrients");
		var currentSettings = sugarStudy.get("builtSettings");
		sugarStudy.set("builtSettingsObjects",[]);
		var currentSettingsObject = sugarStudy.get("builtSettingsObjects");
		for (nutrient in nutrients) {
			var currentNutrient = nutrients[nutrient];
			if (currentNutrient.checked) {
				var tmpObj = {};
				tmpObj.id = currentNutrient.key;
				tmpObj.good = currentNutrient.good;
				tmpObj.dv = currentNutrient.dv;
				currentSettings.push(currentNutrient.key);
				currentSettingsObject.push(tmpObj);
			}
		}
		console.log(sugarStudy.get("builtSettings"));
		return sugarStudy.get("builtSettings");
	}

    return sugarStudy;

});














