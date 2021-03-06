RSpec.describe Core::Repository::Articles::Fake do
  let(:article) { build :article_hash }
  let(:invalid_id) { 'fake' }
  let(:repository) { described_class.new(article) }

  describe '#find' do
    context 'when the article exists' do
      subject { repository.find(article['id']) }

      it { is_expected.to be_a(Hash) }
      specify { expect(subject['id']).to eq(article['id']) }

      it 'instantiates a valid Article' do
        expect(Core::Article.new(subject['id'], subject)).to be_valid
      end
    end

    context 'when the article is non-existent' do
      subject { repository.find(invalid_id) }

      it { is_expected.to be_nil }
    end
  end
end
