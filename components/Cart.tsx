import React, {FC, useEffect, useState, useRef, MutableRefObject} from 'react'
import { ShoppingBasket, X, Smile } from 'lucide-react';
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion"
import Lottie from 'lottie-react';
import animationData from '../assets/checkAnimation.json'

interface CartContent {
  scene: string | undefined,
  title: string | undefined,
  color: string,
  colorNo: number,
  size: string,
}

interface ProductsCardProps {
  cartContent: CartContent[]
  setCartContent: React.Dispatch<React.SetStateAction<CartContent[]>>,
}

const Cart:FC<ProductsCardProps> = ({cartContent, setCartContent}) => {

  const spline: MutableRefObject<any> = useRef();

  const [orderCompleted, setOrderCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  function onLoad(index: number, splineApp: any) {
    spline.current = splineApp;

    setTimeout(() => {
      if(spline.current){
        spline.current.setVariable('Color', cartContent[index].colorNo)
      }
    }, 100)
  }

  function updateCanvasStyles() {
    const divElements = document.querySelectorAll(".myComponentId");
    divElements.forEach((divElement) => {
      const canvasElement = divElement.querySelector("canvas");
      if (canvasElement) {
        canvasElement.style.width = "74.6px";
        canvasElement.style.height = "80.4px";
      }
    });
  }
 
  function removeFromCart (index: number) {
    const updatedCart = [...cartContent];
    updatedCart.splice(index, 1);
    setCartContent(updatedCart);

    setTimeout(() => {
      updateCanvasStyles();
    }, 100);
  }

  function handleCheckout() {
    setLoading(true)
    setTimeout(() => {
      setCartContent([]);
      setLoading(false)

      setOrderCompleted(true)
      setTimeout(() => {
        setOrderCompleted(false)
      }, 10000)
    }, 2000)   
  }

  return (
    <div className='w-80 bg-neutral-50/90 p-4 rounded-lg transition-all duration-500'>
      <div className='flex justify-between text-neutral-950 font-semibold text-lg'>
        <div className='flex items-center gap-2'>
          <ShoppingBasket size={24}/>
          <h3 className=''>Cart</h3>
        </div>
        <div className=''>
          {cartContent.length}
        </div>
      </div>
      <div className='max-h-96 overflow-y-auto no-scrollbar'>
        {cartContent?.map((item, index) => (
          <motion.div 
          initial={{ opacity: 0,  scale: 0.5}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.5,
          }} key={index} className='border-b hover:bg-neutral-200 rounded-xl pr-2 relative'>
            <button onClick={() => removeFromCart(index)}
              className='text-neutral-400 hover:text-red-800 text-xs absolute top-1 right-1'>
              <X size={16}/>
            </button>
            <div className='flex'>
              <div className=''>
                <Spline scene={item.scene || ''} 
                  onLoad={(splineApp: any) => onLoad(index, splineApp)}
                  className='myComponentId'/>
              </div>
              <div className='w-full flex flex-col justify-between py-4'>
                <div className='text-neutral-950 flex justify-between'>
                  <h5>{item.title}</h5>
                </div>
                <div className='text-neutral-950 flex items-center justify-between gap-2 text-sm'>
                  <div className='flex gap-2 items-center'>
                    <div style={{ backgroundColor: `${item.color}`}} className='w-4 h-4 rounded-full ring ring-neutral-400'/>
                    <div>{item.size}</div>
                  </div>
                  <p>$0.00</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {orderCompleted && 
          <motion.div 
            initial={{ opacity: 0,  scale: 0.5}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
            }}
            className='flex flex-col gap-2 justify-center items-center text-lg font-bold text-neutral-950 py-6'>
            <Smile />
            <p>Order Confirmed</p>
          </motion.div>
        }
      </div>
      {cartContent.length != 0 && 
        <div className='flex flex-col gap-2 mt-2'>
          <div className='flex justify-between px-2 text-neutral-950'>
            <p>Total:</p>
            <p>0.00</p>
          </div>
          <div className='px-2'>
            <button onClick={handleCheckout} disabled={loading}
              className='rounded-lg w-full h-10 flex items-center justify-center bg-neutral-950 text-neutral-50 text-base font-normal hover:bg-neutral-800 drop-shadow-md disabeled'>
              {!loading ? (
                <p>Checkout</p>
              ) : (
                <div className='w-8 h-8 fill-current text-white'>
                  <Lottie animationData={animationData} loop={false} style={{color: 'white', fill: 'currentColor'}}/>
                </div>
              )}
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default Cart