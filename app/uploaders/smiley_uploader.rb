class SmileyUploader < CarrierWave::Uploader::Base

  def store_dir
    'smilies'
  end

  def cache_dir
    "#{Rails.root}/tmp/uploads"
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end

  def max_file_size
    51200
  end

  def filename
    model.code + File.extname(super.to_s)
  end

end
