import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query'
import { instruction_read } from "../../redux";
import { connect } from 'react-redux'
import axios from "axios";
import LoadingComponent from '../basecomponents/loading'

function Instruction(props) {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        if (event.target.checked) {
            setErrorMessage('');  // Clear the error message when checkbox is checked
        }
    };

    const [loading, setLoading] = useState(false);

    async function instructionupdate(token) {
        const response = await axios.post(
            'http://127.0.0.1:8000/instruction-read', 
            {}, // Assuming no body is required for this request
            {
                headers: {
                    'Authorization': `Token ${token}`,  // Include the token in the Authorization header
                }
            }
        );
        return response.data;
    }
    
    const mutation = useMutation(instructionupdate)

    const handleNextClick = () => {

        if (!isChecked) {
            setErrorMessage("Please tick the checkbox to proceed.");
        } else {
            setLoading(true)
            mutation.mutate(props.token, {
                onSuccess: () => {
                    props.instruction_reads(); // Dispatch Redux action if needed
                    setLoading(false) 
                    navigate('/tansacs/jobs');
                     // Redirect to home page
                },
                onError: () => {
                    setLoading(false)
                    navigate('/server_error_500')  // Redirect to server issue page
                }
            });
        }
    };

    useEffect(()=>{
        if(props.instruction_read){
            navigate('/tansacs/jobs')
        }
    },[])

    return (
        <div className="relative">
            {loading ? (<LoadingComponent />) : null}
                <h4 className='text-custom-red font-bold mb-7  lg:text-[50px] md:text-[40px] text-[35px]'>Tamil Nadu State AIDS Control Society</h4>

            <div className="border p-4">
                <h2 className="text-2xl font-semibold mb-4 text-start">Instructions:</h2>
                <small className='font-bold text-[18px]'></small>
                <a className='font-bold text-custom-red underline'></a>

                <ul className="list-disc list-inside space-y-2 text-start text-[18px]">
                    <li>Eligible and interested candidates should apply only through online mode in the TANSACS website <a href="https://www.tnsacs.in" className='font-bold text-custom-red underline'>www.tnsacs.in</a> </li>
                    <li>On the Home Page, click <small className='font-bold text-lg'>“RECRUITMENT”</small> to open up the Online application form</li>
                    <li className='font-bold text-[18px]'>Candidate should fill the particulars for First Time Registration.</li>
                    <li className='font-bold text-[18px]'>Candidate should register their particulars for First Time Registration.
                    </li>
                    <li><small className='font-bold text-[18px]'>After registration, candidates will receive a registered OTP only from info@tnsacsrecruitment.in</small> to their registered E-mail ID. If not recieved mail in Inbox, candidates are requested to check the mail in Spam / Junk also.</li>

                    <li className='font-bold text-[18px]'>Candidate should fill the Username and password for Login.
                    </li>

                    <li>All the required particulars to be entered without skipping any field</li>
                    <li><small className='font-bold text-[18px]'>Candidates should enter the scored marks in percentage only for 10th, +2, UG, PG degree, except Experience</small> and Experience should be entered in years only.</li>
                    <li><small className='font-bold text-[18px]'>A valid E-mail ID and Mobile number are mandatory</small> and given E-mail ID and Mobile number should be kept active. Communication from TANSACS will be sent to the registered Mobile Number by SMS / registered E-mail ID and by no other means. TANSACS is not responsible for failure / delay in delivery of SMS / E-mail to the candidates due to any reason including technical issues. If not received mail in Inbox, candidates are requested to check the mail in Spam / Junk also.</li>
                    <li>Candidates will receive a registered OTP only from info@tnsacsrecruitment.in, to their registered E-mail ID. If not received mail in Inbox, candidates are requested to check the mail in Spam / Junk also.</li>
                    <li className='font-bold text-[18px]'>Online applications uploaded without the photograph / signature / specified documents / self-attested copies will be summarily rejected after due process and Corrections or Omissions in the data entered by the candidate, after the submission of their online application will not be entertained.</li>
                    <li>Candidates are required to upload their scanned copy of<small className='font-bold text-[18px]'> photograph (not exceeding 50 kb in size in the format of .jpeg / .jpg) and scanned / photo copy of signature (not exceeding 50 kb in size in the format of .jpeg / .jpg).</small></li>
                    <li>Candidates are required to <small className='font-bold text-[18px]'>upload their scanned copy of Marksheets / Certificates (not exceeding 200 kb in size in the format of .pdf).</small></li>
                    <li>In respect of recruitment to the above-mentioned post, <small className='font-bold text-[18px]'>the candidates shall mandatorily upload the Marksheets / certificates (including No Objection Certificate (NOC) and Experience Certificate</small> from the respective Department) / documents (in support of all the details furnished in the online application). Upload scanned copy of NOC / Experience Certificate (not exceeding 50 kb in size in the format of .pdf). The candidates shall have the option of verifying the uploaded certificates.</li>
                    <li className='font-bold text-[18px]'>Candidate should have studied Tamil language as one of the subjects in 10th (SSLC) and +2 (Higher Secondary).</li>
                    <li>Candidates should not send hard copies of certificates / printed application to TANSACS, by post.</li>
                    <li>Candidates need to verify their eligibility for the post, before submitting their online application.</li>
                    <li>Incomplete / false / wrong / incorrect information / claim found in application or any other form of request on perusal of the same in the recruitment process, the candidature of the applicant will be summarily rejected, without any prior notice.</li>
                    <li className='font-bold text-[18px]'>Any false experience / Certificate or Mark Sheets submitted by candidates, if found later, a criminal case will be initiated against the individual & they will be debarred.</li>
                    <li>The score will be strictly based on the data entered by the candidate at the time of submission of online application only. Incomplete applications and applications containing wrong claims or incorrect particulars relating to category of eligibility / age / educational qualification, other basic qualifications and other basic eligibility criteria will be summarily rejected after due process.</li>
                    <li>Candidates need to verify their eligibility for the post before submitting their online application. If a candidate furnished wrong information, action will be taken by TANSACS to debar such candidate from the future recruitment, apart from other legal action.</li>
                </ul>

                <div className="text-start mt-5">
                    <input
                        type="checkbox"
                        id="accept-terms"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="accept-terms" className="ms-3 text-[18px] font-bold"> I have read and agree to the instructions</label>
                </div>
                {errorMessage && <p className="text-red-500 mt-2 text-start text-[15px] font-bold">{errorMessage}</p>}  {/* Display error message if any */}

                <div className='w-full flex justify-center items-center mt-5'>
                    <button onClick={handleNextClick}  className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-red-500 text-sm font-semibold text-white" >NEXT
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = state => {


    return {

        token: state.login.token,
        instruction_read : state.login.instruction_read

    }
}

const mapDispatchToProps = dispatch => {

    return {
        instruction_reads: (data) => dispatch(instruction_read()),
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Instruction);
