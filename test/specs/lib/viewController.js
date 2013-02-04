define(function(require) {


  var ViewController = require('lib/viewController')
  var View = require('app/lib/view')

  describe("ViewController", function() {

    var opts = {
      selector: '#test-view',
      fade: false,
    }

    var vc = new ViewController(opts)
    var model = new Backbone.Model()

    var View1 = View2 = View.extend({
      el: '<p id="test">click</p>',
      counter: null,
      counter1: null,
      events: { 'click': 'increment' },
      increment: function() {
        console.log('incr')
        this.counter += 1
      },
      onchange: function() {
        this.counter1 += 1
      },
      initialize: function() {
        this.counter = 0
        this.counter1 = 0
        this.model = model
        this.listenTo(this.model, 'change:test', this.onchange)
        View.prototype.initialize.call(this)
        return this
      },
    })

    var v1 = new View1()
    var v2 = new View2()

    describe("constructor", function() {
      it("should set properties", function() {
        expect(vc.selector).to.be.equal('#test-view')
        expect(vc.opts).to.be.equal(opts)
        expect(vc.$el).to.be.ok()
      })
    })

    describe("setup", function() {
      it("should setup a layout", function() {
        var c = 0
        vc.on('layout:change', function() { c+=1 })
        vc.setup({
          template: 'View <div class="view_1"></div> <div class="view_2"></div>',
          views: {
            '.view_1': v1,
            '.view_2': v2,
          }
        })

        expect(vc.subviews.length).to.be.equal(2)
        expect(vc.subviews[0]).to.be.equal(v1)
        expect(vc.subviews[1]).to.be.equal(v2)
        expect(vc.subviewsKeys['.view_1']).to.be.equal(v1)
        expect(v1).not.to.be.equal(v2)
        expect(c).to.equal(1)
      })
    })

    describe("add default view(s)", function() {
      it("should be able to add default views", function() {
        vc.addDefaultView(v1, "before")
        expect(vc.defaultViews.length).to.be.equal(1)
        expect(vc.defaultViews[0]).to.be.equal(v1)
      })
    })

    describe("subviews", function() {
      it("should respond to events callbacks", function() {
        $(v1.el).trigger('click')
        expect(v1.counter).to.equal(1)
        model.set('test', 'changed')
        expect(v1.counter1).to.equal(1)
        v1.counter = 0
      })
    })

    describe("dispose", function() {
      it("should remove subviews", function() {
        vc._dispose()
        expect(vc.subviews.length).to.equal(0)
        expect(vc.subviewsKeys).to.be(null)
      })

      it("should not remove default views", function() {
        expect(vc.defaultViews.length).to.be.equal(1)
      })

      it("should remove subviews events listeners", function() {
        $(v1.el).trigger('click')
        expect(v1.counter).to.equal(0)
        model.set('test', 'changed')
        expect(v1.counter1).to.equal(1)
      })
    })

    describe("add view", function() {
      it("should add a view to layout", function() {
        vc.setup({ template: 'View <div class="view_1"></div> <div class="view_2"></div>', views: {}})
        vc._addView(v1, '.view_1')
        expect(vc.subviews.length).to.be.equal(1)
        expect(vc.subviews[0]).to.be.equal(v1)
      })
    })

    describe("remove view", function() {
      it("should remove a view from layout", function() {
        vc._removeView(v1)
        expect(vc.subviews.length).to.be.equal(0)
        expect(vc.subviewsKeys['.view_1']).to.be.equal(undefined)
      })
    })

    describe("insert view", function() {
      it("should insert a view into layout replacing existing one", function() {
        vc._addView(v1, '.view_1')
        vc.insertView(v2, '.view_1')
        expect(vc.subviewsKeys['.view_1']).to.be.equal(v2)
        expect(vc.subviews.length).to.be.equal(1)
      })
    })

  })

})