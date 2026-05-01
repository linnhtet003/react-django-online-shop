// import 'boxicons/css/boxicons.min.css';
import React, { useCallback, useEffect, useState } from 'react'
import Cards from '../components/Cards';
import { useNavigate } from 'react-router-dom';

const Favoristelist = () => {
    const navigate = useNavigate();
    const [getFavorites, setGetFavorites] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [fileValue, setFileValue] = useState("");
    const [updateImage, setUpdateImage] = useState({})
    const base_url = "http://127.0.0.1:8000";

    const getFavoritesProducts = () => {
        const favoriteIds = JSON.parse(localStorage.getItem("foodie-favorites")) || [];
        setGetFavorites(favoriteIds);
    }

    const fetchUserDetail = useCallback(() => {
        const bearer = localStorage.getItem('foode-token');
        if (!bearer) {
            navigate('/login');
            return;
        }
        fetch("http://127.0.0.1:8000/api/userdetail/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearer}`
            }
        })
            .then(resp => {
                if (resp.status === 401) {
                    localStorage.removeItem('foode-token');
                    navigate('/login')
                }
                return resp.json();
            })
            .then(data => setUserDetail(data))
            .catch(error => console.log(error))
    },[navigate]);

    const fileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            setUpdateImage({
                picturePreview : URL.createObjectURL(file),
                pictureAsFile : file
            })
            let filename = file.name;
            let filesize = (file.size / 1000).toFixed(2);
            let filedata = `${filename} - ${filesize}KB`;
            setFileValue(filedata);
            setTimeout(() => {
                setShowInput(true);
            }, 300)
        }
    }

    useEffect(() => {
        getFavoritesProducts();
        fetchUserDetail();
    }, [fetchUserDetail])

    useEffect(() => {
        if (getFavorites.length === 0) {
            setFavoriteProducts([]);
            return;
        }
        const fetchFavorites = async () => {
            const bearer = localStorage.getItem('foode-token');
            if (!bearer) {
                navigate('/login');
                return;
            }

            const fetches = getFavorites.map(id =>
                fetch(`http://127.0.0.1:8000/api/productdetail/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearer}`
                    }
                }).then(resp => {
                    if (resp.status === 401) {
                        localStorage.removeItem('foode-token');
                        navigate("/login")
                    }
                    return resp.json();
                })
            );

            try {
                const results = await Promise.all(fetches);
                setFavoriteProducts(results);
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            }
        };
        fetchFavorites();
    }, [getFavorites, navigate])

    const updateProfile = (e) => {
        e.preventDefault();

        const bearer = localStorage.getItem('foode-token');
        const formData = new FormData();
        formData.append("user_profile", updateImage.pictureAsFile);

        fetch("http://127.0.0.1:8000/api/userupdate/", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${bearer}`
            },
            body: formData,
        })
        .then((res) => {
            if(res.status === 200) return res.json();
            if(res.status === 401) {
                localStorage.removeItem('foode-token');
                navigate('/login');
            }
            // throw new Error("Failed to upload");
        })
        .then(() => {
            fetchUserDetail();
            setShowInput(false);
            setFileValue("");
        })
        .catch((error) => console.error(error));
    }


    return (
        <div className='py-20'>
            <div className='w-[90%] m-auto flex flex-col gap-7 justify-center items-center'>
                <img className='userprofile w-[22rem] aspect-square object-cover rounded-full border-gray-400 border-[2px] shadow-xl'
                    src={`${base_url + userDetail.user_profile}`} alt={userDetail.name} />
                <h2 className="text-4xl text-[var(--text-color)] uppercase font-serif font-semibold">
                    {userDetail.name}
                </h2>
            </div>
            <div className='w-full flex justify-center mt-6'>
                <form onSubmit={updateProfile} className={`flex justify-center items-center gap-3 py-1 px-[15px]
                                ${showInput ? 'border-gray-500 border-[1.5px]' : 'border-0'} rounded-2xl transition-all duration-500 ease-in-out`}>
                    <label htmlFor="upload_image" className='bg-[var(--btn-color)] flex justify-center items-center h-full
                                aspect-square rounded-2xl hover:scale-[1.03] hover:shadow-md transition-all duration-200 ease-in-out'>
                        <i className='bx bx-image-add text-3xl text-[var(--bg-color)] aspect-square'></i>
                    </label>
                    <input type='file'
                        onChange={fileChange}
                        className='hidden'
                        id="upload_image" required />
                    <div className={`${showInput ? 'max-w-[400px] opacity-100' : 'max-w-0 opacity-0'}
                                flex items-center gap-0 transition-all duration-500 ease-in-out`}>
                        <input type='text'
                            value={fileValue}
                            id='file_text'
                            className={`bg-transparent h-full focus:outline-none group-focus:inline-block
                                ${showInput ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}`} readOnly placeholder='' />
                        <input type='submit'
                            id='submit-btn'
                            value='Upload'
                            accept='image/*'
                            name='user_profile'
                            className={`cursor-pointer font-medium text-[17px] py-[0.8em] pr-[1.5em] pl-[1.2em]
                        ${showInput ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
                        text-white bg-[#ad5389] border-none tracking-tighter rounded-[1em] bg-[linear-gradient(0deg,rgba(77,54,208,1)0%,rgba(132,116,254,1)100%)]
                        shadow-[0_0.7em_1.5em_-0.5em_#4d36d0be] hover:shadow-[0_0.5em_1.5em_-0.5em_#4d36d0be] active:shadow-[0_0.3em_1em_-0.5em_#4d36d0be]`} />
                    </div>
                </form>
            </div>
            <div className='w-full flex flex-col justify-center items-center mt-16 mb-16'>
                <p className='service-name text-6xl font-medium capitalize text-[var(--text-color)] mt-4'>My Favoriste list</p>
            </div>
            <div className='w-[90%] m-auto'>
                {favoriteProducts.length === 0 ? (
                    <p className='text-center text-xl text-gray-500'>Your favorites list is empty.</p>
                ) : (
                    <div className='w-full flex flex-wrap justify-center gap-12'>
                        {favoriteProducts.map((product, index) => (
                            <Cards key={index} product={product} getFavoritesProducts={getFavoritesProducts} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favoristelist
