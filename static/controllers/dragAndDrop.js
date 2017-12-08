angular.module('ui.imagedrop', [])
.directive("imagedrop", function ($parse, $document) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var onImageDrop = $parse(attrs.onImageDrop);

            //When an item is dragged over the document
            var onDragOver = function (e) {
                e.preventDefault();
                angular.element('body').addClass("dragOver");
            };

            //When the user leaves the window, cancels the drag or drops the item
            var onDragEnd = function (e) {
                e.preventDefault();
                angular.element('body').removeClass("dragOver");
            };

            //When a file is dropped
            var loadFile = function (file) {
                readURL(file, function(result){
                  scope.uploadedFile = result;
                  scope.$apply(onImageDrop(scope));
                })
            };

            //Dragging begins on the document
            $document.bind("dragover", onDragOver);

            //Dragging ends on the overlay, which takes the whole window
            element.bind("dragleave", onDragEnd)
                   .bind("drop", function (e) {
                       onDragEnd(e);
                       loadFile(e.originalEvent.dataTransfer.files[0]);
                   });

            function readURL(input, callback) {
              var reader = new FileReader();

              reader.onload = function(e) {
                //$('#blah').attr('src', e.target.result);
                callback(e.target.result)
              }

              reader.readAsDataURL(input);
            }

        } // func
    }; // return
}); // directive
