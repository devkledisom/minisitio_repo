import { useEffect, useState, useRef } from "react"
import { ArrowRight } from "lucide-react"

export default function LoadingPage(props) {
    const [progress, setProgress] = useState(props.setProgress || 0);
    const [apiReady, setApiReady] = useState(props.apiReady || false);


    useEffect(() => {
        if (apiReady) return;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(progressInterval);
    }, [apiReady]);

    useEffect(() => {
        document.querySelector('.my-loading-page').focus()
    }, [])

    const minhaDivRef = useRef(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Flying mascot GIF */}
            <div className="mb-8">
                <img
                    src="/assets/img/Job hunt-cuate.svg"
                    alt="Mascote voando com jetpack"
                    width={800}
                    height={200}
                    className="drop-shadow-xl"
                />
            </div>

            {/* Progress section */}
            <div className="w-72 space-y-4 my-loading-page"
                ref={minhaDivRef}
                tabIndex="-1"
                style={{ outline: 'none' }}>
                {/* Progress bar */}
                <div className="h-3 bg-[#4f4f4f]/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#4f4f4f] rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Progress percentage */}
                <div className="text-center">
                    <span className="text-[#4f4f4f] text-sm font-bold">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* Message */}
            <div className="mt-6 text-center">
                <p className="text-[#4f4f4f] text-lg font-semibold flex items-center justify-center gap-2">
                    Levando você ao perfil selecionado
                    <ArrowRight className="w-5 h-5 animate-arrow-move" />
                </p>
            </div>

            {/* Animations */}
            <style>
                {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes arrow-move {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(8px);
            }
          }

          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }

          .animate-arrow-move {
            animation: arrow-move 1s ease-in-out infinite;
          }
        `}
            </style>
        </div>
    )
}
