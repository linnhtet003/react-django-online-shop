import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination,Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Cards from '../components/Cards';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const base_url = "http://127.0.0.1:8000";

    useEffect(() => {
        const bearer = localStorage.getItem('foode-token');
        if (!bearer) {
            navigate('/login');
            return;
        }

        // fetch products
        fetch("http://127.0.0.1:8000/api/productlist/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearer}`
            }
        })
        .then(resp => {
            if(resp.status === 401) {
            localStorage.removeItem('foode-token');
            navigate("/login");
            }
            return resp.json();
        })
        .then(data => {
            if (data.length >= 3) {
                const product_3 = data.slice(0, 3);
                setProducts(product_3)
            } else if((data.length > 0) && (data.length < 3)){
                setProducts(data)
            } else {
                console.log("No Product is not exit")
            }
        })
        .catch(error => console.log(error))

        // fetch reviews
        fetch("http://127.0.0.1:8000/api/reviewlist/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearer}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.length >= 3) {
                const review_3 = data.slice(0, 3);
                setReviews(review_3);
            } else if((data.length > 0) && (data.length < 3)){
                setReviews(data)
            } else {
                console.log("No review is not exit")
            }
        })
        .catch(error => console.log("Review fetch error:", error));
        },[navigate])

  return (
    <div>

        {/* Main Header */}
        <div className='mainHeader max-w-[90%] m-auto h-[56rem] pt-[4rem] relative'>
            <div className='mainText bg-[var(--inner-bg-color)] w-full rounded-[3rem] flex justify-center py-[3rem] px-[5rem] relative isolate'>
                <div className='absolute leftImage w-[10vw] top-1 left-3 z-30'>
                    <img className='w-full object-cover' src='/images/egg.png' alt='egg'/>
                </div>
                <h1 className='centerText text-[9vw] tracking-[.5rem] uppercase text-[var(--text-color)] text-center mt-5 z-20'
                    style={{fontFamily: "'Bebas Neue', sans-serif"}}>Fresh Fast Flavorful</h1>
                <div className='absolute w-[10vw] rightImage top-2 right-1 -z-10'>
                    <img className='w-full object-cover' src='/images/wineglass.png' alt='dessert'/>
                </div>
                <div className='absolute w-[18vw] centerImage top-[-10%] left-[50%] translate-x-[-50%] rotate-[50deg] z-10'>
                    <img className='w-full object-cover' src='/images/wineBottle.png' alt='dessert'/>
                </div>
            </div>
        </div>

        {/* Main  */}
        <div className='max-w-[90%] m-auto py-24'>

            {/* Menu */}
            <div className='mb-20'>
                <div className='w-full flex flex-col justify-center items-center mb-16'>
                    <h2 className='text-2xl font-semibold tracking-[.18rem] text-[var(--btn-color)] uppercase]'>Our Menu</h2>
                    <p className='service-name text-6xl font-medium capitalize text-[var(--text-color)] mt-4'>The Most Popular</p>
                </div>
                <div className='w-[90%] m-auto'>
                    <div className='w-full flex flex-wrap justify-center gap-12'>
                        {products.map((product, index) => (
                            <Cards key={index} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* review */}
        <div className='w-[90%] m-auto mb-28 flex flex-row gap-3 flex-wrap'>
            <div className='flex-1 basis-[300px]'>
                <img className='w-[90%] m-auto h-full' src='/images/reviewbg.png' alt='reviews'/>
            </div>
            <div className='w-[650px] max-w-full flex-1 mt-20'>
                <h4 className='text-[1.8rem] text-[var(--text-color)] text-center font-semibold mb-2'>Our reviews</h4>
                <h2 className='text-6xl capitalize text-[var(--text-color)] text-center font-semibold mb-16'>What they say?</h2>

                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    // pagination={{ clickable: true,}}
                    navigation={{
                        nextEl: '.nextreview',
                        prevEl: '.prevreview'
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className='w-full m-auto'>
                                <div className='flex gap-4 ml-3 mb-5'>
                                    <div className='w-16 aspect-square rounded-full overflow-hidden'>
                                        <img className='w-full h-full object-cover' src={base_url + review.created_by_data.user_profile} alt='profile'/>
                                    </div>
                                    <div>
                                        <h4 className='text-[1.8rem] text-[--text]'>{review.created_by_data.name}</h4>
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                            key={i}
                                            className={`bx bxs-star ${i < review.starrating ? 'text-[--btn-color]' : 'text-gray-300'}`}></i>
                                        ))}
                                    </div>
                                </div>
                                <p className='ml-8 text-gray-600' style={{lineHeight: '1.8rem'}}>
                                    {review.message}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='flex justify-between items-center p-3 mt-16'>
                    <div className='prevreview shake-btn bg-[var(--btn-color)] rounded-full hover:scale-105 hover:text-white transition-all duration-300 ease-in-out'>
                        <i className='bx bx-chevron-left px-1 py-1 text-2xl'></i>
                    </div>
                    <div className='nextreview shake-btn bg-[var(--btn-color)] rounded-full hover:scale-105 hover:text-white transition-all duration-300 ease-in-out'>
                        <i className='bx bx-chevron-right px-1 py-1 text-2xl'></i>
                    </div>
                </div>
            </div>
        </div>

        <div className='max-w-[90%] m-auto mt-12 mb-28'>

            {/* advertise */}
            <div className='advmain w-full bg-[var(--text-color)] py-32 mt-20 rounded-3xl flex flex-row flex-full'>
                <div className='advLeft flex-1 relative'>
                    <img className='w-96 absolute left-4 -top-32' src='/images/whitewinebottle.png' alt='whitewinebotte' />
                    <img className='w-64 absolute top-20 left-40 rotate-[10deg]' src='/images/whitewineglass.png' alt='whitewineglass' />
                    <img className='w-64 absolute top-20 rotate-[-10deg]' src='/images/whitewineglass.png' alt='whitewineglass' />
                </div>
                <div className='advCenter text-center flex-1'>
                    <h2 className='text-[5vw] tracking-[.2rem] text-[var(--bg-color)] font-semibold'
                        style={{fontFamily: '"beba Neue", sans-serif'}}>Foo<span className='text-[var(--btn-color)]'>die</span></h2>
                    <p className='advCentertext text-[1.1rem] text-[var(--bg-color)] py-8'>Our Unique Products are 100% Healthy<br/>
                        <span className='advLeft'>Delicious dates start here. Whether it's your first meal together or your hundredth, we bring flavor to your love story.</span>
                    </p>
                    <button className='py-3 px-6 bg-[var(--btn-color)] rounded-full text-[1.1rem] text-[var(--text-color)] animate-bounce'><a href='menu/'>Learn More</a></button>
                </div>
                <div className='advRight flex-1 w-full'>
                    <img className='w-[80%] m-auto' src='/images/pasta.png' alt='pasta' />
                </div>
            </div>

            {/* service */}
            <div className='w-full mt-24 flex flex-col justify-center items-center'>
                <h2 className='text-2xl font-semibold tracking-[.18rem] text-[var(--btn-color)] uppercase pb-16]'>Our Services</h2>
                <div className='w-52 h-1 bg-[var(--btn-color)] mb-5'></div>
                <p className='service-name text-6xl font-medium capitalize text-[var(--text-color)]'>How does it work?</p>
            </div>
            <div className='mt-8 flex justify-center flex-wrap gap-14'>
                <div className='adv-card bg-[var(--bg-color)] flex flex-col items-center justify-center gap-3 py-10 px-20 rounded-2xl transition-all duration-200 ease-in-out'>
                    <img src='/images/easy-to-order.png' alt='easy-to-order' />
                    <h3>Easy to Order</h3>
                    {/* <p>You only need a few steps in ordering food.</p> */}
                </div>
                <div className='adv-card bg-[var(--bg-color)] flex flex-col items-center justify-center gap-3 py-10 px-20 rounded-2xl transition-all duration-200 ease-in-out'>
                    <img src='/images/fast-delivery.png' alt='fast-delivery' />
                    <h3>Fast delivery</h3>
                    {/* <p>Delivery that is always ontime even faster.</p> */}
                </div>
                <div className='adv-card bg-[var(--bg-color)] flex flex-col items-center justify-center gap-3 py-10 px-20 rounded-2xl transition-all duration-200 ease-in-out'>
                    <img src='/images/best-quality.png' alt='best-quality' />
                    <h3>Best Quality</h3>
                    {/* <p>Not only fast for us in quality is aslo number one.</p> */}
                </div>
            </div>

        </div>

    </div>
  )
}

export default Home
