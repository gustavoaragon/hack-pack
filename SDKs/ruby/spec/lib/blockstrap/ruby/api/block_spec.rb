require 'spec_helper'

describe Blockstrap::Ruby::API::Block do

  before :each do
    stub_request(:any, /.*/)
  end

  shared_examples 'calling the correct endpoint' do
    let(:sample_url) { "#{prefix}/#{method}/#{param}" }
    let(:prefix) { 'http://api.blockstrap.com/v0/btc/block' }
    it 'calls the correct endpoint' do
      expect(block.send(method.to_sym, param)).to have_requested(:get, sample_url)
    end
  end

  let(:api) { Blockstrap::Ruby::API }
  let(:block) { api::Block.new }
  let(:id) { '000000000019D6689C085AE165831E934FF763AE46A2A6C172B3F1B60A8CE26F' }

  it 'can be instantiated' do
    expect(block).to_not be nil
  end

  describe '#id' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'id' }
      let(:param) { id }
    end
  end

  describe '#height' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'height' }
      let(:param) { id }
    end
  end

  describe '#latest' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'latest' }
      let(:param) { nil }
    end
  end

end
