import React, {useRef, MutableRefObject, useState, FC, useEffect, Suspense} from 'react'
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion"
import Lottie from 'lottie-react';
import animationData from '../assets/checkAnimation.json'



interface TshirtProps {
  scene: string,
  title: string,
}


interface CartContent {
  scene: string | undefined,
  title: string | undefined,
  color: string,
  colorNo: number,
  size: string,
}

interface ProductsCardProps {
  selectedShirt: TshirtProps | undefined,
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>,
  cartContent: CartContent[]
  setCartContent: React.Dispatch<React.SetStateAction<CartContent[]>>,
}

const ProductsCard:FC<ProductsCardProps> = ({ selectedShirt, setShowCard, setCartContent, cartContent }) => {

  const cardRef = useRef<any>(null)

  useEffect(() => {
    const handleOutSideClick = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target)) {
        setShowCard(false)
        console.log("outside click")
      }
    }

    window.addEventListener("pointerdown", handleOutSideClick);
    return () => {
      window.removeEventListener("pointerdown", handleOutSideClick);
    };
  }, [cardRef, setShowCard])

  const spline: MutableRefObject<any> = useRef();

  const colors = ['#592121', '#174A34', '#212A71', '#FFFFFF', '#0F0F0F', '#727272']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const [front, setFront] = useState(true)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [colorNumber, setColorNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [colorError, setColorError] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  function onLoad(splineApp: any) {
    spline.current = splineApp;
  }

  function setColor(color: number){
    if(spline.current){
      spline.current.setVariable('Color', color)
    }
    setColorNumber(color)
  }

  function setOrientation(orienration: number){
    orienration === 0 ? setFront(true) : setFront(false)
    if(spline.current){
      spline.current.setVariable('orientation', orienration)
    }
  }

  function handleSizeSelect(size: string) {
    setSelectedSize(size)
  }

  function handleColorSelect(color: string, index: number) {
    setSelectedColor(color)
    setColor(index)
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

  function handleAddToCart() {
    if(!selectedSize || !selectedColor){
      !selectedSize ? setSizeError(true) : setSizeError(false)
      !selectedColor ? setColorError(true) : setColorError(false)
      return
    } else {
      setSizeError(false)
      setColorError(false)
    }

    setLoading(true)

    const item = {
      scene: selectedShirt?.scene,
      title: selectedShirt?.title,
      color: selectedColor,
      colorNo: colorNumber,
      size: selectedSize,
    }

    const newCartContent = [...cartContent, item]

    setCartContent(newCartContent)
    setTimeout(() => {
      updateCanvasStyles();
    }, 100);

    setTimeout(() => {
      setShowCard(false)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="fixed top-0 left-0 min-h-screen w-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0,  scale: 0.5}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
       ref={cardRef} className='flex'>
        <div className='flex flex-col items-center justify-between p-12 bg-white/75 backdrop-blur rounded-l-xl'>
          <Spline scene={selectedShirt ? selectedShirt.scene : 'https://draft.spline.design/i-fYPbTzfmsRJSuO/scene.splinecode'}
            onLoad={onLoad}/>
          <div className='flex justify-center gap-1 py-1 px-2 w-36 bg-neutral-100/80 backdrop-blur rounded-full text-black'>
            <button onClick={() => setOrientation(0)}
              className={`transition-all duration-500 ${front ? 'bg-neutral-950 text-white font-semibold' : 'hover:bg-neutral-200'} w-16 rounded-full font-semibold`}>
              Front
            </button>
            <button onClick={() => setOrientation(1)}
              className={`transition-all duration-500 ${!front ? 'bg-neutral-950 text-white font-semibold' : 'hover:bg-neutral-200'} w-16 rounded-full font-semibold`}>
              Back
            </button>
          </div>
        </div>
        <div className='relative flex flex-col justify-between bg-neutral-100 rounded-r-xl p-8'>
          <div onClick={() => setShowCard(false)}
            className='transition-all duration-500 absolute top-3 right-4 text-neutral-300 hover:text-neutral-950 cursor-pointer'>
            close
          </div>
          <div className='text-3xl font-bold text-black'>
            <h1>{selectedShirt?.title}</h1>
            <h2 className='mt-2'>$0.00</h2>
            <div className='text-sm font-normal text-neutral-950 mt-6'>
              <div className='flex gap-4'>
                <h2 className='mb-2'>Color</h2>
                {colorError && <p className='text-sm font-normal text-red-800'>Select a Color</p>}
              </div>
              <div className='flex gap-2'>
                {colors.map((color, index) => (
                  <div key={index}>
                    <button onClick={() => handleColorSelect(color, index)} 
                    style={{ backgroundColor: `${color}` }} disabled={loading}
                    className={`transition-all duration-500 ${color === selectedColor ? 'ring-neutral-950 opacity-100 ring-2' : 'ring-neutral-400 opacity-80 ring-1 hover:ring-2 hover:opacity-90'} w-6 h-6 ring-offset-1 rounded-full`}/>
                  </div>
                ))}
              </div>
            </div>
            <div className='mt-4'>
              <div className='flex gap-4'>
                <h2 className='text-sm font-normal text-neutral-950'>Size</h2>
                {sizeError && <p className='text-sm font-normal text-red-800'>Select a Size</p>}
              </div>
              <div className='text-sm font-medium inline-flex gap-1 px-1 py-1  rounded'>
                {sizes.map((size, index) => (
                  <button key={index} onClick={() => handleSizeSelect(size)} disabled={loading}
                    className={`transition-all duration-500 ${size === selectedSize ? 'text-neutral-50 bg-neutral-950' : 'hover:bg-neutral-300 text-neutral-950'} self-start rounded border border-neutral-400 flex justify-center w-7 h-7 items-center cursor-pointer`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAddToCart} disabled={loading}
              className='rounded-lg mt-6 w-32 h-10 flex items-center justify-center bg-neutral-950 text-neutral-50 text-base font-normal hover:bg-neutral-800 drop-shadow-md disabeled'>
              {!loading ? (
                <p>Add to Cart</p>
              ) : (
                <div className='w-8 h-8 fill-current text-white'>
                  <Lottie animationData={animationData} loop={false} style={{color: 'white', fill: 'currentColor'}}/>
                </div>
              )}
            </button>
          </div>
          <div className='text-sm font-normal text-neutral-950'>
              <h4 className='font-semibold mb-2'>Product details:</h4>
              <ul>
                <li>Fabric Composition: 80% cotton/20% polyester blend.</li>
                <li>Features: Printed design.</li>
                <li>Care Instructions: Machine washable.</li>
                <li>Origin Details: Made in Spline.</li>
              </ul>
            </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductsCard