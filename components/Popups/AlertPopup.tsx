import { Modal } from 'antd'
import React from 'react'

function AlertPopup({ show, closePopup }: any) {
  return (
    <Modal
      title={<h4>Claim avatar asset disclaimer</h4>}
      centered
      visible={show}
      className="At-PlaceBidPopupMain"
      closable={true}
      closeIcon={<i className='icon-close' style={{
        color: "white"
      }}></i>}
      footer={null}
      onCancel={() => closePopup(false)}
      width={450}
    >
      <div className="At-PlaceBidPopup center">
        <h3>
          You are not eligible for NFT airdrop whitelist. Please stake 10,000 LFG or more to enter within the first 10 days of our moon pool
        </h3>
      </div>
    </Modal>
  )
}

export default AlertPopup
