import React, { useRef, useEffect } from 'react'
import { Formik, Form, Field, FieldArray ,ErrorMessage} from 'formik';
import * as Yup from 'yup'
import FormikControl from '../formcomponents/formcontrol'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import axios from 'axios'
import LoadingComponent from '../basecomponents/loading'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import SuccessModel from '../basecomponents/SuccessModel';
import ConfrimModal from '../basecomponents/ConfirmationModel';
import { update_jobs, cacel_permission } from '../../redux'
import calender from '../../logo/icon-8.png'
import { format, parseISO ,differenceInMonths, differenceInDays, addMonths ,isBefore} from 'date-fns';
import DateView from 'react-datepicker'
import TextError from '../formcomponents/texterror'
import CustomError from '../basecomponents/customError';

function Common2Form
    (props) {


        const calculateAndSetYear = (setFieldValue, fieldName, uptoDate, joinedDate , newfieldName ) => {
            const startDate = parseISO(joinedDate);
            const endDate = parseISO(uptoDate);
        
            let totalMonths = differenceInMonths(endDate, startDate);
        
            // Calculate years and remaining months directly from totalMonths
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;
            const yearss = (totalMonths / 12).toFixed(2);
            // Create the formatted string for year_month
            let yearMonthString = '';
        
            if (years > 0) {
                yearMonthString += `${years} year${years > 1 ? 's' : ''}`;
            }
            if (months > 0) {
                if (years > 0) {
                    yearMonthString += ' ';
                }
                yearMonthString += `${months} month${months > 1 ? 's' : ''}`;
            }
        
            // If both years and months are zero, handle the string appropriately
            if (yearMonthString === '') {
                yearMonthString = '0 months';
            }
        
            console.log(totalMonths);
            console.log(yearss , years, "years");
            console.log(yearMonthString, "year_month");
        
            // Set the value of the year field
            setFieldValue(fieldName, yearss);
        
            // Set the value of the year_month field
            setFieldValue(newfieldName, yearMonthString);
        };
        

    const [success, setSuccess] = React.useState(false)
    const navigate = useNavigate()

    const [dataDownload, setdataDownload] = React.useState({ id: 0, applicant_id: 0 })

    const formikRef = useRef()


    useEffect(() => {
        if (!props.permission) {
            navigate('/tansacs/jobs')
        }
        else {
            props.cancel_permission()
        }

    }, [])

    async function ApplicationForm(values) {

        const response = await axios.post('http://127.0.0.1:8000/jobs/job', values, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `token ${props.token}`
            },
        });

        return response.data;

        // Handle errors here if needed
        // Re-throw the error to be caught by the caller

    }

    const val = 'Medical or Allied Health Sciences'

    const [loading, setLoading] = React.useState(false);


    const mutation = useMutation(ApplicationForm)


    const initialValues = {
        sslc: {
            first_name: '',
            last_name: '',
            register_number: '',
            month: '',
            year: '',
            percentage: '',
            board: '',
            marksheet: ''
        }
        ,
        hsc: {
            first_name: '',
            last_name: '',
            register_number: '',
            month: '',
            year: '',
            percentage: '',
            board: '',
            marksheet: ''
        },
        ug: {
            first_name: '',
            last_name: '',
            register_number: '',
            degree: '',
            department: '',
            month: '',
            year: '',
            percentage: '',
            marksheet: ''
        },

        pg: [
            {
                first_name: '',
                last_name: '',
                register_number: '',
                degree: '',
                department: '',
                month: '',
                year: '',
                percentage: '',
                marksheet: ''
            },
        ],
        experience: [
            {
                degree: '', company: '', year: '0', certificate: '', course: '' , joined_date : "" , upto_date:"" , currently_working: false , year_month :'0' 
            }
        ],
        position: props.position,
        declaration: false,
        signature: ''

    }

    const sslc_hsc_Scheme = Yup.object().shape({
        first_name: Yup.string().required('Required'),
        // last_name: Yup.string().required('Required'),
        register_number: Yup.string().required('Required'),
        percentage: Yup.number()
            .required('Required')
            .typeError("Enter Valid Percentage")
            .positive('positive')

            .max(100, 'Decimal after 2 digits')
            .test(
                'is-decimal',
                'Enter Value with Max 2 Decimals',
                number => /^\d+(\.\d{1,2})?$/.test(String(number))
            ),
        marksheet: Yup.mixed()
            .required('Required')
            .test(
                'fileType',
                'Only PDF files are allowed',
                value => value && (value.type === 'application/pdf')
            )
            .test(
                'fileSize',
                'File too large, should be less than 200KB',
                value => value && value.size <= 200 * 1024 // 200KB in bytes
            ),
        month: Yup.string().required('Required'),
        year: Yup.string().required('Required'),

        board: Yup.string().required('Required'),
    })

    const ug_pg_Schema = Yup.object().shape({
        first_name: Yup.string().required('Required'),
        // last_name: Yup.string().required('Required'),
        degree: Yup.string().required('Required'),
        department: Yup.string().required('Required'),
        register_number: Yup.string().required('Required'),
        percentage: Yup.number()
            .required('Required')
            .typeError("Enter Valid Percentage")
            .positive('Must be positive')

            .max(100, 'Decimal after 2 digits')
            .test(
                'is-decimal',
                'Enter Value with Max 2 Decimals',
                number => /^\d+(\.\d{1,2})?$/.test(String(number))
            ),
        marksheet: Yup.mixed()
            .required('Required')
            .test(
                'fileType',
                'Only PDF files are allowed',
                value => value && (value.type === 'application/pdf')
            )
            .test(
                'fileSize',
                'File too large, should be less than 200KB',
                value => value && value.size <= 200 * 1024 // 200KB in bytes
            ),
        month: Yup.string().required('Required'),
        year: Yup.string().required('Required'),
    })

    const pg_Schema = Yup.object().shape({
        first_name: Yup.string().when(['degree', 'department', 'register_number', 'percentage', 'marksheet', 'month', 'year'], {
            is: (degree, department, register_number, percentage, marksheet, month, year) =>
                !!degree || !!department || !!register_number || !!percentage || !!marksheet || !!month || !!year,
            then: () => Yup.string().required('First name is required'),
            otherwise: () => Yup.string(),
        }),
        // ... Similar for last_name if needed

        degree: Yup.string().when(['first_name', 'department', 'register_number', 'percentage', 'marksheet', 'month', 'year'], {
            is: (first_name, department, register_number, percentage, marksheet, month, year) =>
                !!first_name || !!department || !!register_number || !!percentage || !!marksheet || !!month || !!year,
            then: () => Yup.string().required('Degree is required'),
            otherwise: () => Yup.string(),
        }),

        department: Yup.string().when(['first_name', 'degree', 'register_number', 'percentage', 'marksheet', 'month', 'year'], {
            is: (first_name, degree, register_number, percentage, marksheet, month, year) =>
                !!first_name || !!degree || !!register_number || !!percentage || !!marksheet || !!month || !!year,
            then: () => Yup.string().required('Department is required'),
            otherwise: () => Yup.string(),
        }),

        register_number: Yup.string()
            .when(['first_name', 'degree', 'department', 'percentage', 'marksheet', 'month', 'year'], {
                is: (first_name, degree, department, percentage, marksheet, month, year) =>
                    !!first_name || !!degree || !!department || !!percentage || !!marksheet || !!month || !!year,
                then: () => Yup.string().required('Required'),
                otherwise: () => Yup.string(),
            }),

        percentage: Yup.number()

            .when(['first_name', 'degree', 'department', 'register_number', 'marksheet', 'month', 'year'], {
                is: (first_name, degree, department, register_number, marksheet, month, year) =>
                    !!first_name || !!degree || !!department || !!register_number || !!marksheet || !!month || !!year,
                then: () => Yup.number().required('Percentage is required').typeError("Enter Valid Percentage")
                    .positive('Must be positive')
                    .max(100, 'Decimal after 2 digits')
                    .test(
                        'is-decimal',
                        'Enter Value with Max 2 Decimals',
                        number => number === undefined || /^\d+(\.\d{1,2})?$/.test(String(number))
                    ),
                otherwise: () => Yup.number().typeError("Enter Valid Percentage")
                    .positive('Must be positive')
                    .max(100, 'Decimal after 2 digits')
                    .test(
                        'is-decimal',
                        'Enter Value with Max 2 Decimals',
                        number => number === undefined || /^\d+(\.\d{1,2})?$/.test(String(number))
                    ),
            }),

        marksheet: Yup.mixed()

            .when(['first_name', 'degree', 'department', 'register_number', 'percentage', 'month', 'year'], {
                is: (first_name, degree, department, register_number, percentage, month, year) =>
                    !!first_name || !!degree || !!department || !!register_number || !!percentage || !!month || !!year,
                then: () => Yup.mixed().required('Marksheet is required').test(
                    'fileType',
                    'Only PDF files are allowed',
                    value => value === undefined || (value.type === 'application/pdf')
                )
                    .test(
                        'fileSize',
                        'File too large, should be less than 200KB',
                        value => value === undefined || (value.size <= 200 * 1024) // 200KB in bytes
                    ),
                otherwise: () => Yup.mixed().test(
                    'fileType',
                    'Only PDF files are allowed',
                    value => value === undefined || (value.type === 'application/pdf')
                )
                    .test(
                        'fileSize',
                        'File too large, should be less than 200KB',
                        value => value === undefined || (value.size <= 200 * 1024) // 200KB in bytes
                    ),
            }),

        month: Yup.string().when(['first_name', 'degree', 'department', 'register_number', 'percentage', 'marksheet', 'year'], {
            is: (first_name, degree, department, register_number, percentage, marksheet, year) =>
                !!first_name || !!degree || !!department || !!register_number || !!percentage || !!marksheet || !!year,
            then: () => Yup.string().required('Month is required'),
            otherwise: () => Yup.string(),
        }),

        year: Yup.string().when(['first_name', 'degree', 'department', 'register_number', 'percentage', 'marksheet', 'month'], {
            is: (first_name, degree, department, register_number, percentage, marksheet, month) =>
                !!first_name || !!degree || !!department || !!register_number || !!percentage || !!marksheet || !!month,
            then: () => Yup.string().required('Year is required'),
            otherwise: () => Yup.string(),
        }),
    }, [
        ['first_name', 'degree'],
        ['first_name', 'department'],
        ['first_name', 'register_number'],
        ['first_name', 'percentage'],
        ['first_name', 'marksheet'],
        ['first_name', 'month'],
        ['first_name', 'year'],
        ['degree', 'department'],
        ['degree', 'register_number'],
        ['degree', 'percentage'],
        ['degree', 'marksheet'],
        ['degree', 'month'],
        ['degree', 'year'],
        ['department', 'register_number'],
        ['department', 'percentage'],
        ['department', 'marksheet'],
        ['department', 'month'],
        ['department', 'year'],
        ['register_number', 'percentage'],
        ['register_number', 'marksheet'],
        ['register_number', 'month'],
        ['register_number', 'year'],
        ['percentage', 'marksheet'],
        ['percentage', 'month'],
        ['percentage', 'year'],
        ['marksheet', 'month'],
        ['marksheet', 'year'],
        ['month', 'year']
    ]);



    const experienceSchema = Yup.object().shape({
        degree: Yup.string().when(
          ['company', 'year', 'certificate', 'course', 'joined_date', 'upto_date', 'currently_working'],
          {
            is: (company, year, certificate, course, joined_date, upto_date, currently_working) =>
              !!company || !!year || !!certificate || !!course || !!joined_date || !!upto_date || currently_working,
            then: () => Yup.string().required('Degree is required'),
            otherwise: () => Yup.string(),
          }
        ),
        company: Yup.string().when(
          ['degree', 'year', 'certificate', 'course', 'joined_date', 'upto_date', 'currently_working'],
          {
            is: (degree, year, certificate, course, joined_date, upto_date, currently_working) =>
              !!degree || !!year || !!certificate || !!course || !!joined_date || !!upto_date || currently_working,
            then: () => Yup.string().required('Company Name is required'),
            otherwise: () => Yup.string(),
          }
        ),
        year: Yup.number().when(
          ['degree', 'company', 'certificate', 'course', 'joined_date', 'upto_date', 'currently_working'],
          {
            is: (degree, company, certificate, course, joined_date, upto_date, currently_working) =>
              !!degree || !!company || !!certificate || !!course || !!joined_date || !!upto_date || currently_working,
            then: () =>
              Yup.number()
                .required('Year is required')
                .test('min-experience', 'Need minimum 6 months of experience', function (val) {
                  return val >= 0.6;
                }),
            otherwise: () => Yup.number(),
          }
        ),
        course: Yup.string().when(
          ['degree', 'company', 'certificate', 'year', 'joined_date', 'upto_date', 'currently_working'],
          {
            is: (degree, company, certificate, year, joined_date, upto_date, currently_working) =>
              !!degree || !!company || !!certificate || !!year || !!joined_date || !!upto_date || currently_working,
            then: () => Yup.string().required('Course is required'),
            otherwise: () => Yup.string(),
          }
        ),
        certificate: Yup.mixed().when(
          ['degree', 'company', 'year', 'course', 'joined_date', 'upto_date', 'currently_working'],
          {
            is: (degree, company, year, course, joined_date, upto_date, currently_working) =>
              !!degree || !!company || !!year || !!course || !!joined_date || !!upto_date || currently_working,
            then: () =>
              Yup.mixed()
                .required('Certificate is required')
                .test('fileType', 'Only PDF files are allowed', (value) => !value || value.type === 'application/pdf')
                .test('fileSize', 'File too large, should be less than 100KB', (value) => !value || value.size <= 100 * 1024),
            otherwise: () =>
              Yup.mixed()
                .test('fileType', 'Only PDF files are allowed', (value) => !value || value.type === 'application/pdf')
                .test('fileSize', 'File too large, should be less than 100KB', (value) => !value || value.size <= 100 * 1024),
          }
        ),
        joined_date: Yup.string().when(
            ['degree', 'company', 'year', 'certificate', 'course', 'upto_date', 'currently_working'],
            {
              is: (degree, company, year, certificate, course, upto_date, currently_working) =>
                !!degree || !!company || !!year || !!certificate || !!course || !!upto_date || currently_working,
              then: () =>
                Yup.string()
                  .required('Joined Date is required')
                  .test('joined-date-before-upto-date', 'Joined date cannot be after Upto date', function (joined_date) {
                    const { upto_date } = this.parent;
                    if (!joined_date || !upto_date) return true; // Skip validation if dates are not provided
                    return isBefore(parseISO(joined_date), parseISO(upto_date)); // Validate that `joined_date` is before `upto_date`
                  })
                  .test('joined-date-not-future', 'Invalid date', function (joined_date) {
                    if (!joined_date) return true; // Skip validation if `joined_date` is not provided
                    return !isBefore(new Date(), parseISO(joined_date)); // Ensure `joined_date` is not in the future
                  }),
              otherwise: () => Yup.string(),
            }
          ),
          
        upto_date: Yup.string().when(
            ['degree', 'company', 'year', 'certificate', 'course', 'joined_date', 'currently_working'],
            {
              is: (degree, company, year, certificate, course, joined_date, currently_working) =>
                !!degree || !!company || !!year || !!certificate || !!course || !!joined_date || currently_working,
              then: () =>
                Yup.string()
                  .test('upto-date-required', 'Upto Date is required', function (upto_date) {
                    const { currently_working } = this.parent;
                    if (currently_working) return true; // Skip if currently working is checked
                    return !!upto_date; // Return false if `upto_date` is required but not provided
                  })
                  .test('upto-date-after-joined-date', 'Upto date cannot be before Joined date', function (upto_date) {
                    const { joined_date, currently_working } = this.parent;
                    if (currently_working || !upto_date || !joined_date) return true; // Skip validation if not applicable
                    return isBefore(parseISO(joined_date), parseISO(upto_date)); // Validate `upto_date` is after `joined_date`
                  })
                  .test('upto-date-not-future', 'Invalid date', function (upto_date) {
                    const { currently_working } = this.parent;
                    if (currently_working || !upto_date) return true; // Skip validation if not applicable
                    return !isBefore(new Date(), parseISO(upto_date)); // Check if `upto_date` is not a future date
                  }),
              otherwise: () => Yup.string(),
            }
          ),
          
        currently_working: Yup.boolean(),
      }, [
        ['degree', 'company'],
        ['degree', 'year'],
        ['degree', 'certificate'],
        ['company', 'year'],
        ['company', 'certificate'],
        ['year', 'certificate'],
        ['course', 'certificate'],
        ['year', 'course'],
        ['company', 'course'],
        ['degree', 'course'],
        ['joined_date', 'upto_date'],
        ['joined_date', 'degree'],
        ['joined_date', 'company'],
        ['joined_date', 'year'],
        ['joined_date', 'course'],
        ['joined_date', 'certificate'],
        ['upto_date', 'degree'],
        ['upto_date', 'company'],
        ['upto_date', 'year'],
        ['upto_date', 'course'],
        ['upto_date', 'certificate'],
        ['currently_working', 'upto_date'],
        ['currently_working', 'degree'],
        ['currently_working', 'company'],
        ['currently_working', 'year'],
        ['currently_working', 'course'],
        ['currently_working', 'certificate'],
        ['currently_working', 'joined_date'],
      ]);
    const experienceSchemaa = Yup.object().shape({
        degree: Yup.string().required('degree is required'),
        joined_date: Yup.string().required('joined date is required'),
        upto_date: Yup.string().required('upto date is required'),

        company: Yup.string().required('Company Name is required'),
            year: Yup.number()
            .required('Year is required')
            .test('min-experience', 'need minimum 6 month of experience', function (val) {
            // Check if the year is at least 0.6
            return val >= 0.6;
            }),

        course: Yup.string().required('Required'),


        certificate: Yup.mixed().required('certificate is required').test(
            'fileType',
            'Only  PDF files are allowed',
            value => value && (value.type === 'application/pdf')
        )
            .test(
                'fileSize',
                'File too large, should be less than 100KB',
                value => value && value.size <= 100 * 1024 // 50KB in bytes
            ),

    })


 





    const validationSchema = Yup.object({

        sslc: sslc_hsc_Scheme,
        hsc: sslc_hsc_Scheme,
        ug: ug_pg_Schema,
        pg: Yup.array().when('ug.degree', {
            is: (degree) => degree === 'Medical or Allied Health Sciences',
            then: () => Yup.array().of(
                pg_Schema
            ),
            otherwise: () => Yup.array().of(
                ug_pg_Schema
            )
        }),
        experience: Yup.array().when('ug.degree', {

            is: (degree) => degree === 'Medical or Allied Health Sciences',
            then: () => Yup.array().of(
                experienceSchemaa
            ),
            // ).test(
            //     'at-least-one-object',
            //     'At least one experience must be filled',
            //     (array) => array.some(exp => exp.degree || exp.company || exp.year || exp.certificate || exp.course)
            // ),
            otherwise: () => Yup.array().of(
                experienceSchema
            )
        })
        ,
        declaration: Yup.boolean().required("Required").oneOf([true], "Declaration must be checked"),
        signature: Yup.mixed()
            .required('Required')
            .test(
                'fileType',
                'Only jpeg or jpg files are allowed',
                value => value && (value.type === 'image/jpeg' || value.type === 'image/jpg')
            )
            .test(
                'fileSize',
                'File too large, should be less than 50KB',
                value => value && value.size <= 50 * 1024 // 50KB in bytes
            )
    })

    const onSubmit = values => {


        setLoading(true)
        // setLoading(true)
        console.log(values);
        


        mutation.mutate(values, {


            onSuccess: (data) => {

                // console.log("success")
                setLoading(false)
                // // console.log("success", data)
                setdataDownload(data)
                setSuccess(true)

                props.update_jobs()

            },
            onError: (error) => {


                setLoading(false)
                navigate('/server_error_500')

            },
        })
    }




    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthOptions = [
        { key: 'Month', value: '' },
        ...months.map(month => ({ key: month, value: month }))
    ];

    const currentYear = new Date().getFullYear()

    const yearOptions = [
        { key: 'Year', value: '' },
        ...Array.from({ length: 100 }, (_, i) => ({
            key: currentYear - i,
            value: currentYear - i
        }))
    ];

    const boardOptions = [
        { key: 'Select', value: '' },
        { key: 'STATE', value: 'State Board' },
        { key: 'CBSE', value: 'CBSE' },
        { key: 'ICSE', value: 'ICSE' },
        { key: 'MATRIC', value: 'Matric' }
    ]

    const ugDegreeOptions = props.ug

    const pgDegreeOptions = props.pg

    const experienceOptions = props.exp

    const ExperienceCoursse = [
        { key: 'Select', value: '' },
        { key: 'PG', value: 'PG' },
    ]

    const handleDownload = () => {
        // Use require to dynamically load the file path
        const fileUrl = require(`../../pdfs/Recruitment.pdf`);
    
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', "Recruitment.pdf");
        document.body.appendChild(link);
        link.click();
    
        // Clean up the DOM by removing the anchor element
        document.body.removeChild(link);
    };



    return (

        <div>
            {loading ? (<LoadingComponent />) : null}
            {success ? (<SuccessModel id={dataDownload.id} applicant_id={dataDownload.applicant_id} />) : null}
            <div className='mt-5'>
                <h4 className='text-custom-red font-bold mb-7  lg:text-[50px] md:text-[40px] text-[35px]'>Tamil Nadu State AIDS Control Society</h4>

                <p className='text-lg my-5 text-start text-custom-red font-bold uppercase'>{props.position}</p>
                <p className='text-lg my-5  text-custom-red underline font-bold'>EDUCATIONAL QUALIFICATION & EXPERIENCE</p>


            </div>


            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                innerRef={formikRef}

            >
                {(formik) => (
                    <Form

                        className='flex flex-col justify-center items-center'

                    >


                        <Field

                            type="hidden"
                            name="position"

                        />


                        <div className="container font-sans">

                            <div className='w-full mb-5 '>
                                <p className='text-custom-red mb-2 underline text-start font-bold'>S.S.L.C. (10th)</p>
                                <div className='w-full gap-2 grid grid-cols-11 p-4 border-solid border border-gray-400 rounded-md'>
                                    <div className='lg:col-span-3 col-span-12'>
                                        <p className='text-start text-xs font-bold mb-2'>As per S.S.L.C. Certificate: <small className='text-custom-red text-sm'>*</small></p>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div className='col-span-3'>

                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='sslc.first_name'
                                                    label="NAME OF THE APPLICANT"
                                                    placeholder="NAME OF THE APPLICANT"
                                                />

                                            </div>

                                            <div className='col-span-1'>

                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='sslc.last_name'
                                                    label="INITIAL"
                                                    placeholder="INITIAL"
                                                />

                                            </div>
                                        </div>
                                    </div>


                                    <div className="lg:col-span-2 col-span-8">
                                        <p className='text-start text-xs font-bold mb-2'>S.S.L.C. Register Number: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='input'
                                            type='text'
                                            name='sslc.register_number'
                                            label="ENTER YOUR REGISTER NUMBER"
                                            placeholder="ENTER YOUR REGISTER NUMBER"
                                        />

                                    </div>

                                    <div className="lg:col-span-2 col-span-12">
                                        <p className='text-start text-xs truncate  font-bold mb-2'>S.S.L.C. Month / Year of Passing: <small className='text-custom-red text-sm'>*</small></p>
                                        <div className="grid grid-cols-4 gap-1">

                                            <div className='col-span-2'>
                                                <FormikControl
                                                    control='select'
                                                    type='select'
                                                    name='sslc.month'
                                                    options={monthOptions}
                                                />


                                            </div>

                                            <div className='col-span-2'>
                                                <FormikControl
                                                    control='select'
                                                    type='select'
                                                    name='sslc.year'
                                                    options={yearOptions}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 col-span-6">
                                        <p className='text-start text-xs truncate font-bold mb-2'>Type of Board: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='select'
                                            type='select'
                                            name='sslc.board'
                                            options={boardOptions}
                                        />

                                    </div>
                                    <div className="lg:col-span-1 col-span-6">
                                        <p className='text-start text-xs truncate font-bold mb-2'>Enter Percentage: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='input'
                                            type='text'
                                            name='sslc.percentage'
                                            label="PERCENTAGE"
                                            placeholder="%"
                                        />

                                    </div>

                                    <div className="lg:col-span-2 col-span-4">
                                        <p className='lg:text-center text-start text-xs font-bold mb-2'>Upload Marksheet: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='file'
                                            type='file'
                                            id='sslc.marksheet'
                                            name='sslc.marksheet'
                                            formik={formik}
                                            label="Browse File"
                                        />
                                        {!formik.values.sslc.marksheet && (
                                            <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: The uploaded file must be less than 200KB and only in .pdf formats.</p>


                                        )}


                                    </div>


                                </div>
                            </div>

                            <div className='w-full mb-5 '>
                                <p className='text-custom-red underline mb-2 text-start font-bold'>H.S.C. (12th)</p>

                                <div className='w-full  border-solid border border-gray-400 rounded-md gap-1 grid grid-cols-11 p-4'>

                                    <div className='lg:col-span-3 col-span-12'>
                                        <p className='text-start  text-xs font-bold mb-2'>As per H.S.C. Certificate: <small className='text-custom-red text-sm'>*</small></p>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div className='col-span-3'>
                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='hsc.first_name'
                                                    label="NAME OF THE APPLICANT"
                                                    placeholder="NAME OF THE APPLICANT"
                                                />
                                            </div>

                                            <div className='col-span-1'>
                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='hsc.last_name'
                                                    label="INITIAL"
                                                    placeholder="INITIAL"
                                                />

                                            </div>
                                        </div>
                                    </div>


                                    <div className="lg:col-span-2 col-span-8">
                                        <p className='text-start text-xs font-bold mb-2'>H.S.C. Register Number: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='input'
                                            type='text'
                                            name='hsc.register_number'
                                            label="ENTER YOUR REGISTER NUMBER"
                                            placeholder="ENTER YOUR REGISTER NUMBER"
                                        />

                                    </div>

                                    <div className="lg:col-span-2 col-span-12">
                                        <p className='text-start text-xs font-bold mb-2'>H.S.C. Month / Year of Passing: <small className='text-custom-red text-sm'>*</small></p>
                                        <div className="grid grid-cols-4 gap-1">

                                            <div className='col-span-2'>
                                                <FormikControl
                                                    control='select'
                                                    type='text'
                                                    name='hsc.month'
                                                    options={monthOptions}
                                                />


                                            </div>

                                            <div className='col-span-2'>
                                                <FormikControl
                                                    control='select'
                                                    type='text'
                                                    name='hsc.year'
                                                    options={yearOptions}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 col-span-6">
                                        <p className='text-start text-xs font-bold mb-2'>Type of Board: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='select'
                                            type='text'
                                            name='hsc.board'
                                            options={boardOptions}
                                        />

                                    </div>
                                    <div className="lg:col-span-1 col-span-6">
                                        <p className='text-start text-xs font-bold mb-2'>Enter Percentage: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='input'
                                            type='text'
                                            name='hsc.percentage'
                                            label="ENTER PERCENTAGE"
                                            placeholder="%"
                                        />

                                    </div>

                                    <div className="lg:col-span-2 col-span-4">
                                        <p className='lg:text-center text-start text-xs font-bold mb-2'>Upload Marksheet: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='file'
                                            type='file'
                                            id='hsc.marksheet'
                                            name='hsc.marksheet'
                                            formik={formik}
                                            label="Browse File"
                                        />
                                        {!formik.values.hsc.marksheet && (
                                            <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: The uploaded file must be less than 200KB and only in .pdf formats.</p>


                                        )}

                                    </div>


                                </div>
                            </div>

                            <div className='w-full mb-5 '>
                                <p className='text-custom-red mb-2 underline uppercase text-start font-bold'>UnderGraduation</p>

                                <div className='w-full  border-solid border border-gray-400 rounded-md gap-1 grid grid-cols-11 p-4'>


                                    <div className='lg:col-span-3 col-span-11'>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div className="col-span-4">
                                                <p className='text-start text-xs font-bold mb-2'>Degree: <small className='text-custom-red text-sm'>*</small></p>
                                                <FormikControl
                                                    control='select'
                                                    type='text'
                                                    name='ug.degree'
                                                    options={ugDegreeOptions}
                                                />

                                            </div>
                                            <div className="col-span-4 ">
                                                <p className='text-start text-xs font-bold mb-2'>As per U.G. Certificate: <small className='text-custom-red text-sm'>*</small></p>

                                                <div className="grid grid-cols-4 gap-1">
                                                    <div className='col-span-3'>
                                                        <FormikControl
                                                            control='input'
                                                            type='text'
                                                            name='ug.first_name'
                                                            label="NAME OF APPLICANT"
                                                            placeholder="NAME OF APPLICANT"
                                                        />
                                                    </div>

                                                    <div className='col-span-1'>
                                                        <FormikControl
                                                            control='input'
                                                            type='text'
                                                            name='ug.last_name'
                                                            label="INITIAL"
                                                            placeholder="INITIAL"
                                                        />

                                                    </div>
                                                </div>

                                            </div>



                                        </div>
                                    </div>


                                    <div className=' lg:col-span-6 col-span-11'>
                                        <div className='grid grid-cols-5 gap-1'>
                                            <div className="col-span-5">
                                                <p className='text-start text-xs font-bold mb-2'>Courses / Discipline: <small className='text-custom-red text-sm'>*</small></p>

                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='ug.department'
                                                    label="ENTER YOUR COURSE NAME"
                                                    placeholder="ENTER YOUR COURSE NAME"
                                                />
                                            </div>
                                            <div className="lg:col-span-2 col-span-5">
                                                <p className='text-start text-xs font-bold mb-2'>U.G. Register Number: <small className='text-custom-red text-sm'>*</small></p>
                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='ug.register_number'
                                                    label="ENTER YOUR REGISTER NUMBER"
                                                    placeholder="ENTER YOUR REGISTER NUMBER"
                                                />
                                            </div>
                                            <div className="lg:col-span-2 col-span-5">

                                                <p className='text-start text-xs font-bold mb-2'>U.G. Month / Year of Passing: <small className='text-custom-red text-sm'>*</small></p>
                                                <div className="grid grid-cols-4 gap-1">

                                                    <div className='col-span-2'>

                                                        <FormikControl
                                                            control='select'
                                                            type='text'
                                                            name='ug.month'
                                                            options={monthOptions}
                                                        />


                                                    </div>

                                                    <div className='col-span-2'>
                                                        <FormikControl
                                                            control='select'
                                                            type='text'
                                                            name='ug.year'
                                                            options={yearOptions}
                                                        />

                                                    </div>
                                                </div>

                                            </div>

                                            <div className="lg:col-span-1 col-span-5">
                                                <p className='text-start text-xs font-bold mb-2'>Enter Percentage: <small className='text-custom-red text-sm'>*</small></p>

                                                <FormikControl
                                                    control='input'
                                                    type='text'
                                                    name='ug.percentage'
                                                    label="PERCENTAGE"
                                                    placeholder="%"
                                                />

                                            </div>
                                        </div>

                                    </div>

                                    <div className="lg:col-span-2 col-span-4">
                                        <p className='lg:text-center text-start text-xs font-bold mb-2'>Upload Marksheet: <small className='text-custom-red text-sm'>*</small></p>
                                        <FormikControl
                                            control='file'
                                            type='file'
                                            id='ug.marksheet'
                                            name='ug.marksheet'
                                            formik={formik}
                                            label="Browse File"
                                        />

                                        {!formik.values.ug.marksheet && (
                                            <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: The uploaded file must be less than 200KB and only in .pdf formats.</p>


                                        )}



                                    </div>


                                </div>
                            </div>

                            <div className='w-full mb-5 '>
                                <p className='text-custom-red mb-2 underline text-start uppercase font-bold'>postgraduation</p>



                                <FieldArray name='pg'>

                                    {
                                        fieldarrayprops => {
                                            const { push, remove, form } = fieldarrayprops
                                            const { values, validateForm } = form
                                            const { pg } = values
                                            return (
                                                <div className='border-solid border border-gray-400 rounded-md p-4'>
                                                    {
                                                        pg.map((pgdegree, index) => (
                                                            <div key={index} className='w-full   gap-1 grid grid-cols-12'>
                                                                <div className='lg:col-span-3 col-span-12'>
                                                                    <div className="grid grid-cols-4 gap-1">
                                                                        <div className="col-span-4">
                                                                            <p className='text-start text-xs font-bold mb-2'>Degree: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>
                                                                            <FormikControl
                                                                                control='select'
                                                                                type='text'
                                                                                name={`pg[${index}].degree`}
                                                                                options={pgDegreeOptions}
                                                                            />

                                                                        </div>
                                                                        <div className="col-span-4">
                                                                            <p className='text-start text-xs font-bold mb-2'>As per P.G. Certificate: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>

                                                                            <div className="grid grid-cols-4 gap-1">
                                                                                <div className='col-span-3'>

                                                                                    <FormikControl
                                                                                        control='input'
                                                                                        type='text'
                                                                                        name={`pg[${index}].first_name`}
                                                                                        label="NAME OF APPLICANT"
                                                                                        placeholder="NAME OF APPLICANT"
                                                                                    />

                                                                                </div>

                                                                                <div className='col-span-1'>
                                                                                    <FormikControl
                                                                                        control='input'
                                                                                        type='text'
                                                                                        name={`pg[${index}].last_name`}
                                                                                        label="INITIAL"
                                                                                        placeholder="INITIAL"
                                                                                    />

                                                                                </div>
                                                                            </div>
                                                                        </div>



                                                                    </div>
                                                                </div>
                                                                <div className="lg:col-span-7 col-span-12 grid gap-1 grid-cols-6">


                                                                    <div className="lg:col-span-6 col-span-8">
                                                                        <p className='text-start text-xs font-bold mb-2'>Courses / Discipline: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>
                                                                        <FormikControl
                                                                            control='input'
                                                                            type='text'
                                                                            name={`pg[${index}].department`}
                                                                            label="ENTER YOUR COURSE NAME"
                                                                            placeholder="ENTER YOUR COURSE NAME"
                                                                        />

                                                                    </div>


                                                                    <div className="lg:col-span-2 col-span-8">
                                                                        <p className='text-start text-xs font-bold mb-2'>P.G. Register Number: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>
                                                                        <FormikControl
                                                                            control='input'
                                                                            type='text'
                                                                            name={`pg[${index}].register_number`}
                                                                            label="ENTER YOUR REGISTER NUMBER"
                                                                            placeholder="ENTER YOUR REGISTER NUMBER"
                                                                        />

                                                                    </div>

                                                                    <div className="lg:col-span-2 col-span-12">
                                                                        <p className='text-start text-xs font-bold mb-2'>P.G. Month / Year of Passing: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>
                                                                        <div className="grid grid-cols-4 gap-1">

                                                                            <div className='col-span-2'>
                                                                                <FormikControl
                                                                                    control='select'
                                                                                    type='text'
                                                                                    name={`pg[${index}].month`}
                                                                                    options={monthOptions}
                                                                                />



                                                                            </div>
                                                                            <div className='col-span-2'>
                                                                                <FormikControl
                                                                                    control='select'
                                                                                    type='text'
                                                                                    name={`pg[${index}].year`}
                                                                                    options={yearOptions}
                                                                                />



                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="lg:col-span-2 col-span-6">
                                                                        <p className='text-start text-xs font-bold mb-2'>Enter Percentage: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>
                                                                        <FormikControl
                                                                            control='input'
                                                                            type='text'
                                                                            name={`pg[${index}].percentage`}
                                                                            label="PERCENTAGE"
                                                                            placeholder="%"
                                                                        />

                                                                    </div>
                                                                </div>

                                                                <div className="lg:col-span-2 col-span-6">
                                                                    <div className="grid col-1 justify-center gap-1">
                                                                        <div>
                                                                            <p className='lg:text-center text-start text-xs font-bold mb-2'>Upload Marksheet: {values?.ug?.degree !== 'Medical or Allied Health Sciences' ? (<small className='text-custom-red text-sm'>*</small>) : null}</p>

                                                                            <FormikControl
                                                                                control='file'
                                                                                type='file'
                                                                                id={`pg[${index}].marksheet`}
                                                                                name={`pg[${index}].marksheet`}
                                                                                formik={formik}
                                                                                label="Browse File"
                                                                            />
                                                                            {!pg[index].marksheet && (
                                                                                <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: The uploaded file must be less than 200KB and only in .pdf formats.</p>


                                                                            )}

                                                                        </div>

                                                                        {
                                                                            index > 0 && (

                                                                                <div className='flex flex-col justify-center items-center'>
                                                                                    <button type='button' onClick={() => remove(index)} className="px-4 py-1 block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-xs font-semibold text-white" >cancel
                                                                                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                                                                    </button>

                                                                                </div>

                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        ))
                                                    }

                                                    <div className='w-15 mt-2'>
                                                        <button type='button' onClick={() => {
                                                            push({ degree: '', first_name: '', last_name: '', register_number: '', department: '', percentage: '', marksheet: '', month: '', year: '', })

                                                            validateForm()
                                                        }} className="px-4 py-1 block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-xs font-semibold text-white" >ADD
                                                            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                                        </button>
                                                    </div>

                                                </div>

                                            )
                                        }
                                    }

                                </FieldArray>



                            </div>

                            <div className='w-full mb-5 '>

                                
                            <p className='text-custom-red mb-2 text-start underline font-bold'>ESSENTIAL EXPERIENCE</p>
                            <p className='text-xs text-start text-black mt-2 font-bold mb-2'><small className='font-bold text-custom-red text-sm'>Note : </small>  In case of TANSACS / NACO employee, This section also to be filled.</p>

                            <p className='text-[10px] mb-2 text-start underline font-bold'>For more details, Please see the TANSACS recruitment eligiblity critiria. <small className='text-custom-red cursor-pointer' onClick={handleDownload}>Clik here</small></p>

                            <FieldArray name='experience'>
                                {fieldarrayprops => {
                                    const { push, remove, form } = fieldarrayprops;
                                    const { values, validateForm, touched, errors } = form;
                                    const { experience } = values;

                                    return (
                                    <div className='border-solid border border-gray-400 rounded-md p-4 mb-5'>
                                        {formik?.errors?.experience && typeof formik?.errors?.experience === 'string' && (
                                            
                                        <p className='text-custom-red text-start text-xs font-bold'>{formik?.errors?.experience}</p>
                                        )}
                                        {experience.map((experience_candidate, index) => (
                                        <div key={index} className='w-full'>
                                            <div className='w-full gap-1 grid grid-cols-12 p-4'>
                                            <div className="lg:col-span-3 col-span-12">
                                                <p className='text-start text-xs font-bold mb-2'>Field of Experience:</p>
                                                <FormikControl
                                                control='select'
                                                type='text'
                                                name={`experience[${index}].degree`}
                                                options={experienceOptions}
                                                />
                                            </div>

                                            <div className="lg:col-span-3 col-span-12">
                                                <p className='text-start text-xs font-bold mb-2'>Health Sector / Organization name:</p>
                                                <FormikControl
                                                control='input'
                                                type='text'
                                                name={`experience[${index}].company`}
                                                label="COMPANY NAME"
                                                placeholder="Health Sector / Organization name"
                                                />
                                            </div>


                                            <div className="lg:col-span-3 col-span-12">
                                            <p className='text-start text-xs font-bold mb-2'>Joining Date:</p>

                                                <Field
                                                name={`experience[${index}].joined_date`}
                                                placeholder="Joined Date"
                                                >
                                                {({ form, field }) => {
                                                    const { setFieldValue, setFieldError, errors, touched, values } = form;
                                                    const { value } = field;

                                                    const handleDateChange = (val) => {

                                                        if (!val) {
                                                            // Clear the field if the date value is invalid or empty
                                                            setFieldValue(`experience[${index}].joined_date`, '');
                                                            setFieldValue(`experience[${index}].year`, '0'); // Optional: Clear the calculated year
                                                            setFieldValue(`experience[${index}].year_month`, '0'); // Optional: Clear the calculated year

                                                            return; // Exit the function early
                                                        }
                                                        const { currently_working, upto_date } = values.experience[index];
                                                    
                                                        // Format the selected date
                                                        const formattedDate = format(val, 'yyyy-MM-dd');
                                                        setFieldValue(`experience[${index}].joined_date`, formattedDate);
                                                    
                                                        
                                                    
                                                            // If `upto_date` is present, calculate the difference
                                                            if (upto_date) {
                                                                calculateAndSetYear(
                                                                    setFieldValue,
                                                                    `experience[${index}].year`,
                                                                    upto_date,
                                                                    formattedDate,
                                                                     `experience[${index}].year_month`
                                                                );
                                                            }
                                                        
                                                    
                                                        // Additional check for `currently_working`
                                                        if (currently_working) {
                                                            // If `currently_working` is checked and `upto_date` has errors or is missing, use the current date for calculations
                                                            const currentDate = format(new Date(), 'yyyy-MM-dd');
                                                    
                                                                calculateAndSetYear(
                                                                    setFieldValue,
                                                                    `experience[${index}].year`,
                                                                    currentDate,
                                                                    formattedDate,
                                                                     `experience[${index}].year_month`
                                                                );
                                                        }
                                                    };
                                                    

                                                    return (
                                                    <div className="flex flex-col items-start relative">
                                                        <DateView
                                                        name={`experience[${index}].joined_date`}
                                                        {...field}
                                                        placeholderText="JOINED DATE"
                                                        selected={value ? parseISO(value) : null}
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        yearDropdownItemNumber={100}
                                                        dateFormat="yyyy-MM-dd"
                                                        calendarIcon={<img src={calender} alt="calender" />}
                                                        className={
                                                            touched?.experience?.[index]?.joined_date && errors?.experience?.[index]?.joined_date
                                                            ? 'custom-datepicker-placeholder w-full placeholder-shown:borrelative border border shadow-md py-1 px-2 border-red-400 w-full rounded text-sm focus:outline-none focus:border-sky-400 text-dark'
                                                            : 'custom-datepicker-placeholder w-full relative border border shadow-md py-1 px-2 text-sm border-gray-300 w-full rounded focus:outline-none focus:border-sky-400 text-dark'
                                                        }
                                                        onChange={handleDateChange}
                                                        />
                                                        
                                                    </div>
                                                    );
                                                }}
                                                </Field>
                                                <ErrorMessage component={TextError} name={`experience[${index}].joined_date`} />

                                            </div>

                                            <div className="lg:col-span-3 col-span-12">
                                            
                                                <Field
                                                    name={`experience[${index}].currently_working`}
                                                    type="checkbox"
                                                    >
                                                    {({ field, form }) => {
                                                        const { setFieldValue } = form;
                                                        const { value } = field;
                                                        const { joined_date , upto_date} = values.experience[index];

                                                        const handleCheckboxChange = (e) => {
                                                        setFieldValue(`experience[${index}].currently_working`, e.target.checked);

                                                        // Optionally clear the 'upto_date' if the checkbox is checked
                                                        if (e.target.checked) {
                                                            setFieldValue(`experience[${index}].upto_date`, '');
                                                            if (joined_date ) {
                                                                const currentDate = format(new Date(), 'yyyy-MM-dd');
                                                                calculateAndSetYear(
                                                                    setFieldValue,
                                                                    `experience[${index}].year`,
                                                                    currentDate,
                                                                    joined_date,
                                                                     `experience[${index}].year_month`
                                                                );
                                                            }
                                                        }
                                                        else{
                                                            if (! upto_date ) {
                                                                setFieldValue(`experience[${index}].year`, '0');
                                                                setFieldValue(`experience[${index}].year_month`, '0'); // Optional: Clear the calculated year
                                                                
                                                            }
                                                        }
                                                        };

                                                        return (
                                                        <div className="flex items-center">
                                                            <input
                                                            type="checkbox"
                                                            {...field}
                                                            id={`experience[${index}].currently_working`}
                                                            checked={value}
                                                            onChange={handleCheckboxChange}
                                                            className="mr-2"
                                                            />
                                                            <label className='text-start text-xs truncate font-bold mb-2' htmlFor={`experience[${index}].currently_working`}>Currently working here</label>
                                                        </div>
                                                        );
                                                    }}
                                                </Field>

                                                <Field
                                                name={`experience[${index}].upto_date`}
                                                placeholder="Upto Date"
                                                >
                                                {({ form, field }) => {
                                                    const { setFieldValue, setFieldError, errors, touched, values } = form;
                                                    const { value } = field;

                                                    const handleDateChange = (val) => {

                                                        if (!val) {
                                                            // Clear the field if the date value is invalid or empty
                                                            setFieldValue(`experience[${index}].upto_date`, '');
                                                            setFieldValue(`experience[${index}].year`, '0'); // Optional: Clear the calculated year
                                                            setFieldValue(`experience[${index}].year_month`, '0'); // Optional: Clear the calculated year

                                                            return; // Exit the function early
                                                        }
                                                        const { currently_working, joined_date } = values.experience[index];
                                                    
                                                        // Check if `currently_working` is checked
                                                        if (currently_working) {
                                                            // If `joined_date` is present and there are no errors in `joined_date`, calculate the year using the current date as `upto_date`
                                                            if (joined_date ) {
                                                                const currentDate = format(new Date(), 'yyyy-MM-dd');
                                                                calculateAndSetYear(
                                                                    setFieldValue,
                                                                    `experience[${index}].year`,
                                                                    currentDate,
                                                                    joined_date,
                                                                     `experience[${index}].year_month`
                                                                );
                                                            }
                                                            return; // Exit the function early to prevent further execution
                                                        }
                                                    
                                                        const formattedDate = format(val, 'yyyy-MM-dd');
                                                        setFieldValue(`experience[${index}].upto_date`, formattedDate);
                                                    
                                                        // Execute additional logic if `joined_date` exists and there are no errors
                                                        if (joined_date && isBefore(parseISO(joined_date), parseISO(formattedDate))) {
                                                            console.log("current");
                                                    
                                                            // Calculate the year if both dates are filled
                                                            calculateAndSetYear(
                                                                setFieldValue,
                                                                `experience[${index}].year`,
                                                                formattedDate,
                                                                joined_date,
                                                                `experience[${index}].year_month`
                                                            );
                                                        }
                                                    };
                                                    

                                                    return (
                                                    <div className="flex flex-col items-start relative">
                                                        <DateView
                                                        name={`experience[${index}].upto_date`}
                                                        {...field}
                                                        placeholderText="UPTO DATE"
                                                        selected={value ? parseISO(value) : null}
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        yearDropdownItemNumber={100}
                                                        dateFormat="yyyy-MM-dd"
                                                        calendarIcon={<img src={calender} alt="calender" />}
                                                        className={
                                                            touched?.experience?.[index]?.upto_date && errors?.experience?.[index]?.upto_date
                                                            ? 'custom-datepicker-placeholder w-full placeholder-shown:borrelative border border shadow-md py-1 px-2 border-red-400 w-full rounded text-sm focus:outline-none focus:border-sky-400 text-dark'
                                                            : 'custom-datepicker-placeholder w-full relative border border shadow-md py-1 px-2 text-sm border-gray-300 w-full rounded focus:outline-none focus:border-sky-400 text-dark'
                                                        }
                                                        onChange={handleDateChange}
                                                        />
                                                        {errors?.experience?.[index]?.upto_date && touched?.experience?.[index]?.upto_date && (
                                                        <div className="text-custom-red text-xs mt-1">
                                                            {console.log(errors)
                                                            }
                                                            <p>{errors.experience[index].upto_date}</p>
                                                        </div>
                                                        )}
                                                        <ErrorMessage component={TextError} name={`experience[${index}].currently_working`} />

                                                    </div>
                                                    );
                                                }}
                                                </Field>
                                            </div>

                                            

                                            <div className="lg:col-span-2 col-span-6">
                                                {/* <p className='text-start text-xs font-bold mb-2'>No. of Year's Experience:</p>
                                                <FormikControl
                                                control='input'
                                                type='text'
                                                name={`experience[${index}].year`}
                                                label="YEARS"
                                                placeholder="YEAR"
                                                /> */}
                                                <p className='text-start text-xs truncate font-bold mb-2'>No. of Year's Experience:</p>
                                                <div className='font-IstokWeb shadow-md text-[15px] border border-1 w-full py-1 px-2 rounded border-gray-300 text-start'>
                                                    <p className='text-[11px] uppercase p-1'>

                                                    {formik.values.experience[index].year_month}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2 col-span-12">
                                                <p className='text-start text-xs font-bold mb-2'>Experience with UG / PG:</p>
                                                <FormikControl
                                                control='select'
                                                type='text'
                                                name={`experience[${index}].course`}
                                                options={ExperienceCoursse}
                                                />
                                            </div>

                                            <div className="lg:col-span-2 col-span-6">
                                                <div className="grid grid-cols-1 justify-center">
                                                <div className='col-span-1 flex flex-col justify-center items-center'>
                                                    <p className='text-start text-xs font-bold mb-2'>Supporting document:</p>
                                                    <FormikControl
                                                    control='file'
                                                    type='file'
                                                    id={`experience[${index}].certificate`}
                                                    name={`experience[${index}].certificate`}
                                                    formik={formik}
                                                    label="Browse File"
                                                    />
                                                    {!experience[index].certificate && (
                                                    <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: The uploaded file must be less than 100KB and only in .pdf formats.</p>
                                                    )}
                                                </div>
                                                {index > 0 && (
                                                    <div className='mt-2 col-span-1 flex flex-col justify-center items-center'>
                                                    <button type='button' onClick={() => remove(index)} className="px-4 py-1 block group relative w-max overflow-hidden rounded-lg bg-custom-red text-xs font-semibold text-white">
                                                        cancel
                                                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                                    </button>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        ))}
                                        <div className='w-15'>
                                        <button type='button' onClick={() => {
                                            push({ degree: '', company: '', year: '', certificate: '', course: '' });
                                            validateForm();
                                        }} className="px-4 py-1 block group relative w-max overflow-hidden rounded-lg bg-custom-red text-xs font-semibold text-white">
                                            ADD
                                            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                        </button>
                                        </div>
                                    </div>
                                    );
                                }}
                                </FieldArray>

                            </div>



                            <div className='w-full mb-5'>
                                <p className='text-custom-red mb-2 text-start underline font-bold'>DECLARATION  </p>

                                <ul className='text-start list-disc ms-5 list-outside'>
                                    <li>I hereby declare that all the particulars furnished in this application are true, correct
                                        and complete to the best of my knowledge and belief. In the event of any information
                                        being found false or incorrect or ineligibility being detected before or after the selection,
                                        action can be taken against me by the TANSACS. </li>

                                    <li>I further declare that I fulfill all the eligibility conditions prescribed for admission to this
                                        post.
                                    </li>

                                    <li>
                                        I have gone through the instructions etc., for this recruitment, before filling up the
                                        application form through online mode.

                                    </li>
                                    <li>
                                        I have informed my employer in writing that I am applying for this post and furnish the
                                        NOC for this purpose (if applicable).

                                    </li>
                                    <li>
                                        I am not a terminated employee.
                                    </li>
                                    <li>
                                        There is no pending criminal case / Vigilance Case against me.
                                    </li>
                                    <li>
                                        I hereby declare that my character / antecedents are suitable for appointment to this
                                        post.

                                    </li>
                                </ul>

                                <div className='list-disc list-none mt-5'>
                                    <FormikControl
                                        control='check'
                                        type='checkbox'
                                        id={"declaration"}
                                        name={"declaration"}
                                        label={"I hereby declare that I have read all the declaration clauses, that all of the above contents are true to the best of my knowledge, and that I have entered with full consciousness."}

                                    />
                                </div>
                                <div className='flex md:justify-end justify-center'>
                                    <div className='text-center w-[250px]'>
                                        <p className=' text-custom-red underline font-bold mb-2'> Signature</p>
                                        <FormikControl
                                            control='file'
                                            type='file'
                                            id={"signature"}
                                            name={"signature"}
                                            formik={formik}
                                            label="upload a signature"
                                            custom={true}
                                        />
                                        {!formik?.values?.signature &&
                                            (
                                                <p className='text-[9.6px] px-2 text-custom-red textb mt-2'>Note: Uploaded file to be less than 50 kb and only .jpeg, .jpg formats are allowed </p>

                                            )
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex justify-around'>
                            <Link to={'/tansacs/jobs'} className="px-4 py-1 block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                                Cancel
                                <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </Link>
                            
                            {formik?.errors?.experience && typeof formik?.errors?.experience === 'string' ? 
                            
                                <CustomError />
                            :
                            
                                <ConfrimModal formikRef={formikRef} skip={true} />
                                
                            }

                        </div>


                    </Form>
                )}


            </Formik>
        </div>
    );

}

const mapStateToProps = state => {


    return {

        token: state.login.token,
        permission: state.login.is_permission
    }

}

const mapDispatchToProps = dispatch => {

    return {
        update_jobs: () => dispatch(update_jobs()),
        cancel_permission: () => dispatch(cacel_permission())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Common2Form
);