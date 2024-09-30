import React from 'react'

import { connect } from 'react-redux'

import CommForm from './CommForm';
import { CPM_ug, CPM_experience, CPM_pg } from '../initialValues/CPMqualification';
import { CLUSTER_MANAGER} from '../initialValues/JobPost'

function ClusterManagerForm(props) {

   console.log(props.first_name , "say name");
   


   return (
      <CommForm position={CLUSTER_MANAGER} ug={CPM_ug} pg={CPM_pg} exp={CPM_experience} first_name ={props.first_name} last_name={props.last_name} />
   )



}

const mapStateToProps = state => {


   return {

       first_name: state.login.first_name,
       last_name: state.login.last_name,
       state: state
   }
}



export default connect(mapStateToProps)(ClusterManagerForm);