// ProductCard.js

import React from 'react';
import { useWeb3Context } from './Web3Context';
import './ProductCard.css';
const ProductCard = ({ product }) => {
  const { title, price, image, contract_addr, contract_abi } = product;

  const { mintNFT, NFTInfo } = useWeb3Context()


  const handleBuyNow = () => {
    alert(`Are you sure to purchased ${product.title} for ${product.price} ETH ? `);
    mintNFT(price, contract_addr, contract_abi);
  };

  return (
    <div className="product-card">
      <img className="product-image" src={image} alt={title} />
      <div className="product-details">
        <h3>{title}</h3>
        <p>Price: {price} ETH</p>
        <button onClick={handleBuyNow}>Purchase Now</button>
      </div>
    </div>
  );
};

export default ProductCard;
