## Welcome to BlockAuth

BlockAuth is __an early open-beta preview experiementing with blockchain authentication.__

BlockAuth allows users and site owners to verify an identity without the need for an email address or other data that users may wish to keep private. How much (or how little) of your identity you wish to reveal is up to you. 

BlockAuth is currently in an early beta state so would appreciate your feedback and contributions to improve the specification - as well as your understanding that this current prototype is not reflective of the final service or its potential. The code is open source and available to view, pull, and edit via our [public GitHub repository](https://github.com/Neuroware-IO/blockauth). Bug fixes and contributions from the community are very much welcomed. 

## How it Works

#### Registration Specifications

The following fields are required for registration:

* __Display Name__ (this is stored publicly in the blockchain and can be called by external services)
* __Username__ (a SHA256 of this is sent to the server to be used to help form the `UID`)
* __Password__ (a SHA256 of this is also sent to the server to be used with the `UID`)
* __Blockchain__ (used to reference the blockchain used, which is required for authenticating)

These fields should then be sent to the server for registration using the following process:

* __UID__ = Additional SHA256 (user_salt + hashed_username)
* __PASSWORD__ = Additional SHA256 (`UID` + hashed_password)
* __ADDRESS HASH__ = Additional SHA256 (address_salt + `UID` + PASSWORD)

With the salts added server-side, the client should recieve the following JSON object:

<!--pre-javascript-->
```
{
    hash: "ADDRESS_HASH",
    address: "DEFAULT_RETURN_ADDRESS_SET_BY_CONFIG"
}
```

Please note that the salts for the demo below are currently set as follows:

<!--pre-javascript-->
```
{
    cookie: 123,
    username: 456,
    address: 789
}
```

This provides flexibility and some form of future-proofing to allow for either different version numbers of specifications and (or) external services to force indepednent registrations. Since the salts are stored server side, they are theoretically difficult to obtain and make brute forcing the password much more difficult. They also allow for flexibility in design, as to whether or not different services can support the same users or not.

When the hash is obtained we can use this client-side to generate a new address and periodically poll that address to ascertain whether it has any unspent transactions. The moment it does, all of the balance is returned to the recorded address and the login credentials are encoded into the `op_return` for that transaction.

The private key belonging to the newly generated address is used to further hash the `UID`:

<!--pre-javascript-->
```
var uid = bitcoin.crypto.sha256(private_key + uid).toString('hex');
```

The final `UID` is then used to re-hash the password prior to it being encoded in the `op_return`:

<!--pre-javascript-->
```
var stored_password = bitcoin.crypto.sha256(uid + password).toString('hex');
```

The `UID` should be returned to the user and a JSON string added to the `op_return` as follows:

<!--pre-javascript-->
```
{
    "n": "DISPLAY_NAME",
    "pw": "PASSWORD_TRIMMED_TO_FIT_OP_LIMIT"
}
```

In all honesty, it is the UID that is the most __secure__ component to this method. The choice to expose it later through DNKeys drastically reduces the level of security (for now).

Please note that the length of the final hashed password that is stored is dependent upon the length of the display name stored and the `OP_RETURN` limit of the relevant blockchain. Some implementations have a 40 byte limit, which would mean even a name as short as __John Doe__ would only be able to store 18 characters from their hashed password.

Once the transaction has been confirmed, the relevant `TXID` should also be returned to the user along with the `UID`and blockchain:

* __`UID`__ = 86e0ae3dfc5adf865b8ddbfe669fee1d2916ddda3e28ce83ed3ca489a0b6fd4b
* __`PWID`__ (The Transaction ID) = 57068f4ffba9f08308ef2c2769f425233a68c11199e872336232d2a08e6a4e8f
* __`CHAIN`__ = doget (representing Dogecoin Testnet)

-----

#### DNKey Specifications

If remembering a `UID` and `PWID` (on-top of the actual password) is too much you can choose to use [DNKeys](http://dnkey.org), which allow you to simply remember a username and password instead. However, please note that by using publically available DNS TXT records to pair UIDs and PWIDs, you will also be revealing slightly more informtion about who you are in the process.

When a registration process supporting DNKeys sends back the UID, PWID and Chain, it should also return the required value that the user would need to add to their DNS TXT records, which should look like this:

<!--pre-html-->
```
dnkey-blockauth-XXX=YYY_ZZZ
```

`XXX` represents the blockchain storing the credentials. `YYY` represents the UID and `ZZZ` represents the PWID.

Adding the above record to the DNS TXT record for `name.domain.com` sets that as your username. Having a username allows you to replace the need for remembering the `UID` and `PWID` and simply remember your sub-domain instead.

-----

#### Authentication Specifications

If the client __does not__ support DNKeys, the required fields (otherwise ascertained from the DNKey results) are as follows:

* UID
* PWID
* Blockchain
* Password

If the client __does__ supports [DNKeys](http://dnkey.org) all you need to input is the following:

* DNKey
* Password

The DNKey contains the `UID`, `PWID` and selected Blockchain, e.g `btc`.

The `PWID` is the transaction ID from where the credentials are stored.

Looking it up [via an API](http://api.blockstrap.com/v0/doget/transaction/id/57068f4ffba9f08308ef2c2728f425233a68c11199e872336232d2a08e6a4e8f?showtxnio=1&prettyprint=1) should result in seeing outputs similar to the following:

<!--pre-javascript-->
```
outputs: [
    {
        pos: 0,
        script_pub_key: "76A9145EBC3C0FF4955F96E3F4940B0749CCEAA1E5186888AC",
        pubkey_hash: "5EBC3C0FF4955F96E3F4940B0749CCEAA1E51868"
    },
    {
        pos: 1,
        script_pub_key: "6A4C4F7B226E223A224D61726B20536D616C6C6579222C227077223A22333736643762626261386266386563613736333235623135316164623739666135343730643635653364333465383132373837227D",
        pubkey_hash: null
    }
]
```

Please notice the `script_pub_key` on line 09. When decoded, it reads:

<!--pre-html-->
```
OP_RETURN 7b226e223a224d61726b20536d616c6c6579222c227077223a22333736643762626261386266386563613736333235623135316164623739666135343730643635653364333465383132373837227d
```

When the hex value following the OP_RETURN is decoded, you should find the following JSON:

<!--pre-javascript-->
```
{
    n: "Mark Smalley",
    pw: "376d7bbba8bf8eca76325b151adb79fa5470d65e3d34e812787"
}
```

The current capacity for this method is 80 bytes, which is the __fuly__ utilized by this current implementation. Please note that the length of the final password stored is dependent upon the length of the display name stored and the OP_RETURN limit of the relevant blockchain. Since some implementations have a 40 byte limit when sending to the mainnet, such cases would mean that even a name as short as __John Doe__ would only be able to store 18 characters from their hashed password onto the blockchain.

-----

#### Why do we require a UID and PWID?

The hashed password that is stored on the blockchain uses the `UID` as part of the hashing process, so you can't have that saved in the same location as the encoded transaction, else it is at risk of random brute-forcing on any encoded transactions found when pruning the public ledgers. The use of the DNKey allows you to store the `UID` in the same place that a reference to the hashed password can be found. Although this makes the process of remembering your credentials much easier, replacing the `UID` and `PWID` with a simple username also exposses the link between the `UID` and the password whilst also linking the registration of that domain to the UID. We are working on a new version of the specification which will leave this attack vector less vulnerable. Your ideas on making this possible are welcomed and encouraged.

## Examples & Demos

Please note that if you are visting this documentation from [blockauth.org](http://blockauth.org) there is a basic example that can be seen working below which is also included within the [public repo](https://github.com/Neuroware-IO/blockauth) that powers this website. The documentation seen on [blockauth.org](http:/blockauth.org) is the same README-powered documentation seen within the public [GitHub](https://github.com/Neuroware-IO/blockauth) repository.

Please also note that the [Blockstrap PHP SDK](https://github.com/blockstrap/blockstrap-php) also supports BlockAuth. and has a basic PHP $_POST example, as opposed to the official AJAX example seen at [blockauth.org](http://blockauth.org).

## Caveats

__This is still an experiemental prototype and should not yet be used in production.__

We will continue working on a list of known flaws and logging our progress [via the public GitHub repo](https://github.com/Neuroware-IO/blockauth). 

## More Information

More infomration can be seen within the following additional README files:

* [BlockAuth Transaction Details](https://github.com/Neuroware-IO/blockauth/blob/master/docs/blockauth-tx-details.md)