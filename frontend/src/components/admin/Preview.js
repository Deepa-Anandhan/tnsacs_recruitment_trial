import "../../css/preview.css"
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from 'axios';
import { connect } from 'react-redux'
import { APPLICANT_DETAIL } from "../endpoints/admin/AdminEndPoints";

import LoadingComponent from "../basecomponents/loading";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'


function Preview(props) {

  const { userId } = useParams()
  const navigate = useNavigate()


  const { isLoading, data, isError, error } = useQuery("applicant-detail", () => {
    return axios.get(APPLICANT_DETAIL(userId), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${props.token}`
      }
    })
  })

  useEffect(() => {



    if (props.isLogin && !props.isSuperuser) {
      navigate('tansacs/jobs')
    }

    if (!props.isLogin) {
      navigate('/')
    }

  }, [props.isLogin]);



  if (isLoading) {

    return (
      <LoadingComponent />
    )
  }

  if (isError) {
    if (error.response.status === 404) {
      navigate('/page_not_found')
    }
    else {
      navigate(navigate("/server_error_500"))
    }
  }



  const handleDownload = (url, fileName) => {
    fetch(`http://127.0.0.1:8000${url}`)
      .then(response => response.blob())
      .then(blob => {
        // Create a local URL
        const localUrl = window.URL.createObjectURL(blob);
        // Create an anchor tag and trigger download
        const link = document.createElement('a');
        link.href = localUrl;
        link.setAttribute('download', fileName);  // Provide a filename with extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
      })
      .catch(error => console.error('Download error:', error));
  };

  const handleDownloadadmin = async (id, filename) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/jobs/admin_download/${id}`, {
        responseType: 'blob',  // Important for handling PDF download
      });
      // console.log("success");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };



  // const downloadPageAsPDF = (fileName) => {
  //   // Hide elements with the 'ignorebutton' class
  //   const ignoreElements = document.querySelectorAll('.ignorebutton');
  //   const shadowElements = document.querySelectorAll('.box-shadow');
  //   ignoreElements.forEach(el => el.style.visibility = 'hidden');
  //   shadowElements.forEach(el => {
  //     el.classList.remove('box-shadow'); // Remove the same classes
  //   });

  //   html2canvas(document.body, { scale: 1 }) // Adjust scale as needed
  //     .then((canvas) => {
  //       // Show the 'ignorebutton' elements again
  //       ignoreElements.forEach(el => el.style.visibility = 'visible');

  //       const imgData = canvas.toDataURL('image/png');
  //       const imgWidth = 210; // A4 width in mm
  //       const pageHeight = 295;  // A4 height in mm
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       let heightLeft = imgHeight;

  //       const pdf = new jsPDF('p', 'mm');
  //       let position = 0;

  //       // Add image to first page
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       // Add new pages if content overflows
  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       pdf.save(`${fileName}.pdf`);
  //       shadowElements.forEach(el => {
  //         el.classList.add('box-shadow'); // Add back the same classes
  //       });
  //     });
  // };


  if (data) {

    const DateConverter = (dateTimeString) => {

      // const dateTimeString = "2023-12-20T17:25:21.238254+05:30";

      // Convert the string to a Date object
      const date = new Date(dateTimeString);

      // Format the date
      const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-US', optionsDate);

      // Format the time
      const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

      // Combine date and time
      return `${formattedDate}, ${formattedTime}`;
    }


    const companies = ['NACO', 'TANSACS'];

    return (
      <>
        {/* {console.log(data)} */}



        <div className="form-container w-full  flex flex-col justify-center items-center">
          <h1 className="lg:text-[40px] md:text-[35px] text-[25px] text-custom-red font-bold mb-14">TAMILNADU STATE AIDS CONTROL SOCIETY (TANSACS)</h1>


          <div className="w-4/5 ">

            <div className="w-full flex flex-wrap justify-between my-4">
              <div className="md:w-1/2 w-full">
                <div className="flex w-full justify-start items-center text-sm font-bold gap-3">
                  <p className=" text-start text-sm font-bold">APPLICATION NUMBER</p>
                  <p className=" text-start box-shadow rounded-md text-sm font-bold p-2 ">{data.data.application_id}</p>
                </div>
              </div>
              <div className="md:w-1/2 w-full md:mt-0 mt-5">
                <div className="flex w-full lg:justify-end justify-start items-center text-sm font-bold gap-3">
                  <p className=" text-start text-sm font-bold">OVERALL SCORE</p>
                  <p className=" text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.mark} / 100</p>
                </div>
              </div>
            </div>

            <div className="my-3">
              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Personal Details</p>

              <div className="flex flex-wrap w-full my-5">
                <div className="lg:w-3/5 lg:order-1 order-2 w-full flex flex-col gap-5">
                  <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                    <p className="w-1/2 text-start text-sm font-bold uppercase">UNIQUE ID</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.application_id}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold uppercase">SELECTED JOB POSTING</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data?.position}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">APPLIED DATE</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{DateConverter(data.data?.applied_date)}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">NAME OF APPLICANT</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data?.user_profile.first_name + " " + data.data?.user_profile.last_name}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">DATE OF BIRTH</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.user_profile.DOB}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">AGE</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.user_profile.age}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">GENDER</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data?.user_profile.gender}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">MAIL ID</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.user_profile.email}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">FATHER NAME</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data?.user_profile.guardian_name}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">AADHAR CARD</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.user_profile.aadhar}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">CONTACT NUMBER</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data?.user_profile.phone_number}</p>
                  </div>

                </div>

                <div className="lg:w-2/5  w-full lg:order-2 order-1 mb-5  flex flex-col  items-center">
                  <img src={`http://127.0.0.1:8000${data.data.user_profile.profile_image}`} alt="profile image" className="ms-5 w-28 h-28" />
                </div>
              </div>
            </div>



            <div className="my-3">
              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Permenent Address</p>

              <div className="flex w-full flex-wrap my-5">
                <div className="lg:w-3/5 w-full flex flex-col gap-5">
                  <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">ADDRESS LINE 1</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.address[0].address_line1}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">STATE</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.address[0].state}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">DISTRICT</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.address[0].district}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">TOWN/TALUK/CITY</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.address[0].city}</p>
                  </div>
                  <div className="flex w-full justify-center items-center gap-3">
                    <p className="w-1/2 text-start text-sm font-bold">PINCODE</p>
                    <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.address[0].pincode}</p>
                  </div>


                </div>


              </div>
            </div>


            <div className="my-3">
              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Education Details</p>

              <div className="flex  flex-wrap w-full my-5" >
                <div className="lg:w-1/2 w-full p-3" >
                  <div className="p-3 flex flex-col  gap-5" style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }}>

                    <div className="flex w-full justify-center items-center text-sm font-bold gap-3" >
                      <p className="w-1/2 text-start text-sm font-bold">S.S.L.C. REGISTER NUMBER</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.sslc.register_number}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">MONTH / YEAR OF PASSING</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.sslc.year}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">TYPE OF BOARD</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.sslc.board}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">PERCENTAGE</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.sslc.percentage}</p>
                    </div>

                    {/* <a  target='_blank' href={data.data.sslc.marksheet} target="_blank" download onClick={(e) => handleDownloadPDF(e, data.data.sslc.marksheet)}>
                      <button className="text-custom-red underline font-bold text-base">Marksheet</button>
                    </a> */}
                    <div className="flex justify-between items-center ignorebutton">

                      <a target='_blank' href={`http://127.0.0.1:8000${data.data.sslc.marksheet}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                        View
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </a>

                      <button onClick={() => handleDownload(data.data.sslc.marksheet, `${data.data.application_id}_10th.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                        Download
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </button>
                    </div>

                  </div>
                </div>
                <div className="lg:w-1/2 w-full  p-3" >
                  <div className="p-3 flex flex-col  gap-5" style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }} >

                    <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">H.S.C. REGISTER NUMBER</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.hsc.register_number}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">MONTH / YEAR OF PASSING</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.hsc.year}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">TYPE OF BOARD</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.hsc.board}</p>
                    </div>
                    <div className="flex w-full justify-center items-center gap-3">
                      <p className="w-1/2 text-start text-sm font-bold">PERCENTAGE</p>
                      <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.hsc.percentage}</p>
                    </div>
                    <div className="flex justify-between items-center ignorebutton">

                      <a target='_blank' href={`http://127.0.0.1:8000${data.data.hsc.marksheet}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                        View
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </a>

                      <button onClick={() => handleDownload(data.data.hsc.marksheet, `${data.data.application_id}_12th.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                        Download
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </button>
                    </div>


                  </div>





                </div>
                <div className="lg:w-1/2 w-full  p-3">
                  <div className="flex flex-col gap-5 p-3 min-h-[400px] justify-between" style={{
                    boxShadow:
                      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }}>

                    <div className="flex flex-col gap-5">

                      <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                        <p className="w-1/2 text-start text-sm font-bold">UG DEGREE</p>
                        <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.ug.degree} </p>
                      </div>
                      <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                        <p className="w-1/2 text-start text-sm font-bold">DEPARTMENT</p>
                        <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{data.data.ug.department} </p>
                      </div>
                      <div className="flex w-full justify-center items-center gap-3">
                        <p className="w-1/2 text-start text-sm font-bold">UG REGISTER NUMBER</p>
                        <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.ug.register_number}</p>
                      </div>
                      <div className="flex w-full justify-center items-center gap-3">
                        <p className="w-1/2 text-start text-sm font-bold">MONTH /YEAR OF PASSING</p>
                        <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.ug.year}</p>
                      </div>
                      <div className="flex w-full justify-center items-center gap-3">
                        <p className="w-1/2 text-start text-sm font-bold">PERCENTAGE</p>
                        <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{data.data.ug.percentage}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center ignorebutton">

                      <a target='_blank' href={`http://127.0.0.1:8000${data.data.ug.marksheet}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                        View
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </a>

                      <button onClick={() => handleDownload(data.data.ug.marksheet, `${data.data.application_id}_ug.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                        Download
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                      </button>
                    </div>



                  </div>

                </div>
                {data.data.pg.map((pg, index) => (

                  <div key={index} className="lg:w-1/2 w-full p-3" >
                    <div className="flex flex-col gap-5 p-3 min-h-[400px] justify-between" style={{
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                    }}>

                      <div className="flex flex-col gap-5">
                        <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                          <p className="w-1/2 text-start text-sm font-bold"> PG DEGREE</p>
                          <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{pg.degree}</p>
                        </div>
                        <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                          <p className="w-1/2 text-start text-sm font-bold">DEPARTMENT</p>
                          <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{pg.department}</p>
                        </div>
                        <div className="flex w-full justify-center items-center gap-3">
                          <p className="w-1/2 text-start text-sm font-bold"> PG REGISTER NUMBER</p>
                          <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{pg.register_number}</p>
                        </div>
                        <div className="flex w-full justify-center items-center gap-3">
                          <p className="w-1/2 text-start text-sm font-bold"> MONTH / YEAR OF PASSING </p>
                          <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{pg.year}</p>
                        </div>
                        <div className="flex w-full justify-center items-center gap-3">
                          <p className="w-1/2 text-start text-sm font-bold"> PERCENTAGE </p>
                          <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{pg.percentage}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center ignorebutton">

                        <a target='_blank' href={`http://127.0.0.1:8000${pg.marksheet}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                          View
                          <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                        </a>

                        <button onClick={() => handleDownload(pg.marksheet, `${data.data.application_id}_pg${index + 1}.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                          Download
                          <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                        </button>
                      </div>



                    </div>

                  </div>
                )
                )}
              </div>


            </div>


            <div className="my-3">
              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Experience Details</p>
              {data.data.exp.length !== 0 ? (
                <div className="flex w-full flex-wrap my-5">

                  {data.data.exp.map((exp, index) => (

                    <div className="lg:w-1/2 w-full p-2 " key={index}>

                      <div className=" flex flex-col gap-5 justify-between p-4 min-h-[350px]" style={{
                        boxShadow:
                          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                      }}>
                        <div className="flex flex-col gap-5">
                          <div className="flex w-full justify-center items-center text-sm font-bold gap-3">
                            <p className="w-1/2 text-start text-sm font-bold">SELECTED DEPARTMENT</p>
                            <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{exp.degree}</p>
                          </div>
                          <div className="flex w-full justify-center items-center gap-3">
                            <p className="w-1/2 text-start text-sm font-bold">COMPANY NAME</p>
                            <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2 uppercase">{exp.company}</p>
                          </div>
                          <div className="flex w-full justify-center items-center gap-3">
                            <p className="w-1/2 text-start text-sm font-bold">EXPERIENCE</p>
                            <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{exp.year_month}</p>
                          </div>
                          <div className="flex w-full justify-center items-center gap-3">
                            <p className="w-1/2 text-start text-sm font-bold">DEGREE</p>
                            <p className="w-1/2 text-start box-shadow rounded-md text-sm font-bold p-2">{exp.course}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center ignorebutton ">

                          <a target='_blank' href={`http://127.0.0.1:8000${exp.certificate}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                            View
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                          </a>

                          <button onClick={() => handleDownload(exp.certificate, `${data.data.application_id}_experience${index + 1}.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                            Download
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                          </button>
                        </div>

                      </div>
                    </div>

                  ))}


                </div>
              ) : (
                <p className="m-4 text-start">No Experience</p>
              )}


            </div>

            { data.data.pexp.length > 0 && 
            
            (

            <div className="w-full my-3 ">
              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Work Experience With in ( NACO / TANSACS )</p>

              <div className=" w-full my-5  flex flex-col gap-5">

                {companies.map((companyName, index) => {
                  const companyData = data.data.pexp.find(p => p.company === companyName);

                  if (companyData) {
                    // JSX for when company data is found
                    return (
                      <div key={index} className="flex w-full flex-wrap justify-start items-center text-sm font-bold">
                        <p className="lg:w-1/4 w-2/4 text-start text-sm font-bold">{companyData.company} EXPERIENCE : </p>
                        <p className="lg:w-1/4 w-2/4 text-start box-shadow rounded-md text-sm font-bold p-2">{companyData?.year ? companyData.year : 0} </p>
                        <div className="lg:w-1/4 w-2/4 flex flex-wrap justify-center items-center  lg:mt-0 mt-5">
                          {companyData?.certificate ? (

                            // <a target='_blank' href={companyData.certificate} download="Certificate.pdf">
                            //   <button className="text-custom-red underline font-bold text-base">Certificate</button>
                            // </a>
                            <button onClick={() => handleDownload(companyData.certificate, `${data.data.application_id}_NACO.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                              Certificate
                              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                            </button>
                          ) : <p className="font-semibold text-sm">No Certificate</p>}
                        </div>
                        <div className="lg:w-1/4 w-2/4 flex flex-wrap justify-center items-center  lg:mt-0 mt-5">
                          {companyData?.NOC ? (

                            // <a target='_blank' href={data.data.pexp[0].NOC} download="NOC.pdf">
                            //   <button className="text-custom-red underline font-bold text-base">NOC</button>
                            // </a>
                            <button onClick={() => handleDownload(companyData.NOC, `${data.data.application_id}_NACO_NOC.pdf`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                              NOC
                              <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                            </button>
                          ) : <p className="font-semibold text-sm">No NOC</p>}
                        </div>
                      </div>
                    );
                  } else {
                    // JSX for when company data is not found
                    return (
                      <div key={index} className="flex w-full flex-wrap justify-start items-center text-sm font-bold">
                        <p className="lg:w-1/4 w-2/4 text-start text-sm font-bold">{companyName} EXPERIENCE : </p>
                        <p className="lg:w-1/4 w-2/4 text-start box-shadow rounded-md text-sm font-bold p-2">0</p>
                        <div className="lg:w-1/4 w-2/4 flex flex-wrap justify-center items-center lg:mt-0 mt-5">
                          <p className="font-semibold text-sm">No Certificate</p>
                        </div>
                        <div className="lg:w-1/4 w-2/4 flex flex-wrap justify-center items-center lg:mt-0 mt-5">
                          <p className="font-semibold text-sm">No NOC</p>
                        </div>
                      </div>
                    );
                  }
                })}










              </div>
            </div>
            )
              }


            <div className="my-3">

              <p className="text-white text-start px-4 bg-custom-red py-2 font-bold uppercase">Signature</p>

              <div className="my-3 flex gap-10 items-center">
                <p className=" text-sm font-bold">SIGNATURE</p>
                <a target='_blank' href={`http://127.0.0.1:8000${data.data.signature}`} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">
                  View
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                </a>

                <button onClick={() => handleDownload(data.data.signature, `${data.data.application_id}_signature.jpeg`)} className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white">

                  Download
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>

                </button>


              </div>

            </div>


          </div>


        </div>



        <div className="flex justify-center items-center">

          <button className="px-[30px] py-[3px] block group relative  w-max overflow-hidden rounded-lg bg-custom-red text-sm font-semibold text-white" onClick={() => handleDownloadadmin(data.data.id, data.data.application_id)}>Download as PDF</button>
        </div>

      </>
    );
  }
}

const mapStateToProps = state => {


  return {

    isLogin: state.login.isLogin,
    isSuperuser: state.login.is_superuser,
    token: state.login.token
  }
}

export default connect(mapStateToProps)(Preview);