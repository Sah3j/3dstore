'use client'
import Image from "next/image";
import Spline from "@splinetool/react-spline";
import { useState, useRef } from 'react'
import ProductsCard from "@/components/ProductsCard";
import Cart from "@/components/Cart";
import {motion, AnimatePresence} from 'framer-motion'
import Lottie from 'lottie-react';
import animationData from '../assets/loadingAnimation.json'

interface TshirtScene {
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

export default function Home() {

  const [loading, setLoading] = useState(true)

  const tshirtScenes = [
    {scene: 'https://draft.spline.design/unXYLAj8NrqiVu4v/scene.splinecode', title:'Outerspace Artwork'},
    {scene: 'https://draft.spline.design/uW6ZNjzZtLhNKoyO/scene.splinecode', title:'Skyline Artwork'},
    {scene: 'https://draft.spline.design/7Lo1t2EiOYTeuvNp/scene.splinecode', title:'Sunset Artwork'},
    {scene: 'https://draft.spline.design/ZZRy9rhJS8Q5fQEs/scene.splinecode', title:'Wolf and Moon Artwork'},
    {scene: 'https://draft.spline.design/XByypU2bOC8OU2jS/scene.splinecode', title:'Snow Mountain Artwork'},
    {scene: 'https://draft.spline.design/Mc6EPsP-DgHGEKmF/scene.splinecode', title:'Astronaut Artwork'}
  ]

  const [selectedShirt, setSelectedShirt] = useState<TshirtScene | undefined>()

  const [showCard, setShowCard] = useState<boolean>(false)

  const [cartContent, setCartContent] = useState<CartContent[]>([])

  function onLoad() {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  function onMouseDown(e: any) {
    if(e.target.name === 'tshirtHover1') {
      setSelectedShirt(tshirtScenes[0])
    }
    else if(e.target.name === 'tshirtHover2') {
      setSelectedShirt(tshirtScenes[1])   
    }
    else if(e.target.name === 'tshirtHover3') {
      setSelectedShirt(tshirtScenes[2])   
    }
    else if(e.target.name === 'tshirtHover4') {
      setSelectedShirt(tshirtScenes[3])   
    }
    else if(e.target.name === 'tshirtHover5') {
      setSelectedShirt(tshirtScenes[4])   
    }
    else if(e.target.name === 'tshirtHover6') {
      setSelectedShirt(tshirtScenes[5])   
    }
    if (e.target.name === 'tshirtHover1' ||
        e.target.name === 'tshirtHover2' ||
        e.target.name === 'tshirtHover3' ||
        e.target.name === 'tshirtHover4' ||
        e.target.name === 'tshirtHover5' ||
        e.target.name === 'tshirtHover6') {
      setShowCard(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <AnimatePresence>
        {loading &&
          <motion.div 
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: {duration: 0.5} }}
            className="fixed top-0 left-0 flex flex-col min-h-screen bg-black w-screen justify-center items-center z-1">
                <div className="w-96">
                  <Lottie animationData={animationData} loop={true}/>
                </div> 
                <p className="text-lg font-bold">LOADING SHOP...</p>
          </motion.div>
        }
      </AnimatePresence>
      <div>
        <Spline scene="https://draft.spline.design/2eiayrEECjlMxdxM/scene.splinecode" 
          onMouseDown={(e) => onMouseDown(e)} onLoad={onLoad}/>
      </div>
      {!loading && 
        <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{}} className="fixed top-8 right-8 z-0">
          <Cart cartContent={cartContent} setCartContent={setCartContent}/>
        </motion.div>
      }
      <AnimatePresence>
        {showCard && 
          <motion.div 
            exit={{opacity: 0, transition: {duration: 0.2}}}>
            <ProductsCard selectedShirt={selectedShirt} setShowCard={setShowCard} cartContent={cartContent} setCartContent={setCartContent}/>
          </motion.div>
        }
      </AnimatePresence>
    </main>
  );
}
