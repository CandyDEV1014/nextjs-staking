import React from 'react'
import { images } from '../../assets/image'

interface IProps {
    totalLFGStaked: any
    count: any
}
function QuickView({ totalLFGStaked, count }: IProps) {
    return (
        <div className='AtQuickViewWrapper'>
            <div className="row">
                <div className="col-4">
                    <div className="AtQuickView">
                        <div>
                            <h1>TVL</h1>
                            <p>{totalLFGStaked || 0} LFG</p>
                        </div>
                        <img src={images.logo2.src} alt="" />
                    </div>
                </div>

                <div className="col-4">
                    <div className="AtQuickView">
                        <div>
                            <h1>Total stakers</h1>
                            <p>{count ? count : 0}</p>
                        </div>
                        <img src={images.ss1.src} alt="" />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default QuickView
