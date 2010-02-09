ActionController::Routing::Routes.draw do |map|
  map.resources :sessions
  map.resources :users
  map.connect '/topics/page/:page', :controller => 'topics'
  map.connect '/topics/:id/page/:page', :controller => 'topics', :action => 'show'
  map.resources :topics, :has_many => :posts
  map.logout 'logout', :controller => 'sessions', :action => 'destroy'
  map.login 'login', :controller => 'sessions', :action => 'new'
  map.home 'home', :controller => 'users', :action => 'edit'

  map.root :controller => 'topics'
end

