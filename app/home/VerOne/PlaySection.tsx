"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface PortoItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

interface GameCard extends PortoItem {
    boardIndex: number;
}

const PortoData: PortoItem[] = [
    {
        id: 1,
        title: "Porto 1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        image: "https://source.unsplash.com/random/300x200/?1"
    },
    {
        id: 2,
        title: "Porto 2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        image: "https://source.unsplash.com/random/300x200/?2"
    },
    {
        id: 3,
        title: "Porto 3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        image: "https://source.unsplash.com/random/300x200/?3"
    },
    {
        id: 4,
        title: "Porto 4",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        image: "https://source.unsplash.com/random/300x200/?4"
    }
];

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function createBoard(): GameCard[] {
    return shuffle([...PortoData, ...PortoData]).map((item, i) => ({
        ...item,
        boardIndex: i,
    }));
}

const CardPlay = ({ card, isFlipped, isMatched }: {
    card: GameCard;
    isFlipped: boolean;
    isMatched: boolean;
}) => {
    const showFront = isFlipped || isMatched;
    return (
        <div style={{ perspective: '800px' }} className="w-30 h-50">
            <div
                className="relative w-full h-full transition-transform duration-500"
                style={{ transformStyle: 'preserve-3d', transform: showFront ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Back */}
                <div className="absolute inset-0 bg-zinc-800 rounded-2xl flex items-center justify-center backface-hidden">
                    <Icon icon="mdi:help-circle" className="text-zinc-500 text-3xl" />
                </div>
                {/* Front */}
                <div
                    className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center backface-hidden"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <p className="font-bold text-black text-center px-2">{card.title}</p>
                </div>
            </div>
        </div>
    );
};

const PortoDialog = ({ porto, onClose }: { porto: PortoItem; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80">
                <img src={porto.image} alt={porto.title} className="w-full h-40 object-cover rounded-md mb-4" />
                <h2 className="text-xl font-bold mb-2">{porto.title}</h2>
                <p className="text-gray-700 mb-4">{porto.description}</p>
                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 rounded-md border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
};      

const PlaySection = () => {
    const [board, setBoard] = useState<GameCard[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPorto, setOpenPorto] = useState<PortoItem | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBoard(createBoard());
    }, []);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);


    const handleSelect = (boardIndex: number) => {
        if (isChecking) return;
        if (flipped.includes(boardIndex)) return;
        if (matched.includes(board[boardIndex].id)){
            setOpenPorto(board[boardIndex]);
            setOpenDialog(true);
            return
        }

        const newFlipped = [...flipped, boardIndex];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (board[first].id === board[second].id) {
                setMatched((prev) => [...prev, board[first].id]);
                setFlipped([]);
                 setTimeout(() => {
                    setOpenPorto(board[first]);
                    setOpenDialog(true);
                }, 800)
            } else {
                setIsChecking(true);
                setTimeout(() => {
                    setFlipped([]);
                    setIsChecking(false);
                }, 800);
            }
        }
    };

    const handleReset = () => {
        setBoard(createBoard());
        setFlipped([]);
        setMatched([]);
        setIsChecking(false);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-8">
            {/* {isWon && (
                <p className="text-white text-2xl font-bold tracking-wide">You matched all pairs!</p>
            )} */}

            <div className="grid grid-cols-4 gap-4">
                {board.map((item) => (
                    <div
                        key={item.boardIndex}
                        onClick={() => handleSelect(item.boardIndex)}
                        className="cursor-pointer"
                    >
                        <CardPlay
                            card={item}
                            isFlipped={flipped.includes(item.boardIndex)}
                            isMatched={matched.includes(item.id)}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 rounded-md border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
            >
                Reset
            </button>
            {openDialog && openPorto && (
                <PortoDialog porto={openPorto} onClose={() => setOpenDialog(false)} />
            )}

        </div>
    );
};

export default PlaySection;
