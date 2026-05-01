import 'boxicons/css/boxicons.min.css';

const Story = () => {
  return (
    <div>
        <div id='invisible' className='w-[90%] m-auto h-[85rem] mt-24 mb-24'>
            <div className='aboutusbg w-full h-full flex flex-row gap-6'>
                <div className='flex-1 mt-[44%] ml-[12.5%] mb-[9.5%]'>
                    <h1 className='text-[3.7rem] pl-8 pt-4 font-semibold text-[var(--text-color)]'>About Us</h1>
                    <p className='px-4 pt-5 first-letter:ml-[10%]'
                        style={{fontSize: '1.2rem',lineHeight:'2.2rem'}}>
                        At <span className='text-[var(--text-color)] font-semibold'>Foo<span className='text-[var(--btn-color)] font-semibold'>die</span></span>, we believe great food should be easy to access, no matter how busy life gets. That’s why we created a convenient online platform where you can shop for fresh produce, quality groceries, and ready-to-eat meals—all in one place.
                        We partner with trusted local suppliers and top brands to bring you high-quality food products delivered quickly and safely to your door. Whether you're planning dinner, stocking your kitchen, or craving something tasty, we’ve got you covered.
                        Our mission is simple: to make food shopping faster, fresher, and more enjoyable.
                    </p>
                </div>
                <div className='flex-1 mt-[44%] mr-[12.5%] mb-[9.5%]'>
                    <h1 className='text-[3.7rem] pl-8 pt-4 font-semibold text-[var(--text-color)]'>
                        Foo<span className='text-[var(--btn-color)]'>die</span>
                    </h1>
                    <p className='px-4 pt-5 first-letter:ml-[10%]'
                        style={{fontSize: '1.2rem',lineHeight:'2.2rem'}}>Our goal is to make food shopping effortless, reliable, and enjoyable for everyone. We aim to deliver fresh, high-quality products to your doorstep while saving you time and bringing convenience to your daily life.
                    </p>
                    <div className='ml-[2.5%] w-[95%] h-[1.9px] bg-black mt-4'></div>
                    <h2 className='text-center py-4 text-3xl font-semibold text-[var(--text-color)]'>Our Contacts</h2>
                    <div className='w-full flex flex-row gap-2'>
                        <div className='flex-1 pl-4'>
                            <h2 className='ml-[10%] text-lg font-[500]'>Opening Hours</h2>
                            <div className='ml-[10%] w-[55%] h-[1.5px] bg-black'></div>
                            <p className='mt-1 py-2'>Mon - Fri &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 7 AM to 9 PM</p>
                            <p className='mt-1 py-2'>Sat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 7 AM To 11PM</p>
                        </div>
                        <div className='flex-1'>
                            <h2 className='ml-[15%] text-lg font-[500]'>Location</h2>
                            <div className='ml-[15%] w-[32%] h-[1.5px] bg-black'></div>
                            <li className='list-none text-lg py-2'><i className='bx bx-map text-xl'></i> Yangon, Myanmar</li>
                            <li className='list-none text-lg py-2'><i class='bx bx-phone text-xl'></i>  +959 783 696 373</li>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* for tablet */}

        <div className='tablet w-[95%] m-auto h-[45rem] my-12'>
            <div className='aboutusbg w-full h-full flex flex-row gap-0'>
                <div className='flex-1 mt-[45%] ml-[12.5%] mb-[10.5%]'>
                    <h1 className='text-[1.7rem] pl-6 pt-2 font-semibold text-[var(--text-color)]'>About Us</h1>
                    <p className='px-4 pt-2 first-letter:ml-[10%]'
                        style={{fontSize: '0.7rem',lineHeight:'1.25rem'}}>
                        At <span className='text-[var(--text-color)] font-semibold'>Foo<span className='text-[var(--btn-color)] font-semibold'>die</span></span>, we believe great food should be easy to access, no matter how busy life gets. That’s why we created a convenient online platform where you can shop for fresh produce, quality groceries, and ready-to-eat meals—all in one place.
                        We partner with trusted local suppliers and top brands to bring you high-quality food products delivered quickly and safely to your door. Whether you're planning dinner, stocking your kitchen, or craving something tasty, we’ve got you covered.
                    </p>
                </div>
                <div className='flex-1 mt-[45%] mr-[12.5%] mb-[10.5%]'>
                    <h1 className='text-[1.7rem] pl-6 pt-2 font-semibold text-[var(--text-color)]'>
                        Foo<span className='text-[var(--btn-color)]'>die</span>
                    </h1>
                    <p className='px-4 pt-2 first-letter:ml-[10%]'
                        style={{fontSize: '0.7rem',lineHeight:'1.25rem'}}>Our goal is to make food shopping effortless, reliable, and enjoyable for everyone. We aim to deliver fresh, high-quality products to your doorstep while saving you time and bringing convenience to your daily life.
                    </p>
                    <div className='ml-[2.5%] w-[95%] h-[1.9px] bg-black mt-1'></div>
                    <h2 className='text-center py-1 text-[1rem] font-semibold text-[var(--text-color)]'>Our Contacts</h2>
                    <div className='w-full flex flex-row gap-2'>
                        <div className='flex-1 pl-3'>
                            <h2 className='ml-[7%] text-[.8rem] font-[500]'>Opening Hours</h2>
                            <div className='ml-[7%] w-[82%] h-[1.5px] bg-black'></div>
                            <p className='mt-1 text-[.6rem] py-[.4rem]'>Mon - Fri &nbsp;&nbsp; 7 AM to 9 PM</p>
                            <p className='mt-1 text-[.6rem] py-[.4rem]'>Sat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 7 AM To 11PM</p>
                        </div>
                        <div className='flex-1'>
                            <h2 className='ml-[15%] text-[.8rem] font-[500]'>Location</h2>
                            <div className='ml-[15%] w-[48%] h-[1.5px] bg-black'></div>
                            <li className='list-none text-[.6rem] py-[.45rem]'><i className='bx bx-map text-[.8rem]'></i> Yangon, Myanmar</li>
                            <li className='list-none text-[.6rem] py-[.45rem]'><i class='bx bx-phone text-[.8rem]'></i>  +959 783 696 373</li>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Story
