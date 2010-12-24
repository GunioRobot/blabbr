require 'spec_helper'

describe User do

  before :all do
    @user = Factory.build(:user)
  end

  describe "Fields" do
    it { User.fields.keys.should be_include('nickname')}
    it { User.fields['nickname'].type.should == String}

    it { User.fields.keys.should be_include('email')}
    it { User.fields['email'].type.should == String}

    it { User.fields.keys.should be_include('locale')}
    it { User.fields['locale'].type.should == String}

    it { User.fields.keys.should be_include('note')}
    it { User.fields['note'].type.should == String}

    it { User.fields.keys.should be_include('time_zone')}
    it { User.fields['time_zone'].type.should == String}

    it { User.fields.keys.should be_include('audio')}
    it { User.fields['audio'].type.should == Boolean}

    it { User.fields.keys.should be_include('posts_count')}
    it { User.fields['posts_count'].type.should == Integer}

    it { User.fields.keys.should be_include('gravatar_url')}
    it { User.fields['gravatar_url'].type.should == String}

    it { User.fields.keys.should be_include('attachments_count')}
    it { User.fields['attachments_count'].type.should == Integer}
  end

  describe 'validation' do

    describe "Factory should be valid" do
      it "should be valid" do
        @user.should be_valid
      end
    end

    describe "Uniqueness and presence validations" do

      before :each do
        Factory.create(:user)
      end

      it 'should required nickname' do
        Factory.build(:user, :nickname => '').should_not be_valid
      end

      it 'should required email' do
        Factory.build(:user, :email => '').should_not be_valid
      end

      it 'should not valid a nickname.size > 40' do
        Factory.build(:user, :nickname => "511843606ed9fcb0d1005a7b7b4e9598b07eae20-ea502f0c5590a49d7d429d880edfbc487fe99053").should_not be_valid
      end

      it 'should not valid if login is already taken' do
        Factory.build(:user, :nickname => 'one_user').should_not be_valid
      end

      it 'should not valid if email is already taken' do
        Factory.build(:user, :email => 'email@mail.com').should_not be_valid
      end
    end

    describe "Callbacks validations" do
      before :each do
        @user = Factory.create(:user)
      end

      it "should have a slug" do
        @user.reload.slug.should == @user.nickname.parameterize
      end

      it "should set a gravatar_url" do
        @user.reload.gravatar_url.should == "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(@user.email.downcase.strip)}.jpg?size="
      end
    end
  end

  describe 'named_scope' do

    before :each do
      @user = Factory.create(:user)
    end

    it "should be find by slug" do
      User.by_slug(@user.nickname.parameterize).first.nickname.should == @user.nickname
    end

    it "should be find by nickname" do
      User.by_nickname(@user.nickname).first.nickname.should == @user.nickname
    end

  end

  describe "User preferences" do
    before :each do
      @user = Factory.create(:user)
    end

    it "should update time_zone" do
      @user.time_zone = 'Paris'
      @user.save
      @user.reload.time_zone.should == 'Paris'
    end

    it 'should update audio preference' do
      @user.audio.should == true
      @user.audio = false
      @user.reload.audio == false
    end

  end

  describe "relations" do

     it "should embed many attachments" do
      relation = User.relations['attachments']
      relation.klass.should ==(Attachment)
      relation.relation.should ==(Mongoid::Relations::Embedded::Many)
    end
  end

end
