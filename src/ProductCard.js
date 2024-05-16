// ProductCard.js

import React, { useEffect, useState } from 'react';
import { useWeb3Context } from './Web3Context';
import './ProductCard.css';
const ProductCard = ({ product }) => {
  const { title, price, image, contract_addr, contract_abi } = product;

  const { mintNFT, NFTInfo } = useWeb3Context()

  const [info, setInfo] = useState({})

  // useEffect(() => {
  //   NFTInfo(contract_addr, contract_abi)
  //     .then(info => setInfo(info))
  // }, [])

  const handleBuyNow = () => {
    alert(`Purchased ${product.title} for ${product.price} ETH`);
    mintNFT(price, contract_addr, contract_abi);
  };

  return (
    <div className="product-card">
      <img className="product-image" src={product.image} alt={product.title} />
      <div className="product-details">
        <h3>{product.title}</h3>
        <p>Price: {product.price} ETH</p>
        <button onClick={handleBuyNow}>Buy Now</button>
      </div>
    </div>
  );
};

export default ProductCard;
