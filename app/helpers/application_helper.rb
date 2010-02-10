require 'digest/md5'

module ApplicationHelper

  def title(page_title)
    content_for(:title) { "Blabber - #{page_title}" }
  end
  
  def format_text(text)
    RedCloth.new(text).to_html(:textile, :glyphs_smilies)
  end
  
  def stylesheet(*args)
    content_for(:head) { stylesheet_link_tag(*args) }
  end
  
  def javascript(*args)
    content_for(:head) { javascript_include_tag(*args) }
  end
  
  def available_i18n
    dirs = Dir.entries("#{RAILS_ROOT}/config/locales/")
    
    locales = []
    dirs.each do |dir|
      unless dir == '.' || dir == '..'
        locales << dir.gsub(File.extname(dir), '')
      end
    end
    locales
  end
  
  def gravatar_url(email,gravatar_options={})
    gravatar_options[:size] ||= nil 
    gravatar_options[:default] ||= nil
    grav_url = 'http://www.gravatar.com/avatar.php?'
    grav_url << "gravatar_id=#{Digest::MD5.new.update(email)}" 
    grav_url << "&size=#{gravatar_options[:size]}" if gravatar_options[:size]
    grav_url << "&default=#{gravatar_options[:default]}" if gravatar_options[:default]
    grav_url
  end

end
