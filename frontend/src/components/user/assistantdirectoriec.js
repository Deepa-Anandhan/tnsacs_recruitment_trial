import React from 'react'

import CommForm from './CommForm';
import { AssistantDirector_IEC_ug, AssistantDirector_IEC_pg, AssistantDirector_IEC_experience } from '../initialValues/AD_IECqualification';
import { ASSISTANT_IEC_DIRECTOR } from '../initialValues/JobPost'
import { connect } from 'react-redux'


function AssistantDirectorIEC(props) {

    return (

        <CommForm position={ASSISTANT_IEC_DIRECTOR} ug={AssistantDirector_IEC_ug} pg={AssistantDirector_IEC_pg} exp={AssistantDirector_IEC_experience} first_name ={props.first_name} last_name={props.last_name}/>
    )
}

const mapStateToProps = state => {


    return {
 
        first_name: state.login.first_name,
        last_name: state.login.last_name,
        state: state
    }
 }
 

 
 export default connect(mapStateToProps)(AssistantDirectorIEC);