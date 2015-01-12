Vapour.Views.GameShow = Backbone.CompositeView.extend({

  template: JST['games/show'],

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.screenshots(), "sync", this.render);
    this.listenTo(Vapour.CurrentUser(), "change", this.render);
  },

  render: function () {
    var content = this.template({ game: this.model });
    this.$el.html(content);

    this.setupScreenshots();

    return this;
  },

  setupScreenshots: function () {
    this.$screenshots = $('.game-screenshot-list');
    var listLength = this.model.screenshots().length * 100;
    this.$screenshots.css('width', listLength);
    this.$screenshots.data('extra-width', Math.max(listLength-500, 0));
    this.$activeImg = this.$('.screenshot-display');
    this.activate(this.$('.game-screenshot:first-child .screenshot-thumb'));

    this.$sliderBar = this.$('.slider-bar');
    var that = this;
    this.$sliderBar.draggable({
      containment: "parent",
      drag: function () {
        var parentXPos = $(this).parent().offset().left;
        var xPos = $(this).offset().left;
        var extraX = that.$screenshots.data('extra-width');
        that.$screenshots.css('left', "-"+((xPos - parentXPos) / 340 * extraX)+"px");
      }
    });
    console.log(this.$sliderBar);
  },

  events: {
    'click .add-screenshot': 'screenshotForm',
    'click .add-to-cart': 'addToCart',
    'click .screenshot-thumb': 'activateImage',
    'click .slide-left': "slideLeft",
    'click .slide-right': 'slideRight'
  },

  screenshotForm: function (event) {
    event.preventDefault();

    var view = new Vapour.Views.ScreenshotsForm({
      model: new Vapour.Models.Screenshot(),
      collection: this.model.screenshots(),
      game: this.model
    });

    Vapour.RootRouter.trigger('swapModal', view);
  },

  addToCart: function (event) {
    event.preventDefault();

    var transaction = new Vapour.Models.Transaction();
    transaction.save({game_id: this.model.id}, {
      success: function (model) {
        var collection = Vapour.CurrentUser().gamesInCart();
        collection.add(transaction);
        var view = new Vapour.Views.TransactionsIndex({collection: collection})
        Vapour.RootRouter.trigger("swapModal", view)
      },
      error: function (model, resp) {
        this.errors = resp.responseJSON.errors;
        this.render();
      }.bind(this)
    });
  },

  activateImage: function (event) {
    event.preventDefault();
    var $target = $(event.currentTarget);
    this.activate($target);
  },

  activate: function ($thumb) {
    this.$activeThumb && this.$activeThumb.removeClass('active');
    this.$activeThumb = $thumb;
    this.$activeThumb.addClass('active');
    this.$activeImg.html(this.$activeThumb.children('img').clone());
  },

  slideLeft: function (event) {
    event.preventDefault();
    var prevChild = this.$activeThumb.parent().prev().children('.screenshot-thumb');
    prevChild && this.activate(prevChild);
  },

  slideRight: function (event) {
    event.preventDefault();
    var nextChild = this.$activeThumb.parent().next().children('.screenshot-thumb');
    nextChild && this.activate(nextChild);
  }

});
