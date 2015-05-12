# Blockstrap::Ruby

To experiment with the code, run `bin/console` for an interactive prompt. This is (currently) a very thin wrapper of the Blockstrap API found [here](http://docs.blockstrap.com/en/api/)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'blockstrap-ruby'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install blockstrap-ruby

## Usage

We try our best to get good [test coverage](https://github.com/blockstrap/blockstrap-ruby/tree/master/spec) which both acts as a safety net, and also provides usage instructions as code. You may refer to the tests for further examples on how to use the API.

All APIs live in the namespace `Blockstrap::Ruby::API` and each of the endpoints will be living in their own respective classes.

The default chain is `btc` which corresponds to the BitCoin blockchain.

In order to use the API, you must first instantiate the class and receive an object which you can then call methods on. For example, to get information on an address inside the BTC blockchain:

    api = Blockstrap::Ruby::API::Address.new
    address = api.id('1GPCsaSYwH6jcUf3BmgqXD6G5q1ZxJ3gUK')

If you'd like to use the DogeCoin blockchain, you just need to pass the blockchain name during object instantiation:

    api = Blockstrap::Ruby::API::Transaction.new('doge')
    transaction = api.decode(txn_hex)

You can find the list of supported chains [here](http://docs.blockstrap.com/en/api/v0/notes/at-a-glance/).

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release` to create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## TODO

* add more tests that check for the return value of the api
* build an abstraction layer over the thin wrapper
* strategy to deal with usage and rate limits

## Contributing

1. Fork it ( https://github.com/[my-github-username]/blockstrap-ruby/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
