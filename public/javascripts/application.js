var titleHolder = document.title;

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

});

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
          if (userID != user_id)
          {
            notify();
          }
          hideLoadingNotification();
        }
    },'js');
}

function showEdit(data, id){
    $("#" + id).find('div').html(data);
    hideLoadingNotification()
}

function getAndShow(path, place) {
    $.ajax({
        type: "GET",
        url: path,
        dataType: "html",
        success: function(data){
        if (data) {
            showContent(data, place);
            setTitle($('.page-title').attr('title'));
            if (window.location.hash)
            {
              goToByScroll(window.location.hash);
            }
        }}
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

function postAndAdd(path, params) {
    $.ajax({
        type: "POST",
        url: path,
        dataType: "html",
        data: $.param(params.toHash()),
        success: function(msg){
            addContent(msg)
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
            showPost(url, data.user_id);
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

function addContent(data){
    $("#contents").append(data);
    hideLoadingNotification();
}

function notify() {
    lostFocus();
    blinkTitle(1);
    if (user_audio)
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

