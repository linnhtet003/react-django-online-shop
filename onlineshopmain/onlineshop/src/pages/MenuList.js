import 'boxicons/css/boxicons.min.css';
import Cards from '../components/Cards'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../components/Functions';

const MenuList = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const filterbtn = () => {
    setFilterOpen(!filterOpen);
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const bearer = localStorage.getItem('foode-token');
    if (!bearer) {
      navigate('/login');
      return;
    }

    fetch("http://127.0.0.1:8000/api/productlist/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      }
    })
      .then(resp => {
        if (resp.status === 401) {
          localStorage.removeItem('foode-token');
          navigate("/login")
        }
        return resp.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.log(error))

    fetch("http://127.0.0.1:8000/api/categorylist/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      }
    })
      .then(resp => {
        if (resp.status === 401) {
          localStorage.removeItem('foode-token');
          navigate("/login")
        }
        return resp.json();
      })
      .then(data => setCategories(data))
      .catch(error => console.log(error))
  }, [navigate])

  useEffect(() => {
    const bearer = localStorage.getItem('foode-token');
    if (!bearer) {
      navigate('/login');
      return
    }

    setLoading(true);

    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);

    fetch(`http://127.0.0.1:8000/api/productlist/?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      }
    })
      .then(resp => {
        if (resp.status === 401) {
          localStorage.removeItem('foode-token');
          navigate("/login");
        }
        return resp.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory, navigate])

  const SearchBth = (e) => {
    e.preventDefault();
    const value = e.target.search.value.trim();
    setSearchQuery(value);
    setSelectedCategory("");
  }

  return (
    <div className='w-[90%] m-auto text-center mt-20'>
      <h2 className='subscribeHeader text-[3.2rem] capitalize font-semibold text-[var(--text-color)]'
        style={{ fontFamily: '"beba Neue", sans-serif' }}>
        Our Delicious Menu
      </h2>
      <p className='subscribedescription my-8 m-auto max-w-[950px]'>
        Explore a mouthwatering selection of dishes crafted with fresh ingredients and bold flavors. From appetizers to desserts, we serve meals made to satisfy every craving. Taste the love in every bite.
      </p>
      <div className='w-full h-16 flex items-center justify-center'>
        <form onSubmit={SearchBth}
          className='group w-[65%] mr-8 focus-within:w-[75%] transition-all duration-300 h-14 border-[#c4c4c4] border-[0.02rem] rounded-[5rem] p-1 flex justify-between'>
          <input name='search'
            className='h-full w-full text-black bg-transparent rounded-l-[5rem] border-none text-base pl-4 focus:outline-none'
            type='text' placeholder='Search anything you want' autoComplete='off' />
          <input type='submit'
            className='bg-[var(--btn-color)] text-[var(--text-color)] py-[.55rem] px-6 rounded-[5rem] text-base'
            value='Search' />
        </form>
        <div className='relative'>
          <button onClick={filterbtn} className='text-lg text-[var(--text-color)] py-[.55rem] px-6 border-[#c4c4c4] border-[2px] rounded-[1rem]'>
            filter
            <i className='bx bx-filter ml-3'></i>
          </button>
          <div className={`${filterOpen ? 'top-16 opacity-100' : 'top-8 opacity-0'} absolute left-[50%] transform translate-x-[-50%] border-[#c4c4c4] border-[2px] list-none text-center rounded-lg overflow-hidden transition-all duration-300 ease-in-out z-20`}>
            {categories.map((category, index) => (
              <li key={index}
                onClick={() => { setSelectedCategory(category.name); setSearchQuery(""); setFilterOpen(false);}}
                className='px-7 py-4 cursor-pointer hover:text-[gray] hover:bg-gray-200 transition-all duration-300 ease-in-out'>
                {category.name}
              </li>
            ))}
          </div>
        </div>
      </div>

      <div className='my-36 w-full m-auto'>
        <div className='w-[90%] m-auto'>
          {loading ? (
            <div className='w-full flex justify-center items-center'>
              <LoadingState/>
            </div>
          ) : products.length === 0 ? (
            <p className='text-center text-xl text-gray-500'>Product isn't exit.</p>
          ) : (
            <div className='w-full flex flex-wrap justify-center gap-12'>
              {products.map((product, index) => (
                <Cards key={index} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default MenuList
