import { useEffect, useState } from "react"
import { AddAvatarAction, GetAvatarAction } from "../../api/bakcend.api"


export default function Card({ id, button, image, title, price, lfg, blur, userAdd }: any) {

    const [name, setName] = useState('')
    const [avatarData, setAvatarData] = useState<any>(undefined)
    const [isFocused, setIsFocused] = useState<boolean>(false)

    useEffect(() => {
        if (userAdd) {
            fetchAvatar()
        }
    }, [userAdd])

    const fetchAvatar = async () => {
        let avat = await GetAvatarAction(userAdd)
        console.log("avater:-=-=", avat)
        if (avat.success && avat.data) {
            setAvatarData(avat.data)
            setName(avat.data.name)
        }
    }

    const onAddName = async () => {
        if (!name) return

        let data = { name, userAddress: userAdd, ...(avatarData?._id ? { id: avatarData._id } : null) }

        let res = await AddAvatarAction(data)
        fetchAvatar()
        // setName('')
    }
    return (

        <div className="At-Card">
            <div className="At-cardnumberartea">
             <em>{avatarData && avatarData._id ? `#${avatarData._id.slice(avatarData._id.length - 4, avatarData._id.length)}` : 'Pending'}</em>
                <div className="At-FCard">
                    <input type="text" placeholder="Add Avatar Name" className="AtCardInput" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
                    {isFocused && <button className="At-FCardBtn" onClick={() => onAddName()}>
                        Save
                    </button>}
                </div>
                <span>{button}</span>
            </div>
            <figure className={`At-CardImage ${blur && 'AtBlurImage'}`}>
                <img src={image} alt="card in=mage" />
            </figure>
            <div className="At-CardAction">
                <button className="At-CardActionBtn" onClick={() => console.log("action button click")}>Claim Avatar</button>
            </div>
            {/* <div className="At-Carddetail">
                <h3>{title}</h3>
                <span>{price}</span>
                <h4>{lfg} LFG </h4>
            </div> */}
        </div>
    )
}