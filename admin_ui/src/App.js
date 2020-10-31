import React, { Component } from 'react'
import PACKER from "./contracts/PACKER.json"
const Web3 = require('web3');

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lb: "",
      account: "",
      contract: "",
      totalSupply: "",
      orderID: "",
      cur_NFT: [],
      userOrders: []
    }

    this.web3 = null
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.web3 = new Web3(
        new Web3.providers.HttpProvider('http://127.0.0.1:7545')
      );
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.getContract()
    window.web3.eth.getBlock('latest').then((lb) => { console.log(lb); this.setState({ lb }) })
    setInterval(async ()=>{
      await this.getUserOrders()
    }, 1000)
  }

  async getContract() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = PACKER.networks[networkId]
    if (networkData) {
      const abi = PACKER.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)

      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })

    } else {
      window.alert('contract not deployed!')
    }
  }

  async mintNFTS(nfts){
    for (var item of nfts){
      console.log("k",item, this.state.account)
      try{
      await this.state.contract.methods.mint(item.id, item.items).send({from:this.state.account, 
                                                                        gas:"4000000",
                                                                      })
                                                                        .on('error', (err) => {
                                                                          if (err) {
                                                                            console.log(err);
                                                                          }
                                                                        });
                                                                      }catch{}
                                                                      }

  }

  async getOrderNFT(id) {
    console.log(id)
    let nft = await this.state.contract.methods.getOrder(id.toString()).call({from: this.state.account}, (error, result) => {
                                                                                                                                // never executed
                                                                                                                                console.log("RESULT", result);
                                                                                                                                console.log("ERR", error);
                                                                                                                            });
    this.setState({ cur_NFT: nft})
    console.log(nft)
  }

  async getUserOrders() {
    let response = await fetch("http://0.0.0.0:5000");

    if (response.ok) { // if HTTP-status is 200-299
      // get the response body (the method explained below)
      let json = await response.json();
      console.log(json)
      await this.mintNFTS(json)
      if (json !== this.state.userOrders){
        this.setState({ userOrders: json })
      }
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }

  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", marginLeft: "2%", marginTop: "2%", flexDirection: "column", width: "55vw", justifyContent: "center", alignItems: "center", borderRadius: 20, borderColor: "#7428", borderStyle: "solid" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "row", marginTop: "1vh" }}>
                <input style={{ width: "15vw", height: "5vh", borderRadius: 12, borderStyle: "solid" }} placeholder="Order ID" onChange={(value) => { this.setState({ orderID: value.target.value }) }}></input>
                <button style={{ borderRadius: 12, borderStyle: "none", marginLeft: "1vw" }} onClick={async () => { await this.getOrderNFT(this.state.orderID) }}>Show NFT with ID: {this.state.orderID}</button>
              </div>
              <h1>Owner account: {this.state.account}</h1>
              <h1>Total available NFTs: {this.state.totalSupply}</h1>
            </div>
          </div>

          <div style={{ display: "flex", marginLeft: "2%", marginTop: "2%", flexDirection: "column", width: "25vw", justifyContent: "center", alignItems: "center", borderRadius: 20, borderColor: "#7428", borderStyle: "solid" }}>
            <h1>Incoming ORDERS</h1>
            {
                  this.state.userOrders.map((item) => {
                    return (
                      <div key={Math.random()}>
                        <h1>ID: {item.id}</h1>
                        <hr />
                      </div>
                    )
                  })
                }
          </div>
        </div>

        <div style={{ display: "flex", marginLeft: "2%", marginTop: "2%", flexDirection: "column", width: "50vw", justifyContent: "centre", alignItems: "flex-start", borderRadius: 20, borderColor: "#7428", borderStyle: "solid" }}>
          {
            this.state.cur_NFT.length > 0 ?
              <div style={{ marginLeft: "1vw" }}>
                <h1>NFT: {this.state.orderID} Order Content</h1>
                {
                  this.state.cur_NFT.map((item) => {
                    return (
                      <div key={item}>
                        <h1>{item}</h1>
                        <hr />
                      </div>
                    )
                  })
                }
              </div>
              :
              <h1>...</h1>
          }
        </div>
      </div>
    )
  }
}

