import React from 'react'

import CommForm from './CommForm';
import { AssistantDirector_Prevention_pg, AssistantDirector_Prevention_ug, AssistantDirector_Prevention_experience } from '../initialValues/AD_TIqualification';
import { ASSISTANT_TI_DIRECTOR } from '../initialValues/JobPost'
import { connect } from 'react-redux'

function AssistantDirectorTI(props) {

    return (

        <CommForm position={ASSISTANT_TI_DIRECTOR} ug={AssistantDirector_Prevention_ug} pg={AssistantDirector_Prevention_pg} exp={AssistantDirector_Prevention_experience} first_name ={props.first_name} last_name={props.last_name}/>
    )

}

const mapStateToProps = state => {


    return {
 
        first_name: state.login.first_name,
        last_name: state.login.last_name,
        state: state
    }
 }
 

 
 export default connect(mapStateToProps)(AssistantDirectorTI);