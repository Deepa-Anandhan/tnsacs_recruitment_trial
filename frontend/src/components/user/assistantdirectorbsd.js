import React from 'react'
import CommForm from './CommForm';
import { AssistantDirector_BSD_ug, AssistantDirector_BSD_pg, AssistantDirector_BSD_experience } from '../initialValues/AD_ICTCqualification';
import { ASSISTANT_ICTC_DIRECTOR } from '../initialValues/JobPost'
import { connect } from 'react-redux'

function AssistantDirectorBSD(props) {


    return (

        <CommForm position={ASSISTANT_ICTC_DIRECTOR} ug={AssistantDirector_BSD_ug} pg={AssistantDirector_BSD_pg} exp={AssistantDirector_BSD_experience} first_name ={props.first_name} last_name={props.last_name} />
    )

}

const mapStateToProps = state => {


    return {
 
        first_name: state.login.first_name,
        last_name: state.login.last_name,
        state: state
    }
 }
 

 
 export default connect(mapStateToProps)(AssistantDirectorBSD);