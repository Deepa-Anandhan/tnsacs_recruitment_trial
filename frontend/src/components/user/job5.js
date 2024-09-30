import ApplyButton from '../basecomponents/ApplySuggestion';
import { connect } from 'react-redux'
import { removeexp_age } from '../../redux'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CLUSTER_PREVENTION_OFFICER } from '../initialValues/JobPost'

function Job5(props) {
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


                <h4 className='text-2xl my-5 underline font-semibold'> CLUSTER PREVENTION OFFICER (CPO) - 9 POST</h4>


            </div>

            <div className="lg:col-span-1 col-span-3">


                <div className="block w-full overflow-x-auto rounded-t-md">
                    <table className="items-center bg-transparent w-full  border-collapse border border-gray-400">
                        <caption className="caption-top bg-red-600 p-4 font-semibold text-white">
                            CONSOLIDATED MONTHLY REMUNERATION
                            ( PER MONTH ) RS 45,000/-
                        </caption>
                        {/* <thead>
                                <tr className="bg-gray-200 border-2 border-gray-400">
                                    <th className="border-gray-400 text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        S.NO
                                    </th>
                                    <th className="border-gray-400 text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        DISTRICT
                                    </th>
                                    <th className="border-gray-400 text-red-500 align-middle border-2 border-solid  py-3 text-xs uppercase  whitespace-nowrap font-semibold">
                                        POST
                                    </th>

                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <th className="border-2 border-gray-400 align-middle  text-xs whitespace-nowrap  px-7 py-2  ">
                                        1
                                    </th>
                                    <td className="border-2 border-gray-400  align-middle  text-xs whitespace-nowrap px-7 py-2 ">
                                        THENI
                                    </td>
                                    <td className="border-2 border-gray-400  align-center  text-xs whitespace-nowrap px-7 py-2">
                                        1
                                    </td>

                                </tr> */}



                        {/* </tbody> */}

                    </table>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-5 ">

                <div className="lg:col-span-3 col-span-3">
                    <div className="border border-slate-400 rounded-b-md p-5 flex flex-col gap-5 text-start">
                        {/* <p className="text-base font-bold uppercase">Essential Qualification:</p>
                        <li>Bachelors Degree in Medical Sciences and MD/DNB (Community
                            Medicine / Epidemiology)
                            OR
                            Master / Post Graduation in Public Health / Health Administration
                            / Applied Epidemiology or Diploma in Public Health/Masters in
                            Demography / Statistics / Population Sciences / Social Sciences /
                            Computer Application (Two year course) and similar streams from
                            a Recognized University
                        </li> */}

                        <p className="text-base font-bold uppercase">Qualification and Experience:</p>

                        <p>
                            Master degree in Social Sciences/ Public Health/ Management with 5 year's
                            experience in development sectorwith minimum three(3) year's work experience
                            in HIV?AIDS preferably in supevisory capacity. The candidate should have sound understanding 
                            of issues related to Hight Risk Group populations and have experience of designing and implementation 
                            of Targeted intervention stategies for high risk groups population such as Female Sex Workers, Transgender, injected 
                            Drug Users, Migrants, truckers, Prison.
                        </p>
                        {/* <ul className="list-disc mx-4">
                            <li>5 year's experience in Public Health in surveillance / research
                                / M&E / Epidemiology.
                            </li>

                            <li>Working knowledge of computers including MS office package
                                and SPSS </li>

                            <li>Good working knowledge of Epidemiological analysis and
                                biostatistics.
                            </li>
                        </ul> */}

                        <p className="text-base font-bold uppercase">Desirable:</p>

                        <p>
                            PG diploma in HIV/AIDS or fellowship in HIV/AIDS from any Govt. recognized institution.
                        </p>
                        <ul className="list-disc mx-4">
                            <li>
                                The candidate should be fimiliar with the organization and functions of the state and
                                local public health systems/ State AIDS Control Societies.
                            </li>
                            <li>
                                He should have exellent written and verbal communication
                                skills in local languages and the ability to work well in an inter-disciplinary team. 
                            </li>
                            <li>
                                Knowledge of local language and English (Speaking, Reading and Writing).
                            </li>
                            <li>
                                Previous experience in the State/UT is desirable.
                            </li>
                            <li>
                                Well versed in computer and internet (Word, Exel, PowerPoint, internet etc).
                            </li>
                            <li>
                                Strong analytical and negotiation skills.
                            </li>
                            <li>
                                Willingness to travel extensively.
                            </li>

                        </ul>

                        <p className="text-base font-bold uppercase">Age limit:</p>

                        <ul className="list-disc mx-4">
                            <li> 50 year's as on 01.07.2024</li>
                        </ul>
                    </div>
                </div>



            </div>

            <div className='flex justify-center mt-5'>
                <ApplyButton position={CLUSTER_PREVENTION_OFFICER} min_age={45} emin_age={45} link={'/tansacs/cluster_prevention_officer/apply'} />

                {/* <Link to={'/deputy_director_si/apply'} className="px-3 py-1 block group relative  w-max overflow-hidden rounded-lg bg-red-600 text-sm font-semibold text-white">
                        Apply
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                    </Link> */}
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


export default connect(mapStateToProps, mapDispatchToProps)(Job5);


//  14-09-2024