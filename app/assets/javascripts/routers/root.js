Vapour.Routers.Root = Backbone.Router.extend({

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.$modalEl = options.$modalEl;
    this.games = options.games;
  },

  routes: {
    "": "gameIndex",
    "games": "gameIndex",
    "games/new": "gameNew",
    "games/:id": "gameShow",
    "games/:id/edit": "gameEdit",
    "log_in": "sessionNew"
  },

  gameIndex: function () {
    var view = new Vapour.Views.GamesIndex({ collection: this.games });
    this.swapView(view);
  },

  gameNew: function () {
    var game = new Vapour.Models.Game();
    var view = new Vapour.Views.GamesForm({ model: game, collection: this.games });
    this.swapView(view);
  },

  gameShow: function (id) {
    var game = this.games.getOrFetch(id);
    var view = new Vapour.Views.GameShow({ model: game });
    this.swapView(view);
  },

  gameEdit: function (id) {
    var game = this.games.getOrFetch(id);
    var view = new Vapour.Views.GamesForm({ model: game, collection: this.games });
    this.swapView(view);
  },

  sessionNew: function () {
    var session = new Vapour.Models.Session();
    var view = new Vapour.Views.SessionsForm({ model: session });
    this.swapModal(view);
  },

  swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
    this._currentModal && this._currentModal.remove();
  },

  swapModal: function (modal) {
    this._currentModal && this._currentModal.remove();
    this._currentModal = modal;
    this.$modalEl.html(modal.render().$el);
  }
});
