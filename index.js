(function(win, $){
  var CircleGeneratorSingleton = (function(){
    var instance;

    function init() {
      var _aCircle = [];
      var _stage = $('.advert');

      function create(left, top) {
        var circle = $('<div class="circle"></div>');
        _position(circle, left, top);
        return circle;
      }

      function _position(circle, left, top) {
        circle.css('left', left);
        circle.css('top', top);
      }

      function add(circle) {
        _stage.append(circle);
        _aCircle.push(circle);
      }

      function index() {
        return _aCircle.length;
      }

      return {
        index: index,
        create: create,
        add:add
      };
    }

    return {
      getInstance: function() {
        if (!instance) {
          instance = init();
        }
        return instance;
      }
    }


  })();

  $(win.document).ready(function() {
    $('.advert').click(function(e) {
      console.log(e);
      var cg = CircleGeneratorSingleton.getInstance();
      var circle = cg.create(e.pageX-25, e.pageY-25);
      cg.add(circle);
    });
  });
})(window, jQuery);