RSpec.describe Section do
  subject { described_class.new }

  it { is_expected.to respond_to :name }
  it { is_expected.to respond_to :articles }
end
