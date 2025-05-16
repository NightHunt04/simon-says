import { useEffect, useState } from "react"
import { RotateCcw, ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"

export default function Game() {
    const navigate = useNavigate()
    const [activeButton, setActiveButton] = useState<Record<string, boolean>>({})
    const sequence = useRef<number[]>([])
    const [stateSequence, setStateSequence] = useState<number[]>([])
    const tracker = useRef(0)
    const [isUserTurn, setIsUserTurn] = useState<boolean>(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [mute, setMute] = useState<boolean>(false)

    function playTone(frequency: number, duration = 200) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
      
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
      
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
      
        const now = audioCtx.currentTime
        const fadeTime = 0.02
      
        gainNode.gain.setValueAtTime(1, now)
        gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000 - fadeTime)
        oscillator.start(now)
        oscillator.stop(now + duration / 1000)
        oscillator.onended = () => audioCtx.close() 
    }
      

    const handleButtonClick = (color: string, isUserInput?: boolean) => {
        setActiveButton(prev => ({ ...prev, [color]: true }))
        setTimeout(() => {
            setActiveButton(prev => ({ ...prev, [color]: false }))
        }, 150)

        const colorNum = color === 'red' ? 0 : color === 'green' ? 1 : color === 'yellow' ? 2 : 3

        if (!mute) playTone(colorNum === 0 ? 392 : colorNum === 1 ? 440 : colorNum === 2 ? 523 : 659)
        if (isUserInput) checkUserInput(colorNum)
    }

    const generateRandomColor = () => {
        const randomNum = Math.floor(Math.random() * 4)
        sequence.current = [...sequence.current, randomNum]
        setStateSequence([...sequence.current])
    }

    const checkUserInput = (colorNum: number) => {
        if (sequence.current[tracker.current] === colorNum) {
            tracker.current++

            if (localStorage.getItem('highestScore') === null) {
                localStorage.setItem('highestScore', sequence.current.length.toString())
            } else {
                if (sequence.current.length > parseInt(localStorage.getItem('highestScore')!))
                    localStorage.setItem('highestScore', sequence.current.length.toString())
            }

            if (tracker.current === sequence.current.length) {
                setIsUserTurn(false)
                setTimeout(() => {
                    generateRandomColor()
                    tracker.current = 0
                }, 1000)
            }
        } else {
            setGameOver(true)
            setIsUserTurn(false)
            console.log('error')
        }
    }

    const handleResetGame = () => {
        setGameOver(false)

        setTimeout(() => {
            tracker.current = 0
            sequence.current = []
            setStateSequence([])
            generateRandomColor()
            setIsUserTurn(true)
        }, 1000)
    }

    useEffect(() => {
        setTimeout(() => {
            generateRandomColor()
            setIsUserTurn(true)
        }, 1000)
    }, [])

    useEffect(() => {
        for (let i = 0; i < sequence.current.length; i++) {
            setTimeout(() => {
                handleButtonClick(
                    sequence.current[i] === 0 ? 'red' : 
                    sequence.current[i] === 1 ? 'green' : 
                    sequence.current[i] === 2 ? 'yellow' : 
                    'blue', false
                )
                if (i === sequence.current.length - 1) {
                    setTimeout(() => setIsUserTurn(true), 500)
                }
            }, i * 450)
        }
    }, [stateSequence])

    return (
        <motion.div
            initial = {{
                opacity: 0,
            }} 
            animate = {{
                opacity: 1,
            }}
            transition = {{
                duration: 0.65,
                ease: 'easeInOut',
                delay: 0.15
            }}
            className="w-full h-full flex flex-col items-center justify-start gap-7 mt-20 md:mt-28">
            <div className="w-[90%] flex items-start justify-start gap-2"></div>

            <div className="w-80 flex items-center justify-between gap-2">
                <button
                    className="rounded-full flex items-center justify-center hover:text-primary hover:cursor-pointer hover:scale-110 transition-all drop-shadow-md"
                    onClick={() => navigate('/')}>
                    <ArrowBigLeftDash className="w-10 h-10" />
                </button>
                
                <div className="flex items-center justify-center gap-5">
                    {mute ? 
                        <button
                            className="rounded-full flex items-center justify-center border border-primary hover:bg-white hover:text-primary hover:cursor-pointer hover:scale-110 transition-all p-2 drop-shadow-md"
                            onClick={() => setMute(false)}>
                            <VolumeX strokeWidth={3} className="w-6 h-6" />
                        </button> : 
                        <button
                            className="rounded-full flex items-center justify-center border border-primary hover:bg-white hover:text-primary hover:cursor-pointer hover:scale-110 transition-all p-2 drop-shadow-md"
                            onClick={() => setMute(true)}>
                            <Volume2 strokeWidth={3} className="w-6 h-6" />
                        </button>}
                    <p className="text-2xl font-semibold">Score: {stateSequence.length - 1}</p>
                </div>
            </div>

            <div className="w-80 flex flex-col items-center justify-center gap-2">
                <div className="w-full flex items-center justify-center gap-2">
                    <button disabled={!isUserTurn} onClick={() => handleButtonClick('red', true)} className={`hover:cursor-pointer w-full h-40 rounded-xl ${activeButton.red ? 'bg-red-400' : 'bg-red-500/70'}`}></button>
                    <button disabled={!isUserTurn} onClick={() => handleButtonClick('green', true)} className={`hover:cursor-pointer w-full h-40 rounded-xl ${activeButton.green ? 'bg-green-400' : 'bg-green-500/70'}`}></button>      
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                    <button disabled={!isUserTurn} onClick={() => handleButtonClick('yellow', true)} className={`hover:cursor-pointer w-full h-40 rounded-xl ${activeButton.yellow ? 'bg-yellow-400' : 'bg-yellow-500/70'}`}></button>
                    <button disabled={!isUserTurn} onClick={() => handleButtonClick('blue', true)} className={`hover:cursor-pointer w-full h-40 rounded-xl ${activeButton.blue ? 'bg-blue-400' : 'bg-blue-500/70'}`}></button>
                </div>
            </div>

            {gameOver && <div className="w-[90%] flex flex-col items-center justify-center gap-2">
                <p className="text-center text-xl font-semibold">Game over</p>
                <button 
                    onClick={handleResetGame} 
                    className="bg-primary hover:bg-white hover:text-primary hover:scale-110 transition-all p-3 drop-shadow-md rounded-full hover:cursor-pointer z-20">
                    <RotateCcw strokeWidth={3} className="w-6 h-6" />
                </button>
            </div>}
        </motion.div>
    )
}