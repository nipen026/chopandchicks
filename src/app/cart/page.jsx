import Checkout from "../../Components/Checkout";
import PaymentMethod from "../../Components/PaymentMethod";
import Image from "next/image";

const Cart = () => {
    return (
        <>
        <Checkout/>
            {/* <div className="flex flex-col justify-center items-center justify-center h-[calc(100vh-200px)] animate-fadeIn">
                <Image
                    src="/assets/empty-cart.png"
                    width={300}
                    height={300}
                    alt="Empty Cart"
                />
                <p className="text-[#82131B] text-2xl text-center mt-3 font-medium">Start Filling Your Cart with <br/> Premium Fresh Meat.</p>
            </div> */}
        </>
    )
}
export default Cart;