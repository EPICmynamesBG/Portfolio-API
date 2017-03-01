app.directive('chipField', function (TagsAPI) {
  return {
    restrict: 'A',
    replace: false,
    scope: {
      preset: '=',
      ngModel: '='
    },
    templateUrl: './src/components/Chips/chip-field.html',
    link: function (scope, element, attrs) {
      
      var thisField = $('.chip-field');

      var options = [];
      var presets = [];

      var getAllOptions = function () {
        TagsAPI.getAll()
          .then(function (resposne) {
            options = resposne.data.data;
          }).catch(function (error) {
            console.error(error);
          });
      };

      var parseOptionsToAutocomplete = function (toParse) {
        var autocomplete = {};
        toParse.forEach(function(item){
          var key = item.name;
          autocomplete[key] = null;
        });
        return autocomplete;
      }


      var parsePresetsToChips = function (toParse) {
        if (!toParse || !Array.isArray(toParse) || toParse.length == 0){
          return [];
        }
        
        var chipList = []
        toParse.forEach(function (tag) {
          var chip = {
            tag: tag.name,
            id: tag.id
          };
          chipList.push(chip);
        });
        return chipList;
      };


      var init = function () {
        thisField.material_chip({
          autocompleteData: parseOptionsToAutocomplete(options),
          limit: 10,
          data: parsePresetsToChips(scope.preset),
          placeholder: 'Enter a Tag',
          secondaryPlaceholder: '+Tag'
        });
      }

      init();
      
      
      scope.$watch(function() {
        return thisField.material_chip('data');
      }, function(newVal){
        scope.ngModel = newVal;
      });

    }
  }
});