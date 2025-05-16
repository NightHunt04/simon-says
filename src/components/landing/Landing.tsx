import { Play } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { useState, useEffect } from "react"

export default function Landing() {
    const navigate = useNavigate()
    const [highestScore, setHighestScore] = useState<number>(0)

    useEffect(() => {
        if (localStorage.getItem('highestScore') !== null) {
            setHighestScore(parseInt(localStorage.getItem('highestScore')!))
        }
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-20 gap-7 mt-32">
            <motion.div
                initial = {{
                    opacity: 0,
                    filter: "blur(10px)"
                }} 
                animate = {{
                    opacity: 1,
                    filter: "blur(0px)"
                }}
                transition = {{
                    duration: 0.65,
                    ease: 'easeInOut',
                    delay: 0.15
                }}
                className="w-[90%] flex flex-col items-center justify-center">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-center w-full">Simon<span className="text-primary">Says</span></h1>
                <p className="text-sm lg:text-md mt-1 text-center w-full text-neutral-300">How long a sequence can you remember?</p>
            </motion.div>

            <motion.div
                initial = {{
                    filter: "blur(15px)",
                    opacity: 0,
                }} 
                animate = {{
                    filter: "blur(0px)",
                    opacity: 1,
                }}
                transition = {{
                    duration: 0.65,
                    ease: 'easeInOut',
                    delay: 0.15
                }}
                className="w-[90%] flex flex-col items-center z-0 justify-center gap-2 relative">
                <button onClick={() => navigate('/game')} className="bg-primary hover:bg-white hover:text-primary hover:scale-110 transition-all p-3 drop-shadow-md rounded-full absolute hover:cursor-pointer z-20">
                    <Play className="w-10 h-10" />
                </button>

                <div className="w-full flex items-center justify-center gap-2">
                    <div className="w-32 h-32 rounded-xl bg-red-600/70">
                    </div>
                    <div className="w-32 h-32 rounded-xl bg-green-600/70">
                    </div>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                    <div className="w-32 h-32 rounded-xl bg-yellow-600/70">
                    </div>
                    <div className="w-32 h-32 rounded-xl bg-blue-600/70">
                    </div>
                </div>
            </motion.div>

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
                className="w-[90%] flex items-center justify-center gap-2">
                <p className="text-sm lg:text-lg font-semibold mt-1 text-center w-full">Highest Score: {highestScore}</p>
            </motion.div>
        </div>
    )
}
