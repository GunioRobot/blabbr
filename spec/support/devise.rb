RSpec.configure do |config|
  config.include Devise::TestHelpers, :type => :controller
  include Warden::Test::Helpers
end
