module Blockstrap::Ruby::API
  class Address < BlockstrapAPI
    def id(address)
      self.class.get("/#{VERSION}/#{@chain}/address/id/#{address}")
    end

    def ids(addresses)
      addresses = addresses.join(',') if addresses.respond_to?(:join)
      self.class.get("/#{VERSION}/#{@chain}/address/ids/#{addresses}")
    end

    def transactions(address)
      self.class.get("/#{VERSION}/#{@chain}/address/transactions/#{address}")
    end

    def unspents(address)
      self.class.get("/#{VERSION}/#{@chain}/address/unspents/#{address}")
    end
  end
end
