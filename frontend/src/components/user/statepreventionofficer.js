import React from 'react'
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup'
import FormikControl from '../formcomponents/formcontrol'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import axios from 'axios'
import LoadingComponent from '../basecomponents/loading'
import { connect } from 'react-redux'

import Common2Form  from './Comm2Form'
import { SPO_ug, SPO_experience, SPO_pg } from '../initialValues/SPOqualification';
import { STATE_PREVENTION_OFFICER} from '../initialValues/JobPost'

function StatePreventionOfficer(props) {




   return (
      <Common2Form position={STATE_PREVENTION_OFFICER} ug={SPO_ug} pg={SPO_pg} exp={SPO_experience} first_name ={props.first_name} last_name={props.last_name} />
   )



}

const mapStateToProps = state => {


   return {

       first_name: state.login.first_name,
       last_name: state.login.last_name,
       state: state
   }
}



export default connect(mapStateToProps)(StatePreventionOfficer);