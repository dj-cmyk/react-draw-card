import React, {useState} from "react";

const Card = ({image, rotate}) => {
    return (
        <img src={image} alt="" className={`card card-rotate${rotate}`}/>
    )
}

export default Card;