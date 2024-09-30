import ApplyButton from '../basecomponents/ApplySuggestion';
import { connect } from 'react-redux'
import { removeexp_age } from '../../redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { STATE_PREVENTION_OFFICER } from '../initialValues/JobPost'


function Job1(props) {

    const navigate = useNavigate()

    useEffect(() => {
        if (!props.isLogin) {
            navigate('/')
        }
    }, [props.isLogin])

    useEffect(() => {

        props.removeexp_age()
    })
    return (
        <>
            <div className='mt-5'>
                <h4 className='text-custom-red font-bold mb-7  lg:text-[50px] md:text-[40px] text-[35px]'>Tamil Nadu State AIDS Control Society</h4>


                <h4 className='text-2xl my-5 underline font-semibold uppercase'>state prevention officer
                    (SPO) - 1 Posts </h4>


            </div>

            <div className="lg:col-span-3 col-span-3">


                <div className="block w-full overflow-x-auto rounded-t-md">
                    <table className="items-center bg-transparent w-full  border-collapse border border-gray-400 ">
                        <caption className="caption-top bg-red-600 p-4 font-semibold text-white">
                            CONSOLIDATED MONTHLY REMUNERATION
                            ( PER MONTH ) RS 65,000/-
                        </caption>
                        {/* <thead>
                                <tr className="bg-gray-200 border-2 border-gray-400">
                                    <th className="border-gray-400  text-center text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        S.NO
                                    </th>
                                    <th className="border-gray-400  text-center text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        DISTRICT
                                    </th>
                                    <th className="border-gray-400  text-center text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        POST
                                    </th>

                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center text-xs whitespace-nowrap  px-7 py-2  ">
                                        1
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        TRICHY
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-center  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        2
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        NAMAKKAL
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        3
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        SALEM
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        4
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        THANJAVUR
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        5
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        VILLUPURAM
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        6
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        KRISHNAGIRI
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                                <tr>
                                    <th className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        7
                                    </th>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        KANCHEEPURAM
                                    </td>
                                    <td className="border-2 border-gray-400  text-center align-middle  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr>
                            </tbody> */}

                    </table>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-5 ">

                <div className="lg:col-span-3 col-span-3">
                    <div className="border border-slate-400 rounded-b-md p-5 flex flex-col gap-5 text-start">
                        <p className="text-base font-bold uppercase">Qualification:</p>
                        <p>Master degree in public health/social sciences/management with 
                            minimum 10 year's working experience in health sector, out of which 
                            7 year's experience  must be in the field of HIV-AIDS preferably managing 
                            Prevention interventions with the core, bridge & vulnerable population.
                        </p>

                        <p className="text-base font-bold uppercase">Experience:</p>

                        <p>
                            PG diploma in HIV/AIDS or fellowship in HIV/AIDS from any Govt. recognized institution.
                        </p>

                        <ul className="list-disc mx-4">
                            
                            <li>Candidates with technical knowledge on HIV-AIDS will be given preference. </li>
                            <li>Candidate should possess exellent reporting and analytical abilities, communication 
                                and negotiation skills in english and local language.
                            </li>
                            <li>
                                The candidateshould be familiar with working of Civil society Organizations, Community
                                based Organizations, State Health Department Public Health Programmes.
                            </li>
                            <li>
                                Candidate should be proficient in the use of computers and 
                                internet along with willingness to travel extensively.
                            </li>
                            <li>
                                Previous experience of working in the State/UT is desirable.
                            </li>
                        </ul>

                        {/* <p className="text-base font-bold uppercase">Desirable:</p>
                        <ul className="list-disc mx-4">
                            <li>The suitable candidate should be familiar with the
                                organization and functions of the State and local public
                                health systems / State AIDS Control Societies  </li>
                            <li> Excellent written and verbal communication skills in local
                                languages and English (Speaking, Reading and
                                Writing).
                            </li>
                            <li>Strong analytical, Advocacy and negotiation skills</li>
                            <li>Willingness to travel extensively </li>
                            <li>Other expertise includes:

                                <ul className="list-disc mx-8 list-none">
                                    <li>→ Programme Management Skills</li>
                                    <li>→ Good knowledge of computers</li>
                                    <li>→ Coordination and leading teams
                                    </li>


                                </ul>
                            </li>

                        </ul> */}

                        <p className="text-base font-bold uppercase">Age limit:</p>

                        <ul className="list-disc mx-4">
                            <li> 50 year's as on 01.07.2024</li>

                        </ul>


                    </div>
                </div>



            </div>

            <div className='flex justify-center mt-5'>

                <ApplyButton position={STATE_PREVENTION_OFFICER} main={false} min_age={45} emin_age={45} link={'/tansacs/state_prevention_officer/apply'} />



            </div>

        </>
    );
}


const mapStateToProps = state => {


    return {

        isLogin: state.login.isLogin,
    }
}

const mapDispatchToProps = dispatch => {

    return {
        removeexp_age: () => dispatch(removeexp_age())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Job1);