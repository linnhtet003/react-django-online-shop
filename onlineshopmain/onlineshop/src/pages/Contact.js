import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate()
  const [review, setReview] = useState({
    option: "",
    message: "",
    starrating: ""
  })

  const reviewInput = (e) => {
    let reviewData = {...review};
    reviewData[e.target.name] = e.target.value
    setReview(reviewData)
  }

  useEffect(() => {
    const bearer = localStorage.getItem('foode-token');
    if (!bearer) {
      navigate('/login');
      return;
    }

    fetch("http://127.0.0.1:8000/api/userdetail/",{
      method: "GET",
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/json',
      }
    })
    .then(resp => {
      if(resp.status === 401){
        localStorage.removeItem('foode-token');
        navigate("/login")
      }
      return resp.json();
    })
  },[navigate])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!review.option || !review.message || !review.starrating){
      alert('Please fill out all fields');
      return;
    }
    const bearer = localStorage.getItem('foode-token');
    fetch(`http://127.0.0.1:8000/api/reviewcreate/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      },
      body: JSON.stringify(review)
    })
    .then(resp => {
      if(resp.status === 201){
        alert("You successfully created the review!");
        return resp.json();
      }else{
        return resp.json()
        .then(data => {
          console.error(data);
          alert("Failed to create review.");
        });
      }
    })
    .catch(error => {
      console.error("Network error", error);
      alert("An error occurred while submitting.");
    })
  }

  return (
    <div className='w-[80%] m-auto my-24'>
      <div className='contactform flex flex-wrap bg-white rounded-2xl overflow-hidden' style={{boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
        <div className='flex-1'>
          <h1 className='pt-12 pl-10 text-center text-3xl font-[500 text-[var(--text-color)]'>Contact Us</h1>
            <form onSubmit={handleSubmit}>

              <h1 className='mt-[7%] ml-[6%] text-gray-600 font-semibold text-lg'>Your option</h1>
              <select name='option' value={review.option} onChange={reviewInput} className="text-sm mt-[2%] text-[gray] text-center custom-input w-[90%] ml-[5%] resize-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100">
                <option value='' className="placeholder:text-[gray]" disabled hidden>-- Select you want to review --</option>
                <option value='Service' className='text-black'> -- About Service -- </option>
                <option value='Food' className='text-black'> -- About Food -- </option>
                <option value='Delicious' className='text-black'> -- About Delicious -- </option>
              </select>

              <h1 className='mt-[5%] ml-[6%] text-gray-600 font-semibold text-lg'>Message</h1>
              <textarea name='message' onChange={reviewInput} className="text-sm custom-input w-[90%] h-28 ml-[5%] mt-[2%] resize-none px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100"
                  placeholder="Enter text here">
              </textarea>

              <h1 className='mt-[5%] ml-[6%] text-gray-600 font-semibold text-lg'>Give Me Rating</h1>
              <div className='flex justify-start'>
                <div className='ratingstar ml-[5%] opacity-100 after:content-none after:clear-both after:table'>
                  {[5, 4, 3, 2, 1].map((num) => (
                    <React.Fragment key={num}>
                      <input className='hidden opacity-100'
                      type='radio' id={`star${num}`}
                      name='starrating'
                      value={num}
                      onChange={reviewInput}
                      />
                      <label
                        htmlFor={`star${num}`}
                        className='float-right w-11 cursor-pointer text-[#ccc] transition-all duration-300 before:content-["\2605"] before:text-[45px] before:transition-colors before:duration-300'
                        ></label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className='contactbtn flex justify-end items-center h-16 mb-4 mr-6'>
                <button type='submit'  className='py-3 px-6 font-bold text-white text-base rounded-2xl border-transparent hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300'
                        style={{background: 'linear-gradient(90deg, rgba(77,54,208,1) 0%, rgba(132,116,254,1) 100%)', boxShadow: '0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745)'}}>
                  Send
                </button>
              </div>
            </form>
        </div>
        <div className='flex-1'>
          <img className='w-full h-full' src='/images/contactus-bg.jpg' alt='contact us'/>
        </div>
      </div>
    </div>
  )
}

export default Contact


// npm install jwt-decode
// import jwtDecode from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// const Contact = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('foode-token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Math.floor(Date.now() / 1000); // in seconds
//       if (decoded.exp < currentTime) {
//         // Token is expired
//         localStorage.removeItem('foode-token');
//         navigate('/login');
//       }
//     } catch (err) {
//       console.error("Invalid token:", err);
//       localStorage.removeItem('foode-token');
//       navigate('/login');
//     }
//   }, [navigate]);
