(function(win, $){
  function clone(src, out) {
    for (var attr in src.prototype) {
      out.prototype[attr] = src.prototype[attr];
    }
  }

  function Circle() {
    this.item = $('<div class="circle"></div>');
    var self = this;
    this.opacity = 1;
    this.fade = function() {
      this.opacity *= .5;
      this.item.fadeTo(.5, this.opacity);
    }

    this.item.click(function() {
      self.fade();
    });
  }

  Circle.prototype.color = function(clr) {
    this.item.css('background', clr);
  }
  
  Circle.prototype.move = function(left, top) {
    this.item.css('left', left);
    this.item.css('top', top);
  }

  Circle.prototype.get = function() {
    return this.item;
  }

  function Rect() {
    this.item = $('<div class="rect"></div>');
  }
  
  clone(Circle, Rect);

  function selfDestructDecorator(obj) {
    obj.item.click(function() {
      obj.kill();
    });

    obj.kill = function() {
      obj.item.remove();
    }
  }

  function RedCircleBuilder() {
    this.item = new Circle();
    this.item.create();
    this.init();
  }
  
  RedCircleBuilder.prototype.init = function () {
    this.item.color('red');
  }

  RedCircleBuilder.prototype.get = function () {
    return this.item;
  }

  function BlueCircleBuilder() {
    this.item = new Circle();
    this.item.create();
    this.init();
  }

  BlueCircleBuilder.prototype.init = function () {
    this.item.color('blue');
    var rect = new Rect();
    rect.color('black');
    rect.move(40,40);
    selfDestructDecorator(rect);
    this.item.get().append(rect.get());
  };
  
  BlueCircleBuilder.prototype.get = function () {
    return this.item;
  };

  ShapeFactory = function() {
    this.types = {};
    this.create = function(type) {
      return new this.types[type]().get();
    };
    
    this.register = function(type, cls) {
      if (cls.prototype.init && cls.prototype.get) {
        this.types[type] = cls;
      }
    }
  }
  // Apply Adapter design pattern
  function StageAdapter(id) {
    this.index = 0;
    this.context = $(id);
    this.SIG = 'stageItem_';
  }
  
  StageAdapter.prototype.add = function (item) {
    ++this.index;
    item.addClass(this.SIG + this.index);
    this.context.append(item);
  }
  
  StageAdapter.prototype.remove = function (item) {
    this.context.remove('.' + this.SIG + index);
  }

  function CompositeController(a) {
      this.a = a;
  }

  CompositeController.prototype.action = function(act) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    for (var item  in this.a) {
      this.a[item][act].apply(this.a[item], args);
    }
  }

  function flyWeightFader() {

  }

  var ShapeGeneratorSingleton = (function(){
    var instance;

    function init() {
      var _aCircle = [];
      var _stage;
      var _sf = new ShapeFactory();
      var _cc = new CompositeController(_aCircle);

      function _position(circle, left, top) {
        circle.move(left, top);
      }

      function registerShape(name, cls) {
        _sf.register(name, cls);
      }

      function create(left, top, type) {
        var circle = _sf.create(type);
        circle.move(left, top);
        return circle;
      }

      function setStage(stg) {
        _stage = stg;
      }

      function tint(clr) {
        _cc.action('color', clr);
      }

      function add(circle) {
        _stage.add(circle.get());
        _aCircle.push(circle);
      }

      function move(left, top) {
        _cc.action('move', left, top);
      }

      function index() {
        return _aCircle.length;
      }

      return {
        index: index,
        create: create,
        add:add,
        setStage: setStage,
        register: registerShape,
        tint: tint,
        move: move
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
    var cg = ShapeGeneratorSingleton.getInstance();
    cg.register('red', RedCircleBuilder);
    cg.register('blue', BlueCircleBuilder);
    cg.setStage(new StageAdapter('.advert'));

    $('.advert').click(function(e) {
      var circle = cg.create(e.pageX-25, e.pageY-25, 'red');
      cg.add(circle);
    });

    $(document).keypress(function(e) {
      console.log(e.key);
      if (e.key == 'a'){
        var circle = cg.create(Math.floor(Math.random()*600), Math.floor(Math.random()*400), 'blue');
        cg.add(circle);
      }
      else if (e.key === 't'){
        cg.tint('orange');
      }
      else if (e.key === 'd'){
        cg.move('+=20px', '+=0px');
      }
      else if (e.key === 's'){
        cg.move('-=20px', '+=0px');
      }
    });
  });
})(window, jQuery);