class Topic
  include Mongoid::Document
  include Mongoid::Timestamps

  field :creator
  field :title
  field :permalink
  field :posts_count, :type => Integer, :default => 1
  field :attachments_count, :type => Integer, :default => 0

  embeds_many :subscribers
  embeds_many :posts
  embeds_many :attachments

  attr_accessor :post

  before_validate :set_permalink
  validates_uniqueness_of :title, :permalink
  validates_presence_of :title, :permalink, :creator, :post

  before_save :update_count
  before_create :creator_as_subscribers, :add_post

  named_scope :by_permalink, lambda { |permalink| { :where => { :permalink => permalink}}}
  named_scope :by_subscribed_topic, lambda { |current_user| { :where => { 'subscribers.nickname' => current_user}}}

  def new_post(post)
    posts.create(:content => post.content, :nickname => post.nickname)
    set_unread(post)
    save
  end

  def new_subscriber(nickname)
    if User.by_nickname(nickname).first
      subscribers.create(:nickname => nickname, :unread => self.posts.size)
      save
    end
  end

  def new_attachment(nickname, attachment)
    attachments.create(:nickname => nickname, :attachment => attachment)
    save
  end

  def rm_subscriber!(nickname)
    subscribers.delete_if { |subscriber| subscriber.nickname == nickname }
    save
  end

  def reset_unread(nickname)
    subscribers.each { |s| s.unread = 0 if s.nickname == nickname }
    save
  end

  protected

  def set_permalink
    self.permalink = title.parameterize.to_s unless title.nil?
  end

  def update_count
    self.posts_count = posts.size
    self.attachments_count = attachments.size
  end

  def creator_as_subscribers
    subscribers << Subscriber.new(:nickname => creator)
  end

  def add_post
    posts << Post.new(:content => post, :nickname => creator)
  end

  def set_unread(post)
    subscribers.each do |subscriber|
      if subscriber.unread == 0
        subscriber.post_id = post.id
        subscriber.page = posts_count / PER_PAGE + 1
      end
      subscriber.unread += 1
    end
  end

end
