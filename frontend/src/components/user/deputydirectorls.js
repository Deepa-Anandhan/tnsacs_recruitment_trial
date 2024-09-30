import React from 'react'

import CommForm from './CommForm';
import { DDLS_pg, DDLS_experience, DDLS_ug } from '../initialValues/DD_LSqualification';
import { DEPUTY_LS_DIRECTOR } from '../initialValues/JobPost'
import { connect } from 'react-redux'

function DeputyDirectorLS(props) {

    return (
        <CommForm position={DEPUTY_LS_DIRECTOR} ug={DDLS_ug} pg={DDLS_pg} exp={DDLS_experience} first_name ={props.first_name} last_name={props.last_name}/>
    )

}
const mapStateToProps = state => {


    return {
 
        first_name: state.login.first_name,
        last_name: state.login.last_name,
        state: state
    }
 }
 
 
 
 export default connect(mapStateToProps)(DeputyDirectorLS);