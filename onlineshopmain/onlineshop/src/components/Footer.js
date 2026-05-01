import 'boxicons/css/boxicons.min.css';

const Footer = () => {
  return (
    <div>
            <div className='flex text-center flex-row items-start justify-center pb-8'>
            <div className='flex-1'>
                <a href='#' className='footer-name text-3xl self-center px-2 font-bold'>
                    Foo<span className='text-[var(--btn-color)]'>die</span>
                </a>
                <p className='mt-4'>We will fiil your tummy with delicious food with fast delivery.</p>
                <div className='footer-social flex justify-center gap-8 mt-6'>
                    <a href='https://www.facebook.com/share/1FRvQw2rWs/' className='w-12 aspect-square rounded-2xl text-center bg-white transition-all duration-300 ease-in-out hover:bg-[#212121] hover:text-white'
                                style={{fontSize: '1.2rem',
                                        lineHeight: '3.2rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 1px'
                                }}>
                        <i className="bx bxl-facebook" ></i>
                    </a>
                    <a href='https://x.com/LinnHtet97228' className='w-12 aspect-square rounded-2xl text-center bg-white transition-all duration-300 ease-in-out hover:bg-[#212121] hover:text-white'
                                style={{fontSize: '1.2rem',
                                        lineHeight: '3.2rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 1px'
                                }}>
                        <i className="bx bxl-twitter"></i>
                    </a>
                    <a href='https://www.instagram.com/linnhtet003/' className='w-12 aspect-square rounded-2xl text-center bg-white transition-all duration-300 ease-in-out hover:bg-[#212121] hover:text-white'
                                style={{fontSize: '1.2rem',
                                        lineHeight: '3.2rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 1px'
                                }}>
                        <i className="bx bxl-instagram"></i>
                    </a>
                    <a href='mailto:chp35063@gmail.com' className='w-12 aspect-square rounded-2xl text-center bg-white transition-all duration-300 ease-in-out hover:bg-[#212121] hover:text-white'
                                style={{fontSize: '1.2rem',
                                        lineHeight: '3.2rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 1px'
                                }}>
                        <i className="bx bxl-google"></i>
                    </a>
                </div>
            </div>
            <div className='flex-1 list-none flex flex-col gap-3'>
                <p className='footer-name text-2xl font-[500]'>Pages</p>
                <li>
                    <a className='text-[gray] hover:text-black transition-all duration-300 ease-in-out' href='/'>
                        Home
                    </a>
                </li>
                <li>
                    <a className='text-[gray] hover:text-black transition-all duration-300 ease-in-out' href='menu'>
                        Menu
                    </a>
                </li>
                <li>
                    <a className='text-[gray] hover:text-black transition-all duration-300 ease-in-out' href='contact'>
                        Contact Us
                    </a>
                </li>
                <li>
                    <a className='text-[gray] hover:text-black transition-all duration-300 ease-in-out' href='story'>
                        About Us
                    </a>
                </li>
            </div>
            <div className='flex-1 list-none flex flex-col gap-3'>
                <p className='footer-name text-2xl font-[500]'>Contacts</p>
                <li>
                    Yangon, Myanmar
                </li>
                <li>
                    +959 783 696 373
                </li>
                <li>
                    <a className='text-[gray] hover:text-black transition-all duration-300 ease-in-out' href='mailto:chp35063@gmail.com'>cph35063@gmail.com</a>
                </li>
            </div>
        </div>


        <div className='bg-white text-center py-9'>
            All right reserved &copy; Copyright Foodie
        </div>
    </div>
  )
}

export default Footer
