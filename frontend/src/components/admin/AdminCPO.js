import Detail from './detail'
import {   CLUSTER_PREVENTION_OFFICER } from '../initialValues/JobPost'


function AdminCPO() {
    return (
        <>
            <Detail data_position="CPO" position={CLUSTER_PREVENTION_OFFICER} />
        </>
    );
}

export default AdminCPO;