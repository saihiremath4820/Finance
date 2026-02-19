import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare, Send, ChevronRight } from 'lucide-react';


const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Auto-open after a short delay for the "pop-up" effect
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setIsOpen(true);
            }
        }, 2500); // 2.5s delay for a nice entrance after page load

        return () => clearTimeout(timer);
    }, [hasInteracted]);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setHasInteracted(true);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setHasInteracted(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white w-[350px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-4 pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">TrustVault AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-medium">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div className="p-4 h-[300px] bg-gray-50/50 flex flex-col gap-4 overflow-y-auto">
                            {/* AI Message */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center border border-indigo-200">
                                    <Sparkles size={14} className="text-indigo-600" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700">
                                    <p className="font-medium mb-1">Hello! 👋</p>
                                    <p className="text-gray-600">I noticed you're reviewing the risk portfolio. Need any help analyzing the latest signals?</p>
                                </div>
                            </div>

                            {/* Suggested Actions */}
                            <div className="flex flex-col gap-2 ml-11">
                                <button className="text-left text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors border border-indigo-100 flex items-center justify-between group">
                                    Analyze current sector risk <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button className="text-left text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors border border-indigo-100 flex items-center justify-between group">
                                    Show critical alerts summary <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ask anything about your data..."
                                className="flex-1 text-sm bg-gray-50 border-none rounded-xl px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md transform active:scale-95">
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className="pointer-events-auto bg-gray-900 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all border border-gray-700 flex items-center justify-center group relative"
            >
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                {isOpen ? <X size={24} className="relative z-10" /> : <MessageSquare size={24} className="relative z-10" />}

                {!isOpen && !hasInteracted && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
