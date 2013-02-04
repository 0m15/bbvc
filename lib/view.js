define(function(require) {
  
  var Backbone = require('backbone')
  var View = Backbone.View.extend({
  
      subviews: null,

      initialize: function() {
        this.subviews = []
        return this
      },
      
      addView: function(sel, view) {
        var el = this.$el.find(sel)
        if(!el.length) return this
        el.html(view.render().el)
        this.subviews.push(view) 
        this.trigger('view:add', view)
        return this
      },

      dispose: function() {
        if(this.subviews.length) _.invoke(this.subviews, "dispose")
        this.subviews.length = 0
        this.remove()
      }
    })
  return View
})