import React from 'react'
import Comm2Form from './Comm2Form';
import { CPO_pg, CPO_experience, CPO_ug } from '../initialValues/CPOqualification';
import { CLUSTER_PREVENTION_OFFICER } from '../initialValues/JobPost'
import { connect } from 'react-redux'

function ClusterPreventionOfficer(props) {


    return (
        <Comm2Form position={CLUSTER_PREVENTION_OFFICER} ug={CPO_ug} pg={CPO_pg} exp={CPO_experience} first_name ={props.first_name} last_name={props.last_name} />
    )
}

const mapStateToProps = state => {


    return {
 
        first_name: state.login.first_name,
        last_name: state.login.last_name,
        state: state
    }
 }
 
 
 
 export default connect(mapStateToProps)(ClusterPreventionOfficer);