module Blockstrap::Ruby::API
  class Transaction < BlockstrapAPI
    def id(address)
      self.class.get("/#{VERSION}/#{@chain}/transaction/id/#{address}")
    end

    # TODO: support post
    def relay(txn_hex)
      self.class.get("/#{VERSION}/#{@chain}/transaction/relay/#{txn_hex}")
    end

    # TODO: support post
    def decode(txn_hex)
      self.class.get("/#{VERSION}/#{@chain}/transaction/decode/#{txn_hex}")
    end
  end
end