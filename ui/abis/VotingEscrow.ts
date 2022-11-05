const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "CommitOwnership",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "ApplyOwnership",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "status",
        "type": "bool"
      }
    ],
    "name": "DepositsLockedChange",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "provider",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "locktime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "type",
        "type": "int128"
      },
      {
        "indexed": false,
        "name": "ts",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "provider",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "ts",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "prevSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "supply",
        "type": "uint256"
      }
    ],
    "name": "Supply",
    "type": "event"
  },
  {
    "inputs": [
      {
        "name": "token_addr",
        "type": "address"
      },
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_symbol",
        "type": "string"
      },
      {
        "name": "_version",
        "type": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "commit_transfer_ownership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "new_status",
        "type": "bool"
      }
    ],
    "name": "set_depositsLocked",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "apply_transfer_ownership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "commit_smart_wallet_checker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "apply_smart_wallet_checker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "get_last_user_slope",
    "outputs": [
      {
        "name": "",
        "type": "int128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_idx",
        "type": "uint256"
      }
    ],
    "name": "user_point_history__ts",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "locked__end",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkpoint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "deposit_for",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_unlock_time",
        "type": "uint256"
      }
    ],
    "name": "create_lock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "increase_amount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_unlock_time",
        "type": "uint256"
      }
    ],
    "name": "increase_unlock_time",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "_t",
        "type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "_block",
        "type": "uint256"
      }
    ],
    "name": "balanceOfAt",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "t",
        "type": "uint256"
      }
    ],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_block",
        "type": "uint256"
      }
    ],
    "name": "totalSupplyAt",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_newController",
        "type": "address"
      }
    ],
    "name": "changeController",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      }
    ],
    "name": "locked",
    "outputs": [
      {
        "name": "amount",
        "type": "int128"
      },
      {
        "name": "end",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "epoch",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "name": "point_history",
    "outputs": [
      {
        "name": "bias",
        "type": "int128"
      },
      {
        "name": "slope",
        "type": "int128"
      },
      {
        "name": "ts",
        "type": "uint256"
      },
      {
        "name": "blk",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "uint256"
      }
    ],
    "name": "user_point_history",
    "outputs": [
      {
        "name": "bias",
        "type": "int128"
      },
      {
        "name": "slope",
        "type": "int128"
      },
      {
        "name": "ts",
        "type": "uint256"
      },
      {
        "name": "blk",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      }
    ],
    "name": "user_point_epoch",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "name": "slope_changes",
    "outputs": [
      {
        "name": "",
        "type": "int128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "controller",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transfersEnabled",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositsLocked",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "future_smart_wallet_checker",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "smart_wallet_checker",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "future_admin",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default abi
