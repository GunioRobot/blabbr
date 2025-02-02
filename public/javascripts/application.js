var titleHolder = document.title;

var blabbr = new blabbr();

jQuery(function($){


    $('input.autocomplete').livequery(function()
    {
        $(this).each(function()
        {
            var $input = $(this);
            $input.autocomplete($input.attr('data-autocomplete-url'));
        });
    });

    $("#new_smiley").livequery(function()
    {
        $(this).sexyPost({
            onprogress: function(event, completed, loaded, total) {
              $("#status").text("Uploading: " + (completed * 100).toFixed(2) + "% complete...");
            },
            oncomplete: function(event, responseText) {
              $("#status").text("Upload complete.");
            }
        });
    });

    if (!history.pushState)
    {
        $("a[href^=/][class!='no-ajax']").livequery(function()
        {
            var href= $(this).attr('href');
            $(this).attr('href', '#'+href.replace('#', '/'));
        });
    }

    $(".simple_form.user").livequery(function()
    {
        $(this).sexyPost({
            onprogress: function(event, completed, loaded, total) {
              $("#status").text("Uploading: " + (completed * 100).toFixed(2) + "% complete...");
            },
            oncomplete: function(event, responseText) {
              $("#status").text("Upload complete.");
            }
        });
    });

    $('html').mouseover(function()
    {
        gainedFocus();
    });

    $('.bubble p, .bubble ul')
    .live('click', function(e) {
        if ($(e.target).is('p, ul'))
        {
          var user = $(this).parent().get(0).getAttribute("data_user");
          insertQuote($(this).text(), user)
        }
    });

    $('#flash_notice').livequery(function()
    {
        $.blabbrNotify('success', $(this).text());
        $(this).remove();
    });

});

function blabbr() {
  return {
    user_id: $.cookie('user_id'),
    topic_id: null,
    audio: $.cookie('audio')
  }
}

function insertQuote(content, user) {
    $('#post_body').val($('#post_body').val() + "bq..:" + user + " " + content + " \n\np. ");
}

function ajaxPath(path) {
    return (history.pushState) ? '/'+path.substr(1)+'.js' :  path.substr(1)+'.js';
}

function showPost(url, userID){
    $.get(url,function(data){
        if (data) {
          $(data).hide().appendTo("#posts").show('slow');
          if (userID != blabbr.user_id)
          {
            notify();
          }
          hideLoadingNotification();
        }
    },'js');
}

function showEdit(data, id){
    $("#" + id).find('.bubble').html(data);
    hideLoadingNotification()
}

function getAndShow(path, place, hash) {
    $.ajax({
        type: "GET",
        url: path,
        dataType: "html",
        success: function(data){
        if (data) {
            showContent(data, place);
            setTitle($('.page-title').attr('title'));
            $.each([window.location.hash, hash], function(index, value) {
                if (value)
                {
                    goToByScroll(value);
                    return false;
                }
            });
        }}
    });
}

function deletePost(path, params) {
    $.ajax({
        type: "DELETE",
        url: path,
        data: $.param(params.toHash()),
        dataType: "html",
        success: function(msg){
            replaceContent(msg, params['post_id']);
            $('#edit_post_'+params['post_id']).remove()
        }
    });
}

function postAndShow(path, params) {
    $.ajax({
        type: "POST",
        url: path,
        dataType: "html",
        data: $.param(params.toHash()),
        success: function(msg){
            showContent(msg, "#contents")
        }
    });
}

function postAndReplace(path, params) {
    $.ajax({
        type: "POST",
        url: path,
        dataType: "html",
        data: $.param(params.toHash()),
        success: function(msg){
            replaceContent(msg, params['post_id'])
        }
    });
}

function postAndAdd(path, params, id) {
    $.ajax({
        type: "POST",
        url: path,
        dataType: "html",
        data: $.param(params.toHash()),
        success: function(msg){
            addContent(msg, id)
        }
    });
}

function subscribeToPusher(id) {
    if (!pusher)
    {
        pusher = new Pusher($('body').attr('id'));
    }
    if (!pusher.channels.channels[id])
    {
        var channel = pusher.subscribe(id);
        channel.bind('new-post', function(data) {
            var url = "/topics/"+id+"/posts/"+data.id+".js";
            if (data.user_id != blabbr.user_id && id == blabbr.topic_id)
            {
                showPost(url, data.user_id);
            }
        });
        channel.bind('index', function(data) {
            if ($('aside #topics').length)
            {
                getAndShow('/topics.js', "aside");
            }
        });
    }
}

function showContent(data, place){
    $(place).show().html(data);
    hideLoadingNotification()
}

function setTitle(title) {
    $("#page-title").html(title);
    document.title = "Blabbr - " + title;
}

function replaceContent(data, id){
    $("#"+id+" .bubble").html(data);
    hideLoadingNotification()
}

function addContent(data, id){
    var id = id || "#contents";
    $(id).append(data);
    hideLoadingNotification();
}

function notify() {
    lostFocus();
    blinkTitle(1);
    if (blabbr.audio)
    {
        audioNotification();
    }
}

function blinkTitle(state) {
    if (windowIsActive != true) {
      if (state == 1) {
        document.title = "[new!] - " + titleHolder;
        state = 0;
      } else {
        document.title = "" + titleHolder;
        state = 1;
      }

      setTimeout("blinkTitle(" + state + ")", 1600);
    } else {
      document.title = titleHolder;
    }
}

function audioNotification() {
    $('body').append('<audio id="player" src="/sound.mp3" autoplay />');
    var audio = $('#player');
    $(audio).bind('ended', function()
    {
        $(this).remove;
    });
}

function lostFocus() {
    windowIsActive = false;
}

function gainedFocus() {
    windowIsActive = true;
}

function loadingNotification() {
    $("#contents").append('<p class="loading"></p>');
}

function hideLoadingNotification() {
    $('.loading').hide();
}

function goToByScroll(id){
    $(id).livequery(function()
    {
        $(this).addClass('anchor');
        $('html,body').animate({scrollTop: $(this).offset().top},'slow');
        $(id).livequery().expire();
    });
}

