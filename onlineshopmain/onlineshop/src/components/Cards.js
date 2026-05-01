import { useEffect, useState } from 'react'
import { AddToCart, AddToFavorite,  isFavorite,  RemoveFavorite } from './Functions';

const Cards = (props) => {
  const base_url = "http://127.0.0.1:8000";
  const { product, getFavoritesProducts = () => {} } = props; // for no crash
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(isFavorite(product.id))
  },[product.id])

  const FavoriteClick = (e) => {
    e.preventDefault();
    const onfavoirte = isFavorite(product.id)
    if(onfavoirte){
      RemoveFavorite(product.id)
      setChecked(false)
      getFavoritesProducts();
    }else{
      AddToFavorite(product.id)
      setChecked(true)
    }
  }

  return (
    <div>

        <div className='relative max-w-[350px] mb-12 self-center'>
          <div className='absolute top-[12%] right-4 z-20'>
            <label className='favorite block relative cursor-pointer text-[20px] duration-100' >
              <input className='absolute opacity-0 cursor-pointer h-0 w-0' type="checkbox" />
              <div className={`${checked ? 'liked' : 'checkmark'} top-0 left-0 h-[1.7em] w-[1.7em] duration-100`} onClick={FavoriteClick}>
                <svg viewBox="0 0 256 256">
                <rect fill="none" height="256" width="256"></rect>
                <path style={{stroke:'#ff5353c4'}} d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path></svg>
              </div>
            </label>
          </div>
          <div className='bg-[#fcf0d9] w-[56%] h-[58px] flex justify-between items-center gap-5 p-2 rounded-tl-[28px] rounded-tr-[28px]'>
            <img className='w-[50%] aspect-square' src='/images/main-logo.png' alt='main-logo' />
            <p className=' text-[#3e3e3e] font-[500] mr-2 z-10'>Foo<span className='text-[var(--btn-color)]'>die</span></p>
          </div>
          <div className='bg-[#fcf0d9] absolute top-0 right-0 text-[#3e3e3e] w-[7.7rem] h-12 font-[500] text-base rounded-[28px] flex justify-center items-center'>
            {product.popular_or_new_data.name}
          </div>
          <div className='bg-transparent absolute top-0 right-0 w-[44%] h-[58px] rounded-bl-[28px]' style={{boxShadow: '-30px 30px 0 #fcf0d9'}}></div>
          <div className='group bg-[#fcf0d9] w-full h-[360px] flex justify-center items-center rounded-tr-[28px]'>
            <img className='w-[90%] object-cover group-hover:scale-105 group-hover:drop-shadow-2xl transition-all duration-300 ease-in-out'
              src={`${base_url + product.p_image}`} alt={product.name} />
          </div>
          <div className='bg-[#fcf0d9] p-7 text-center'>
            <h1 className='text-2xl font-semibold text-[#3e3e3e]'>{product.name}</h1>
            <p className='text mt-2 text-[gray] line-clamp-2'>{product.description}</p>
          </div>
          <div className='bg-[#fcf0d9] flex justify-between px-7 pt-0 pb-7 rounded-bl-[28px] rounded-br-[28px]'
              style={{boxShadow: `0 10px 0 ${product.popular_or_new_data.color}`}}>
            <button onClick={() => {AddToCart(product)}} className='shake-btn bg-[var(--btn-color)] font-medium text-[var(--text-color)] py-[.55rem] px-4 rounded-[2rem] text-sm shadow-md hover:scale-110 transition-all duration-300 ease-in-out'>
              <span className='mr-1'>🛒</span>
              Add To Cart
            </button>
          </div>
          <div className='absolute bottom-7 -right-2 w-24 text-green-700 font-semibold rounded-sm bg-[#32d9efdd] py-[.45rem] px-6 shadow-lg'>
            ${product.price}
          </div>
        </div>

    </div>
  )
}

export default Cards