require 'spec_helper'

describe Blockstrap::Ruby::API::Transaction do

  before :each do
    stub_request(:any, /.*/)
  end

  shared_examples 'calling the correct endpoint' do
    let(:sample_url) { "#{prefix}/#{method}/#{param}" }
    let(:prefix) { 'http://api.blockstrap.com/v0/btc/transaction' }
    it 'calls the correct endpoint' do
      expect(block.send(method.to_sym, param)).to have_requested(:get, sample_url)
    end
  end

  let(:api) { Blockstrap::Ruby::API }
  let(:block) { api::Transaction.new }
  let(:id) { '94C0BBEA9CE28A5631642252E0EEAE36F9DC91E62F87310B064CEC4BFCE9DCBA' }
  let(:txn_hex) { '0100000001ec71e2ceac8476bea21fbc4a97062c000f07def6c8ef8d9171fb1a5e113418e0010000008c493046022100e6f39b4393794ef03b0f9dc71395e0835a211015b42ab4329cb6a6c1c8b3c6ea022100f1ccae451f35e5c5ad25a8f7e7b5e778bafc4dc69dd560fab1cbadbb88767916014104e1934263e84e202ebffca95246b63c18c07cd369c4f02de76dbd1db89e6255dacb3ab1895af0422e24e1d1099e80f01b899cfcdf9b947575352dbc1af57466b5ffffffff0210270000000000001976a914652c453e3f8768d6d6e1f2985cb8939db91a4e0588ace065f81f000000001976a914cf0dfe6e0fa6ea5dda32c58ff699071b672e1faf88ac00000000'}

  it 'can be instantiated' do
    expect(block).to_not be nil
  end

  describe '#id' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'id' }
      let(:param) { id }
    end
  end

  describe '#relay' do
    pending
  end

  describe '#decode' do
    it_behaves_like 'calling the correct endpoint' do
      let(:method) { 'decode' }
      let(:param) { txn_hex }
    end
  end

end
