(($) ->
  window.app = $.sammy ->

    context = this

    # before and after filter
    #
    this.before () ->
      this.trigger 'loadingNotification'
      context.path = "#{this.path.split('#')[0]}.js"
      context.path_json = "#{this.path.split('#')[0]}.json"
      context.params = this.params
      context.title = $('title').text()

    this.after () ->
      this.trigger 'subscribeToWS', {id: 'index'}
      if _gaq?
        _gaq.push ['_trackPageview']
        _gaq.push ['_trackEvent', this.path, this.verb, 'blabbr']

    # bindings
    #
    this.bind 'loadingNotification', ->
      $("#contents").append '<p class="loading"></p>'

    this.bind 'hideLoadingNotification', ->
      $('.loading').hide()

    this.bind 'getAndShow', (e, infos) ->
      path = infos.path || context.path
      $.ajax {
        type: "GET"
        , url: path
        , dataType: "html"
        , success: (data) ->
          if data?
            context.trigger 'showContent', {data: data, target: infos.target}
            if infos.hash?
              context.trigger 'moveTo', {hash: infos.hash}
          context.trigger 'hideLoadingNotification'

      }

    this.bind 'posts', (e, data) ->
      $('.page-title').html('')
      context.trigger 'addContent', {data: ich.post(post), target: '.page-title'} for post in data.posts

    this.bind 'user', (e, data) ->
      context.trigger 'showContent', {data: ich.user(data), target: 'aside'}

    this.bind 'getAndShowJson', (e, infos) ->
      path = infos.path || context.path
      $.ajax {
        type: "GET"
        , url: context.path_json
        , dataType: "json"
        , success: (data) ->
          if data?
            context.trigger infos.type, data
            if infos.hash?
              context.trigger 'moveTo', {hash: infos.hash}
          context.trigger 'hideLoadingNotification'

      }

    this.bind 'postAndShow', ->
      $.ajax {
        type: "POST",
        url: context.path,
        dataType: "html",
        data: $.param(context.params.toHash()),
        success: (msg) ->
          context.trigger 'showContent', {data: msg, target: "#contents"}
      }

    this.bind 'postAndReplace', ->
      target = "##{context.params['post_id']} .bubble"
      $.ajax {
        type: "POST",
        url: context.path,
        dataType: "html",
        data: $.param(context.params.toHash()),
        success: (msg) ->
          context.trigger 'replaceContent', {data: msg, target: target}
          context.trigger 'hideLoadingNotification'
      }

    this.bind 'emptyAside', ->
      $('aside').html('')

    this.bind 'postAndAdd', (e, infos) ->
      $.ajax {
        type: "POST",
        url: context.path,
        dataType: "html",
        data: $.param(context.params.toHash()),
        success: (msg) ->
          context.trigger 'addContent', {data: msg, target: infos.target}
          context.trigger 'moveTo', {hash: infos.hash || infos.target}
          context.trigger 'hideLoadingNotification'
      }

    this.bind 'getAndReplace', (e, infos) ->
      target = "##{context.params['post_id']} .bubble"
      $.ajax {
        type: "GET"
        , url: context.path
        , dataType: "html"
        , success: (data) ->
          if data?
            context.trigger 'replaceContent', {data: data, target: target}
            context.trigger 'hideLoadingNotification'
      }


    this.bind 'showPost', (e, data) ->
      $.ajax {
        type: "GET"
        , url: data.path
        , dataType: "html"
        , success: (data) ->
          if data?
            $(data).hide().appendTo("#posts").show('slow')
            context.trigger 'notify'

      }

    this.bind 'deletePost', ->
      target = "##{context.params['post_id']} .bubble"
      $.ajax {
        type: "DELETE",
        url: context.path,
        data: $.param(context.params.toHash()),
        dataType: "html",
        success: (data) ->
          context.trigger 'replaceContent', {data: data, target: target}
          $("#edit_post_#{context.params['post_id']}").remove()
          context.trigger 'hideLoadingNotification'
      }

    this.bind 'deleteMember', (e, infos) ->
      $.ajax {
        type: "DELETE",
        url: context.path,
        data: $.param(context.params.toHash()),
        dataType: "html",
        success: (data) ->
          context.trigger 'addContent', {data: data, target: infos.target}
          context.trigger 'hideLoadingNotification'
      }

    this.bind 'showContent', (e, data) ->
      $(data.target).show().html data.data
      this.trigger 'updateTitle'

    this.bind 'addContent', (e, data) ->
      id = data.target || "#contents"
      $(id).append(data.data)

    this.bind 'replaceContent', (e, data) ->
      $(data.target).html(data.data)

    this.bind 'updateTitle', ->
      title = $('.page-title').attr 'title'
      $("#page-title").html title
      document.title = "Blabbr - #{title}"

    this.bind 'notify', ->
      context.trigger 'lostFocus'
      context.trigger 'blinkTitle', 1
      if current_user.audio?
        this.trigger 'audioNotification'

    this.bind 'lostFocus', ->
      window.isActive = false

    this.bind 'blinkTitle', (e, state) ->
      unless window.isActive
        if state == 1
          document.title = "[new!] - #{context.title}";
          state = 0
        else
          document.title = context.title
          state = 1
        setTimeout ->
          context.trigger 'blinkTitle', state
        , 1600
      else
        document.title = context.title

    this.bind 'audioNotification', ->
      $('body').append '<audio id="player" src="/sound.mp3" autoplay />'
      audio = $('#player')
      $(audio).bind 'ended', ->
        $(this).remove

    this.bind 'moveTo', (e, data) ->
      $.each [window.location.hash, data.hash], (index, value) ->
        if value?
          $(value).livequery () ->
            $(this).addClass('anchor')
            $('html,body').animate({scrollTop: $(this).offset().top},'slow')
            $(value).livequery().expire()

    this.bind 'subscribeToWS', (e, data) ->
      id = data.id
      unless pusher.channels.channels[id]
        channel = pusher.subscribe id
        channel.bind 'new-post', (data) ->
          url = "/topics/#{id}/posts/#{data.id}.js"
          if data.user_nickname != current_user.user_nickname && id == current_user.topic_id
            context.trigger 'showPost', {path: url, user_id: data.user_id}
        channel.bind 'index', (data) ->
          if $('aside #topics').length?
            context.trigger 'getAndShow', {path: '/topics.js', target: "aside"}

    this.bind 'topicId', ->
      current_user.topic_id = this.params['id']

    # routes
    #
    this.get '/', ->
      this.trigger 'getAndShow',  {target: '#contents'}

    this.get 'topics', ->
      this.trigger 'getAndShow',  {target: 'aside'}

    this.get 'topics/new', ->
      this.trigger 'getAndShow', {target: 'aside'}

    this.get 'topics/page/:page_id', ->
      this.trigger 'getAndShow', {target: '#contents', hash: '#contents'}

    this.get 'topics/:id', ->
      this.trigger 'getAndShowJson', {target: '#contents', hash: '#contents', type: 'posts'}
      this.trigger 'topicId'
      this.trigger 'subscribeToWS',  {id: this.params['id']}

    this.get 'topics/:id/edit', ->
      this.trigger 'getAndShow', {target: 'aside'}

    this.get 'topics/:id/page/:page_id', ->
      this.trigger 'getAndShow', {target: '#contents', hash: window.location.hash || '#contents'}
      this.trigger 'topicId'
      this.trigger 'subscribeToWS',  {id: this.params['id']}

    this.get 'topics/:id/posts/:post_id/edit', ->
      this.trigger 'getAndReplace', {target: this.params['post_id']}

    this.get 'dashboard', ->
      this.trigger 'getAndShow', {target: 'aside'}

    this.get 'smilies', ->
      this.trigger 'getAndShow', {target: 'aside'}

    this.get 'smilies/new', ->
      this.trigger 'getAndShow', {target: 'aside'}

    this.get 'users/:id', ->
      this.trigger 'getAndShowJson', {target: 'aside', type: 'user'}

    this.post '/topics', ->
      this.trigger 'postAndShow'
      this.trigger 'emptyAside'
      return

    this.post '/topics/:id/posts',->
      this.trigger 'postAndAdd', { target: '#posts', hash:'#new_post'}
      return

    this.put '/topics/:id/add_member',->
      this.trigger 'postAndAdd'
      return

    this.put '/topics/:id/rm_member',->
      this.trigger 'postAndAdd'
      return

    this.put 'topics/:id', ->
      this.trigger 'postAndAdd', {target: '#contents'}
      return

    this.put 'topics/:id/posts/:post_id', ->
      this.trigger 'postAndReplace'
      return

    this.del 'topics/:id/posts/:post_id', ->
      this.trigger 'deletePost'
      return

    this.get 'logout', (e) ->
      window.location = e.path

  $(->
    #app.run()
  )
)(jQuery)
