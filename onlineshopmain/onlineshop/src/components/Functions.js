export const AddToFavorite = (productId) => {
    const favorites = localStorage.getItem("foodie-favorites");
    if(favorites){
        const favoritesdata = JSON.parse(favorites);
        favoritesdata.push(productId);
        localStorage.setItem("foodie-favorites",JSON.stringify(favoritesdata));
    }else{
        const array = [productId]
        localStorage.setItem("foodie-favorites", JSON.stringify(array));
    }
}

export const RemoveFavorite = (productId) => {
    const favorite = localStorage.getItem("foodie-favorites")
    const favorites = JSON.parse(favorite)
    const updatedata = favorites.filter(id => id !== productId)
    localStorage.setItem("foodie-favorites", JSON.stringify(updatedata))
}

export const isFavorite = (productId) => {
    const favorite = localStorage.getItem("foodie-favorites");
    if(favorite){
        const favoritesdata = JSON.parse(favorite);
        return favoritesdata.includes(productId);
    }else{
        const array = []
        localStorage.setItem("foodie-favorites", JSON.stringify(array));
    }
}

export const AddToCart = (product, quantity = 1) => {
    const cart = localStorage.getItem("foodie-cart");
    if(cart){
        const CartList = JSON.parse(cart);
        const isexist = CartList.findIndex(pro => pro.id === product.id)
        if(isexist !== -1){
            const existproduct = CartList[isexist];
            const newquantity = existproduct.quantity + quantity;
            if(newquantity > product.stock){
                alert("Not enough stock available")
                return;
            }
            CartList[isexist].quantity = newquantity;
            CartList[isexist].total = newquantity * product.price;
        }else{
            if(quantity > product.stock){
                alert("Not enough stock available")
                return;
            }
            const addproduct = { ...product, quantity, total : quantity * product.price };
            CartList.push(addproduct);
        }
        localStorage.setItem("foodie-cart", JSON.stringify(CartList));
    } else {
        const array = [{...product, quantity, total : quantity * product.price}];
        localStorage.setItem("foodie-cart", JSON.stringify(array));
    }
    window.dispatchEvent(new Event("CartNumber"));
}

export const LoadingState = () => {
    return(
        <div className="load-svg">
            <svg viewBox='25 25 50 50'>
                <circle r='20' cy='50' cx='50'></circle>
            </svg>
        </div>
    )
}