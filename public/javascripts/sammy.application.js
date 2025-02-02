var root = (history.pushState) ? "/" : "#/";
(function($) {

    var app = $.sammy(function() {

        this.notFound = function(verb, path) {
            document.location.href = path;
        }

        if (history.pushState) {
            this.setLocationProxy(new Sammy.PushLocationProxy(this));
        }

        this.before(function(){
            path = ajaxPath(this.path);
            loadingNotification();
        });

        this.after(function(){
            subscribeToPusher('index');
            if(typeof(_gaq) !== 'undefined'){
                _gaq.push(['_trackPageview']);
                _gaq.push(['_trackEvent', this.path, this.verb, 'blabbr']);
            }
        });

        this.get(root, function() {
            getAndShow(path, "#contents");
        });

        this.get(root + 'topics', function() {
            getAndShow(path, "aside");
        });

        this.get(root +'topics/new', function() {
            getAndShow(path, "aside");
        });

        this.post('/topics', function() {
            postAndShow(path, this.params);
        });

        this.get(root +'topics/page/:page_id', function() {
            getAndShow(path, "#contents", '#contents');
        });

        this.get(root +'topics/:id', function() {
            subscribeToPusher(this.params['id']);
            blabbr.topic_id = this.params['id'];
            getAndShow(path, "#contents", '#contents');
        });

        this.get(root +'topics/:id/edit', function() {
            getAndShow(path, "aside");
        });

        this.put('/topics/:id', function() {
            postAndAdd(path, this.params);
            getAndShow(path, "#contents", '#contents');
        });

        this.post('/topics/:id/posts', function() {
            postAndAdd(path, this.params, '#posts');
        });

        this.post('/topics/:id/members', function() {
            postAndAdd(path, this.params);
        });

        this.get(root +'topics/:id/page/:page_id', function() {
            blabbr.topic_id = this.params['id'];
            subscribeToPusher(this.params['id']);
            getAndShow(path, "#contents", '#contents');
        });

        this.get(root +'topics/:id/page/:page_id/:anchor', function() {
            blabbr.topic_id = this.params['id'];
            subscribeToPusher(this.params['id']);
            params = this.params;
            getAndShow("/topics/"+params['id']+"/page/"+params['page_id']+".js", "#contents", params['anchor']);
        });

        this.get(root +'topics/:id/posts/:post_id/edit', function() {
            var post_id = this.params['post_id'];
            $.ajax({
                type: "GET",
                url: path,
                dataType: "html",
                success: function(data){
                if (data) {
                    showEdit(data, post_id);
                }}
            });
        });

        this.put('/topics/:id/posts/:post_id', function() {
            postAndReplace(path, this.params);
        });

        this.del('/topics/:id/posts/:post_id', function() {
            deletePost(path, this.params);
        });

        this.get(root +'users/:id', function() {
            getAndShow(path, 'aside');
        });

        this.put('/users/:id', function() {
            postAndShow(path, this.params);
        });

        this.get(root +'dashboard', function() {
            getAndShow(path, 'aside');
        });

        this.get(root +'smilies', function() {
            getAndShow(path);
        });

        this.get(root +'smilies/new', function() {
            getAndShow(path, 'aside');
        });

    });

    $(function() {
         app.run(root);
    });

})(jQuery);
