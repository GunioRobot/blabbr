/* DO NOT MODIFY. This file was compiled Sun, 27 Mar 2011 09:49:18 GMT from
 * /home/chatgris/dev/blabbr/app/coffeescripts/blabbr.coffee
 */

(function() {
  var blabbr, grab, topics;
  grab = {
    getData: function(path, callback) {
      return $.get("" + path + ".json", '', callback, "json");
    }
  };
  topics = {
    index: function(path) {
      var callback;
      callback = function(response) {
        var topic, _i, _len, _results;
        $('#contents').html('');
        _results = [];
        for (_i = 0, _len = response.length; _i < _len; _i++) {
          topic = response[_i];
          _results.push(addContent(ich.topic(topic), "#contents"));
        }
        return _results;
      };
      return grab.getData(path, callback);
    }
  };
  window.current_user = {
    audio: $.cookie('audio'),
    user_id: $.cookie('user_id'),
    nick: $.cookie('nick'),
    topic_id: null
  };
  blabbr = {
    prefix: history.pushState ? "/" : "#/",
    loadingNotification: function() {
      return $("#contents").append('<p class="loading"></p>');
    },
    hideLoadingNotification: function() {
      return $('.loading').hide();
    }
  };
  (function($) {
    var app;
    app = $.sammy(function() {
      this.before(function() {
        blabbr.loadingNotification();
        return this.path = ajaxPath(this.path);
      });
      this.after(function() {
        subscribeToPusher('index');
        blabbr.hideLoadingNotification();
        if (typeof _gaq != "undefined" && _gaq !== null) {
          _gaq.push(['_trackPageview']);
          return _gaq.push(['_trackEvent', this.path, this.verb, 'blabbr']);
        }
      });
      if (history.pushState) {
        this.setLocationProxy(new Sammy.PushLocationProxy(this));
      }
      this.bind('getAndShow', function(e, infos) {
        var that;
        that = this;
        return $.ajax({
          type: "GET",
          url: infos.path,
          dataType: "html",
          success: function(data) {
            if (data != null) {
              that.trigger('showContent', {
                data: data,
                target: infos.target
              });
              if (infos.hash) {
                return that.trigger('moveTo', {
                  hash: infos.hash
                });
              }
            }
          }
        });
      });
      this.bind('showContent', function(e, data) {
        return $(data.target).show().html(data.data);
      });
      this.bind('moveTo', function(e, data) {
        return $.each([window.location.hash, data.hash], function(index, value) {
          if (value) {
            return $(value).livequery(function() {
              $(this).addClass('anchor');
              $('html,body').animate({
                scrollTop: $(this).offset().top
              }, 'slow');
              return $(value).livequery().expire();
            });
          }
        });
      });
      this.get(blabbr.prefix, function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: '#contents'
        });
      });
      this.get("" + blabbr.prefix + "topics", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      this.get("" + blabbr.prefix + "topics/new", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      this.post("/topics", function() {
        return postAndShow(this.path, this.params);
      });
      this.get("" + blabbr.prefix + "topics/page/:page_id", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: '#contents',
          hash: '#contents'
        });
      });
      this.get("" + blabbr.prefix + "topics/:id", function() {
        current_user.topic_id = this.params['id'];
        subscribeToPusher(this.params['id']);
        return this.trigger('getAndShow', {
          path: this.path,
          target: '#contents',
          hash: '#contents'
        });
      });
      this.get("" + blabbr.prefix + "topics/:id/edit", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      this.put("" + blabbr.prefix + "topics/:id", function() {
        postAndAdd(this.path, this.params);
        return getAndShow(this.path, "#contents", "#contents");
      });
      this.post('/topics/:id/posts', function() {
        return postAndAdd(this.path, this.params, '#posts');
      });
      this.post('/topics/:id/members', function() {
        return postAndAdd(this.path, this.params);
      });
      this.get("" + blabbr.prefix + "topics/:id/page/:page_id", function() {
        current_user.topic_id = this.params['id'];
        subscribeToPusher(this.params['id']);
        return this.trigger('getAndShow', {
          path: this.path,
          target: '#contents',
          hash: window.location.hash || '#contents'
        });
      });
      this.get("" + blabbr.prefix + "topics/:id/posts/:post_id/edit", function() {
        var post_id;
        post_id = this.params['post_id'];
        return $.ajax({
          type: "GET",
          url: this.path,
          dataType: "html",
          success: function(data) {
            if (data != null) {
              return showEdit(data, post_id);
            }
          }
        });
      });
      this.put("" + blabbr.prefix + "topics/:id/posts/:post_id", function() {
        return postAndReplace(this.path, this.params);
      });
      this.del("" + blabbr.prefix + "topics/:id/posts/:post_id", function() {
        return deletePost(this.path, this.params);
      });
      this.put("" + blabbr.prefix + "users/:id", function() {
        return postAndShow(this.path, this.params);
      });
      this.get("" + blabbr.prefix + "dashboard", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      this.get("" + blabbr.prefix + "smilies", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      this.get("" + blabbr.prefix + "smilies/new", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
      return this.get("" + blabbr.prefix + "users/:id", function() {
        return this.trigger('getAndShow', {
          path: this.path,
          target: 'aside'
        });
      });
    });
    return $(function() {
      return app.run(blabbr.prefix);
    });
  })(jQuery);
}).call(this);
