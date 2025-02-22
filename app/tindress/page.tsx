"use client"
import React, { useState, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { X, Heart } from 'lucide-react'
import stub from "@/app/stub.jpg"
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import Navbar from '@/components/components/navbar'

const page = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    // Sample data array - replace with your actual data
    const [cards, setCards] = useState<{id: any, url: any}[]>([])
    const [isLiked, setIsLiked] = useState(false)
    const [isHated, setIsHated] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const cardRefs = useRef<any>(cards.map(() => null))

    const supabase = createClient()

    useEffect(() => {
        const fetchTindressData = async () => {
            const { data, error } = await supabase
                .from('tindress')
                .select('id, url')
            
            if (error) {
                console.error('Error fetching tindress data:', error)
                return
            }

            if (data) {
                setCards(data)
            }
        }

        fetchTindressData()
    }, []) 

    const onSwipeRight = async () => {
        setIsLiked(true)
        const user = await supabase.auth.getUser()
        const id = user?.data?.user?.id
        const { data, error } = await supabase.from('products').select("liked_urls").eq('user_id', id)
        if (error) {
            console.error(error)
            return
        }
        console.log(data)
        if (data.length === 0) {
            const { error: err } = await supabase.from('products').insert({ user_id: id, liked_urls: [cards[currentIndex].url] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        if (!data[0].liked_urls) {
            const { error: err } = await supabase.from('products').update({ liked_urls: [cards[currentIndex].url] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        const { error: err } = await supabase.from('products').update({ liked_urls: [...(data[0].liked_urls), cards[currentIndex].url] }).eq('user_id', id)
        if (err) {
            console.error(err)
            return
        }
        setIsLiked(false)

    }

    const onSwipeLeft = async () => {
        setIsHated(true)
        const user = await supabase.auth.getUser()
        const id = user?.data?.user?.id
        const { data, error } = await supabase.from('products').select("disliked_urls").eq('user_id', id)
        if (error) {
            console.error(error)
            return
        }
        if (data.length === 0) {
            const { error: err } = await supabase.from('products').insert({ user_id: id, disliked_urls: [cards[currentIndex].url] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        if (!data[0].disliked_urls) {
            const { error: err } = await supabase.from('products').update({ user_id: id, disliked_urls: [cards[currentIndex].url] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        const { error: err } = await supabase.from('products').update({ disliked_urls: [...(data[0].disliked_urls), cards[currentIndex].url] }).eq('user_id', id)
        if (err) {
            console.error(err)
            return
        }
        setIsHated(false)
    }

    // const onSwipe = (direction: string) => {
    //     if (direction === 'right') {
    //         onSwipeRight()
    //     } else if (direction === 'left') {
    //         onSwipeLeft()
    //     }
    // }

    const onSwipe = (direction: string) => {
        console.log(direction);
        setCurrentIndex(prevIndex => prevIndex + 1)
        if (direction === 'right') {
            onSwipeRight()
        } else if (direction === 'left') {
            onSwipeLeft()
        }
    }

    const onCardLeftScreen = (myIdentifier: any) => {
        console.log(myIdentifier + ' left the screen')
    }

    const swipe = (dir: string) => {
        if (cardRefs.current[currentIndex]) {
            cardRefs.current[currentIndex].swipe(dir)
        }
    }

    return (
        <>
            <Navbar />
            {cards.length != 0 ? (
                <main className='flex flex-col items-center justify-center gap-y-16 pt-8'>
                <div className={`relative w-[400px] h-[400px] mb-40 ${currentIndex >= cards.length && "hidden"}`}>
                    {cards.map((card, index) => (
                        index >= currentIndex && (
                            <div 
                                key={card.id} 
                                className="absolute"
                                style={{
                                    transform: `scale(${1 - (index - currentIndex) * 0.05}) translateY(${(index - currentIndex) * -10}px)`,
                                    zIndex: cards.length - index,
                                    opacity: Math.max(1 - (index - currentIndex) * 0.2, 0.7)
                                }}
                            >
                                <TinderCard
                                    ref={element => cardRefs.current[index] = element}
                                    onSwipe={onSwipe}
                                    onCardLeftScreen={() => onCardLeftScreen(card.id)}
                                    preventSwipe={['up', 'down']}
                                    className={`${index === currentIndex ? '' : 'pointer-events-none'}`}
                                >
                                    <Image
                                        src={card.url}
                                        alt={`Card ${card.id}`}
                                        width={450}
                                        height={450}
                                        className='w-[400px] h-[600px] object-cover'
                                        style={{ userSelect: 'none' }}
                                        draggable={false}
                                        placeholder='blur'
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEkKzI2LywxMzYwNTY0MDY2NTA0Nz9AQDBHTU9NUF1wXXFlSkVKZWj/2wBDARUXFyAeIBogHB4iGiAaICgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                    />
                                </TinderCard>
                            </div>
                        )
                    ))}
                </div>
                {currentIndex >= cards.length && (
                        <div className='relative flex text-center h-[600px] justify-center items-center'>
                            <p>There are no more clothes</p>
                        </div>
                )}
                <div className='flex flex-row justify-between w-[450px] px-16 relative z-50'>
                    <button
                        onClick={() => swipe('left')}
                        className={`size-24 rounded-full border flex items-center justify-center ${isHated ? 'bg-red-300' : 'hover:bg-red-300'}`}
                    >
                        <X className='size-8'></X>
                    </button>
                    <button
                        onClick={() => swipe('right')}
                        className={`size-24 rounded-full border flex items-center justify-center ${isLiked ? 'bg-green-300' : 'hover:bg-green-300'}`}
                    >
                        <Heart className='size-8'></Heart>
                    </button>
                </div>
            </main>
            ) : (<div>Loading...</div>)}
        </>
        
    )
}

export default page