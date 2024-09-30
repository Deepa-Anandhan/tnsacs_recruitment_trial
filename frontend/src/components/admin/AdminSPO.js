import Detail from './detail'
import {  STATE_PREVENTION_OFFICER} from '../initialValues/JobPost'


function AdminSPO() {
    return (
        <>
            <Detail data_position="SPO" position={STATE_PREVENTION_OFFICER} />
        </>
    );
}

export default AdminSPO;