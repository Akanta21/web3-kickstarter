// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(msg.sender, minimum));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals; // no of people of approves;
    }

    Request[] public requests;
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(address sender, uint minimum) {
        manager = sender;
        minContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) 
        public restricted {
            Request storage newRequest = requests.push();

            newRequest.description = description;
            newRequest.value = value;
            newRequest.recipient = recipient;
            newRequest.approvalCount = 0;
            newRequest.complete = false;
    }

    // Search time for data structure
    // Find item in Array -> O(n)
    // Find item in Map -> O(1)


    // Lookup for data structure
    // Array -> O(1)
    // Map -> O(1)
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]); // check if user has voted on this address

        request.approvals[msg.sender] = true;

        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted payable{
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount/2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}