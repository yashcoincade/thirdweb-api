const express = require('express');
// const { ThirdwebSDK } = require('@thirdweb-dev/sdk/evm');
const { Alchemy, Network } = require('alchemy-sdk');

const app = express();
const PORT = 3000;
const nftAddress = '0x76a0377A4AD882e76E8C15ADA38A8218C961A945';
const userAddress = '0x8D8F7397258DdbcEf53DbE9b5e5cF73c684187e2';

const config = {
  apiKey: '0sQqyRAu_jKS8A35yNtYzL93LY_C_rJj',
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(config);

//Test
app.get('/', (req, res) => {
  res.send("Welcome to thirdweb's app");
});

/**
 * @notice This API end-point provides RaceCade Car NFTs owned by a user
 * @dev We have used Alchemy SDK to make this API call
 */
app.get('/getUserOwnedNFTs/:userAddress', async (req, res) => {
  const userAddressByQuery = req.params.userAddress;
  // Get all NFTs owner by connected user
  const nfts = await alchemy.nft.getNftsForOwner(userAddressByQuery);
  if (nfts) {
    const mappedNFTs = nfts.ownedNfts.filter(function (nft) {
      return nft.contract.address == nftAddress.toLowerCase();
    });
    res.status(200).json(mappedNFTs);
    // console.log(mappedNFTs);
  } else {
    res.status(404).json({
      error: 'User does not exist',
    });
  }
});

/**
 * @notice This API end-point provides Total number of RaceCade Car NFTs owned by a user
 * @dev We have used Thirdweb SDK to make this API call
 */
// app.get('/getNFTs', async (req, res) => {
//   const sdk = new ThirdwebSDK('mumbai');
//   const contract = await sdk.getContract(
//     '0x76a0377A4AD882e76E8C15ADA38A8218C961A945'
//   );
//   const data = await contract.call('balanceOf', [userAddress]);
//   if (data) {
//     console.log('NFTs owned by connected wallet: ', data);
//     res.status(200).json(data.toString());
//   } else {
//     res.status(404).json({
//       error: 'Owner does not exist',
//     });
//   }
// });

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
