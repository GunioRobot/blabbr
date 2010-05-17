require 'carrierwave/orm/mongoid'

class Attachment
  include Mongoid::Document
  include Mongoid::Timestamps

  field :nickname
  field :attachment

  mount_uploader :attachment, AttachmentUploader

  embedded_in :attachmentable, :inverse_of => :attachments

  validates_presence_of :nickname

  before_create :update_attachments_count

  protected

  def update_attachments_count
    self.attachmentable.attachments_count += 1
  end

end
