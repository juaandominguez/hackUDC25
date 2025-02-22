"use client"
import React, { useState, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { X, Heart } from 'lucide-react'
import stub from "@/app/stub.jpg"
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

const page = () => {
    const [isLiked, setIsLiked] = useState(false)
    const [isHated, setIsHated] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const cardRef = useRef<any>(null)
    const supabase = createClient()

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
            const { error: err } = await supabase.from('products').insert({ user_id: id, liked_urls: ["URL1"] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        if (!data[0].liked_urls) {
            const { error: err } = await supabase.from('products').update({ liked_urls: ["URL1"] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        const { error: err } = await supabase.from('products').update({ liked_urls: [...(data[0].liked_urls), "URL1"] }).eq('user_id', id)
        if (err) {
            console.error(err)
            return
        }

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
            const { error: err } = await supabase.from('products').insert({ user_id: id, disliked_urls: ["URL1"] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        if (!data[0].disliked_urls) {
            const { error: err } = await supabase.from('products').update({ user_id: id, disliked_urls: ["URL1"] }).eq('user_id', id)
            if (err) {
                console.error(err)
                return
            }
            return
        }
        const { error: err } = await supabase.from('products').update({ disliked_urls: [...(data[0].disliked_urls), "URL2"] }).eq('user_id', id)
        if (err) {
            console.error(err)
            return
        }
    }

    const onSwipe = (direction: string) => {
        if (direction === 'right') {
            onSwipeRight()
        } else if (direction === 'left') {
            onSwipeLeft()
        }
    }

    const onSwipeRequirementFulfilled = (direction: string) => {
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
        if (cardRef.current) {
            cardRef.current.swipe(dir)
        }
    }

    return (
        <main className='h-80 gap-y-4 flex flex-col'>
            <TinderCard
                ref={cardRef}
                onSwipe={onSwipe}
                onSwipeRequirementFulfilled={onSwipeRequirementFulfilled}
                onCardLeftScreen={() => onCardLeftScreen('fooBar')}
                preventSwipe={['up', 'down']}
                swipeRequirementType='position'
                swipeThreshold={500}
                className={`${isHidden ? 'hidden' : 'block'}`}
            >
                <Image
                    src={stub}
                    alt='stub'
                    width={450}
                    height={450}
                    className='border border-black'
                    style={{ userSelect: 'none' }}
                    draggable={false}
                />
            </TinderCard>
            <div className='flex flex-row justify-between w-[450px] px-16'>
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
        </main >
    )
}

export default page