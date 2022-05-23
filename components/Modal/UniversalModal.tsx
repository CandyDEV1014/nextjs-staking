
import { Modal } from 'antd';
interface IProps {
    open: boolean
    onClose: Function
    title: string
    children: any
}
export const UniversalModal = ({ open, title, onClose, children }: IProps) => {
    return (
        <Modal
            title={<h4>{title}</h4>}
            centered
            visible={open}
            className="At-ProfilePopup"
            closable={true}
            footer={null}
            onCancel={() => onClose()}
        >
            {children}
        </Modal>
    )
}