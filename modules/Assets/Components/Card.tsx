import React, { Fragment } from "react";
import Link from "next/link";
import { images } from "../../../assets/image";
import Card from "../../../components/Card/Card";

const cards = [
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },
    {
        id: '#13435',
        button: 'Genesis',
        image: images.card.src,
        title: 'Gamerse Avatar nft' ,
        price: 'Price',
        lfg: '500',
    },

]

export default function CardList(){
    return(
        <Fragment>
            {cards.map((card) => (
                <Link href='/AboutPage'>
                    <a>
                        <Card id={card.id} button={card.button} image={card.image} title={card.title} price={card.price} lfg={card.lfg}/>
                    </a>
                </Link>
             ))}
        </Fragment>
    )
}