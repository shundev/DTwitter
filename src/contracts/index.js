// ここに自分のコントラクトのアドレスとABIを入力
export const dtwitterContract = {
    address: "0x88fe4377be9d2c26f4ca1420a6d10b5c3728c91c",
    abi: [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "text",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "created_at",
				"type": "uint256"
			}
		],
		"name": "MessageSent",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "text",
				"type": "string"
			}
		],
		"name": "sendMessage",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getMessage",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMessages",
		"outputs": [
			{
				"name": "",
				"type": "uint256[20]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "messages",
		"outputs": [
			{
				"name": "sender",
				"type": "address"
			},
			{
				"name": "text",
				"type": "string"
			},
			{
				"name": "created_at",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
}
