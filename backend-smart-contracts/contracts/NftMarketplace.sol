// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NftNotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotNftOwner();
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NoProceeds();
error NftMarketplace__TransferFailed();
error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 listedItemPrice
);

contract NftMarketplace is ReentrancyGuard {
    // Type Declarations

    struct Listing {
        uint256 price;
        address seller;
    }

    // Events
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemCancelled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    event UpdatedListing(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // Marketplace Variables

    // NFT contract address => NFT tokenId => Listing
    mapping(address => mapping(uint => Listing)) private s_listings;

    // Seller address => Amount earned
    mapping(address => uint256) private s_proceeds;

    /////////////////////
    // Modifiers       //
    /////////////////////

    modifier isNotListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isNftOwner(
        address nftAddress,
        uint256 tokenId,
        address sender
    ) {
        IERC721 nftContract = IERC721(nftAddress);
        address owner = nftContract.ownerOf(tokenId);
        if (owner != sender) {
            revert NftMarketplace__NotNftOwner();
        }
        _;
    }

    /////////////////////
    // Main Functions  /
    ///////////////////

    /*
     * @notice Method for listing a NFT on the marketplace
     * @param nftAddress : Addrress of the NFT contract
     * @param tokenId : The Token ID of the NFT
     * @param price : sale price of the listed NFT
     * @dev Technically, we could have the contract be the escrom for the NFTs
     * but this way people can still hold their NFT's when listed.
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isNotListed(nftAddress, tokenId)
        isNftOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NftNotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant isListed(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721 nftContract = IERC721(nftAddress);
        nftContract.safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        // Check to make sure the NFT was transferred
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelItem(
        address nftAddress,
        uint tokenId
    )
        external
        isNftOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external {
        s_listings[nftAddress][tokenId].price = newPrice;
        emit UpdatedListing(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withDrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NftMarketplace__TransferFailed();
        }
    }

    //////////////////////
    // GetterFunctions //
    ////////////////////

    function getListing(
        address nftAddress,
        uint tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}

// 1. `listItem`: List NFT's on the marketplace ✅
// 1.1 There are 2 ways to do this
// 1.1.1 Send the NFT to the marketplace contract(Transfer -> Contract "hold" the NFT)
// 1.1.2 Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them

// 2. `buyItem`: Buy the NFT's ✅
// 2.1 We use pull over push technique rather than sending the amount to seller after nft is sold
// Rather we just create a mapping of how much the seller has earned and then the seller can withdraw.
// This way we shift the risk of transfering the ether to the seller and user can withraw according to his convinience
// 2.2 We make the contract safe from reentrancy attacks
// By making all the state changes before making any external calls

// 3. `cancelItem`: Cancel a listing
// 4. `UpdateListing`: Update Price
// 5. `withdrawProceeds`: Withdraw payment for my bought NFT's
