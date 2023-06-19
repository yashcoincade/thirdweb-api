const express = require('express');
const { Alchemy, Network } = require('alchemy-sdk');
const { ethers } = require('ethers');

const app = express();
const PORT = 3000;
const userAddress = '0x8D8F7397258DdbcEf53DbE9b5e5cF73c684187e2';
const nftAddress = '0x76a0377A4AD882e76E8C15ADA38A8218C961A945';
const abi = [
  {
    type: 'constructor',
    name: '',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'OperatorNotAllowed',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
    ],
    outputs: [],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'approved',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ApprovalForAll',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'operator',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'bool',
        name: 'approved',
        indexed: false,
        internalType: 'bool',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        type: 'address',
        name: 'previousOwner',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'newOwner',
        indexed: true,
        internalType: 'address',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        type: 'address',
        name: 'account',
        indexed: false,
        internalType: 'address',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        type: 'address',
        name: 'from',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        indexed: true,
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        type: 'address',
        name: 'account',
        indexed: false,
        internalType: 'address',
      },
    ],
    outputs: [],
    anonymous: false,
  },
  {
    type: 'function',
    name: 'OPERATOR_FILTER_REGISTRY',
    inputs: [],
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IOperatorFilterRegistry',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'batchMint',
    inputs: [
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'string',
        name: 'uri',
        internalType: 'string',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getApproved',
    inputs: [
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isApprovedForAll',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ownerOf',
    inputs: [
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'royaltyInfo',
    inputs: [
      {
        type: 'uint256',
        name: '_tokenId',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: '_salePrice',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'safeMint',
    inputs: [
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'string',
        name: 'uri',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'safeTransferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'safeTransferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
      {
        type: 'bytes',
        name: 'data',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setApprovalForAll',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
      {
        type: 'bool',
        name: 'approved',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setTokenURI',
    inputs: [
      {
        type: 'uint256',
        name: '_tokenId',
        internalType: 'uint256',
      },
      {
        type: 'string',
        name: '_uri',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [
      {
        type: 'bytes4',
        name: 'interfaceId',
        internalType: 'bytes4',
      },
    ],
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        type: 'address',
        name: 'newOwner',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

const rpcUrl =
  'https://polygon-mumbai.g.alchemy.com/v2/0sQqyRAu_jKS8A35yNtYzL93LY_C_rJj';

const privateKey =
  '7df0be03e56113b874c305e5e3823aaa9c1356d5e5e93d631a53422a78245850';

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(nftAddress, abi, signer);

const config = {
  apiKey: '0sQqyRAu_jKS8A35yNtYzL93LY_C_rJj',
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(config);

app.use(express.json());

//Test
app.get('/', (req, res) => {
  res.send("Welcome to thirdweb's app");
});

/**
 * @notice This API end-point provides RaceCade Car NFTs owned by a user
 * @dev We have used Alchemy SDK to make this API call
 */
app.get('/api/public/v0/getUserOwnedNFTs/:userAddress', async (req, res) => {
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
 * @notice This API end-point Free mints a new car to connected user's wallet
 */
app.post('/api/public/v0/freeMint', async (req, res) => {
  const connectedWallet = req.body.connectedUser;

  try {
    const tx = await contract.safeMint(
      connectedWallet,
      'ipfs://QmVMsgQvxRWikR8dxGwbMXXoYbxpe1eYbVRCx48ekp9MuG'
    );
    // console.log('NFT minted Successfully => ', tx);
    return res.status(200).json({
      success: 'NFT Minted successfully',
      transaction: tx,
    });
  } catch (err) {
    res.status(404).json({
      error: 'NFT Could not be mentioned',
    });
    // console.error('Error => ', err);
  }
});
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
