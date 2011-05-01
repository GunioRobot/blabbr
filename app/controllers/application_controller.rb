# encoding: utf-8
class ApplicationController < ActionController::Base
  layout :layout_by_resource
  protect_from_forgery
  helper_method :creator?
  before_filter :redirect_to_https, :set_user_time_zone
  after_filter :flash_to_headers, :set_user_preferences

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to :back, :alert => t('cancan.not_authorize')
  end

  protected

  def creator?(user)
    user == current_user.nickname
  end

  def get_smilies
    @smilies = JSON.parse(Rails.cache.read 'smilies_list')
    if @smilies.nil?
      Rails.cache.write('smilies_list', Smiley.all.flatten.to_json)
    end
  end

  def get_topic
    @topic = Topic.by_slug(params[:id]).first
  end

  def layout_by_resource
    if devise_controller?
      "sessions"
    else
      "application"
    end
  end

  def flash_to_headers
    flash.discard if request.xhr?
  end

  def redirect_to_https
    redirect_to :protocol => "https://" unless (request.ssl? || ENV['SSL'].nil?)
  end

  def set_user_time_zone
    Time.zone = current_user.time_zone if current_user && current_user.time_zone
  end

  def set_user_preferences
    if current_user
      cookies[:audio] = current_user.audio unless cookies[:audio]
      cookies[:user_nickname] = current_user.nickname unless cookies[:user_nickname]
    end
  end

end
