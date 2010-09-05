require 'carrierwave/orm/mongoid'

class User
  include Mongoid::Document
  include Mongoid::Timestamps

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  field :nickname
  field :permalink
  field :email
  field :identity_url
  field :posts_count, :type => Integer, :default => 0
  field :locale, :default => 'fr'
  field :note
  field :avatar
  field :gravatar_url
  field :attachments_count, :type => Integer, :default => 0

  embeds_many :attachments

  index :nickname
  index :permalink
  index :identity_url

  attr_accessible :nickname, :email, :password, :password_confirmation

  mount_uploader :avatar, AvatarUploader

  before_validation :set_permalink, :set_gravatar_url

  validates :nickname, :presence => true, :uniqueness => true, :length => { :maximum => 40 }
  validates :email, :presence => true, :uniqueness => true, :format => {:with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i}

  named_scope :by_permalink, lambda { |permalink| { :where => { :permalink => permalink}}}
  named_scope :by_nickname, lambda { |nickname| { :where => { :nickname => nickname}}}
  named_scope :by_identity_url, lambda { |identity_url| { :where => { :identity_url => identity_url}}}

  protected

  def set_permalink
    self.permalink = nickname.parameterize.to_s unless nickname.nil?
  end

  def set_gravatar_url
    hash = Digest::MD5.hexdigest(email.downcase.strip)[0..31]
    self.gravatar_url = "http://www.gravatar.com/avatar/#{hash}.jpg?size="
  end

end
