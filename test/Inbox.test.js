const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there!";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // User one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send({ from: accounts[0], gas: "1000000" });

  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("should initialise with a message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it("should update the message when we call setMessage", async () => {
    const NEW_MESSAGE = "bye";
    await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, NEW_MESSAGE);
  });
});
