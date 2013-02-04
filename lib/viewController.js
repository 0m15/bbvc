// viewController.js

define(function(require) {

  var Backbone = require('backbone')

  var VERSION = "0.0.1"

  var ViewController = Backbone.View.extend({

    _counter: 0,
    defaultViews: null,
    subviews: null,
    subviewsKeys: null,

    opts: {
      fade: true,
      fadeDelay: 50,
      titleSuffix: null,
    },

    // initialize the view controller, passing options arguments:
    // `options.selector`, `options.fade` and `options.fadeDelay`
    // you can optionally pass any argument accepted by `Backbone.View` constructor
    initialize: function(opts) {
      opts || (opts = {})
      _.bindAll(this, '_addView')
      this.opts = opts
      this.selector = opts.selector
      this.setElement(this.selector)
      this.hasLayout = false
      return this
    },

    // setup a layout by passing in a `options.template` and an object literal containing 
    // views to render in this form:
    //   `views { ".selector": view }`
    // optionally pass `options.title` to set document title
    setup: function(opts) {
      if(!opts || !opts.template || !opts.views) throw new Error("You must provide following options: template, view")
      this.hasLayout && this._dispose()
      this.template = opts.template
      this.hasLayout = true
      this.subviews = []
      this.subviewsKeys = {}
      this.defaultViews = []
      opts.title && this.setTitle(opts.title)
      return this.render(opts.views)
    },

    // render subviews into layout, you should never call it manually
    render: function(views) {
      this.$el.html(this.template)
      _.each(views, this._addView)
      return this.trigger('layout:change', this)
    },

    // convenience method to set the document title
    setTitle: function(title) {
      document.title = title + ' ' + this.opts.titleSuffix
      return this
    },

    // method to arbitrary insert a view into the layout
    // it remove the current existing view in the selector (if any)
    // useful when you want to change only few views without resetting layout
    insertView: function(view, el) {
      if(this.subviewsKeys[el]) this._removeView(this.subviewsKeys[el])
      return this._addView(view, el)
    },

    // add a default `view` with a `placement` relative to
    // the main element of the layout (useful for static views like headers, footers, etc.)
    // those views are not cleaned on layout dispose, but by calling `disposeDefaultViews`
    addDefaultView: function(view, placement) {
      placement == "before"
        ? $(view.render().el).insertBefore(this.$el)
        : $(view.render().el).insertAfter(this.$el)
      return this.defaultViews.push(view)
    },

    // reset a layout by removing all views
    reset: function() {
      this._dispose()._disposeDefaultViews()
      return this
    },

    // utility method to dispose a set of `views`
    _clearViews: function(views) {
      if(!views.length) return
      _.invoke(views, 'dispose')
      views.length = 0
      if(views == this.subviews) delete this.subviewsKeys
      delete views
      return this
    },

    // method used internally to add a view to the layout
    _addView: function(view, sel) {
      var content = view.render().el
      this.$(sel).html(content)
      this.subviews.push(view)
      this.subviewsKeys[sel] = view
      return this.trigger('view:add', view)
    },

    _removeView: function(view) {
      var idx = this.subviews.indexOf(view)
      var sel = _.map(this.subviewsKeys, function(v, key) { 
        if(v == view) return key
      })
      idx !== -1 && this.subviews.splice(idx, 1) && delete this.subviewsKeys[sel]
      view.dispose()
      return this.trigger('view:remove', view)
    },
    
    // dispose default views
    _disposeDefaultViews: function() {
      return this._clearViews(this.defaultViews)
    },

    // dispose subviews
    _dispose: function() {
      this._clearViews(this.subviews)
      this.hasLayout = false
      return this.trigger('layout:dispose')
    },

  })

  return ViewController
})