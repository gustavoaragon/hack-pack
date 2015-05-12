require 'spec_helper'

describe Blockstrap::Ruby::API::Address do

  before :each do
    stub_request(:any, /.*/)
  end

  shared_examples 'calling the correct endpoint' do
    let(:sample_url) { "#{prefix}/#{method}/#{param}" }
    let(:prefix) { 'http://api.blockstrap.com/v0/btc/address' }
    it 'calls the correct endpoint' do
      expect(address.send(method.to_sym, param))
        .to have_requested(:get, sample_url)
    end
  end

  let(:api) { Blockstrap::Ruby::API }
  let(:address) { api::Address.new }
  let(:id) { '1GPCsaSYwH6jcUf3BmgqXD6G5q1ZxJ3gUK' }
  let(:id2) { ['16sEpWHMLZDUueqRQ8qKwjXCeJKaL8AbZB', '18cGae7j8DmHjYBX19kYju3pZ1ccSu7F6N'] }

  it 'can be instantiated' do
    expect(address).to_not be nil
  end

  describe '#id' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'id' }
      let(:param) { id }
    end
  end

  describe '#ids' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'ids' }
      let(:param) { id2.join(',') }
    end
  end

  describe '#unspents' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'unspents' }
      let(:param) { id }
    end
  end

  describe '#transactions' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'transactions' }
      let(:param) { id }
    end
  end

end
