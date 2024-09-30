import React from 'react'

import CommForm from './CommForm';
import { DMDO_pg, DMDO_ug, DMDO_experience } from '../initialValues/DMDOqualification';
import { DATA_MONITORING_OFFICER } from '../initialValues/JobPost'
import { connect } from 'react-redux'

function DataMonitoringDocumentationOfficer(props) {


   return (
      <CommForm position={DATA_MONITORING_OFFICER} ug={DMDO_ug} pg={DMDO_pg} exp={DMDO_experience} first_name ={props.first_name} last_name={props.last_name}/>
   )

}

const mapStateToProps = state => {


   return {

       first_name: state.login.first_name,
       last_name: state.login.last_name,
       state: state
   }
}



export default connect(mapStateToProps)(DataMonitoringDocumentationOfficer);