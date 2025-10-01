import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Sparkles } from 'lucide-react';

const App = () => {
  // Game state
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showStory, setShowStory] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFinalVictory, setShowFinalVictory] = useState(false);
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [inventory, setInventory] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [confetti, setConfetti] = useState([]);

  // Merge chains definition
  const chains = {
    water: ['💧', '🚰', '🧴', '🍶', '⛲'],
    education: ['📄', '📖', '📓', '📚', '🎓'],
    resilience: ['😢', '😐', '😊', '💪', '👑'],
    classroom: ['🪑', '🛠️', '✨', '📐', '🏛️'],
    homework: ['❓', '✏️', '🖊️', '📝', '⭐'],
    friends: ['👋', '🤝', '👥', '🎉', '💖'],
    hygiene: ['🧹', '🚿', '🧼', '🚽', '🏥'],
    supplies: ['📎', '✂️', '🖍️', '🎨', '🔬']
  };

  // Item names for display
  const itemNames = {
    '💧': 'Dirty Puddle', '🚰': 'Tap Water', '🧴': 'Filter Bottle', '🍶': 'Clean Water', '⛲': 'Water Cooler',
    '📄': 'Torn Page', '📖': 'Old Book', '📓': 'New Notebook', '📚': 'Study Guide', '🎓': 'Certificate',
    '😢': 'Tears', '😐': 'Courage', '😊': 'Friends', '💪': 'Voice', '👑': 'Leadership',
    '🪑': 'Broken Desk', '🛠️': 'Fixed Desk', '✨': 'Clean Desk', '📐': 'Study Table', '🏛️': 'Library Corner',
    '❓': 'Blank Page', '✏️': 'Pencil Draft', '🖊️': 'Inked Work', '📝': 'Complete Homework', '⭐': 'Perfect Assignment',
    '👋': 'Wave Hello', '🤝': 'Ask for Help', '👥': 'Study Buddy', '🎉': 'Best Friends', '💖': 'Forever Friends',
    '🧹': 'Dirty Floor', '🚿': 'Water Bucket', '🧼': 'Soap Bar', '🚽': 'Clean Toilet', '🏥': 'Modern Facilities',
    '📎': 'Paper Clip', '✂️': 'Scissors', '🖍️': 'Crayons', '🎨': 'Art Supplies', '🔬': 'Science Kit'
  };

  // Chapter definitions (all 15 chapters)
  const chapters = [
    {
      id: 1,
      title: "First Day Terror",
      story: "First day at school. The building looks scary, the teachers seem strict, and you don't know anyone. Can you survive this day and maybe... find a friend?",
      objectives: [
        { label: "Make 1 friend", item: '😊', chain: 'resilience', level: 3 },
        { label: "Find clean water", item: '🍶', chain: 'water', level: 3 }
      ],
      startingItems: ['😢', '💧', '📄', '🪑']
    },
    {
      id: 2,
      title: "The Forgotten Homework",
      story: "Oh no! It's recess time and you just remembered - you forgot to do your English homework! The period starts in 30 minutes. Quick! Ask your friends for help and finish it before the teacher arrives!",
      objectives: [
        { label: "Complete homework", item: '📝', chain: 'homework', level: 4 },
        { label: "Get help from friends", item: '👥', chain: 'friends', level: 3 }
      ],
      startingItems: ['❓', '👋', '😐', '📖']
    },
    {
      id: 3,
      title: "The Water Crisis",
      story: "The water tap is broken again. Long queues, dirty water, and you're so thirsty. The older kids are pushing everyone. Time to find a solution and maybe help everyone!",
      objectives: [
        { label: "Get a water cooler", item: '⛲', chain: 'water', level: 5 },
        { label: "Build courage to speak up", item: '💪', chain: 'resilience', level: 4 }
      ],
      startingItems: ['🚰', '😐', '🛠️', '📖']
    },
    {
      id: 4,
      title: "The Bully Showdown",
      story: "A group of older students has been taking your lunch money. Today they cornered you near the bathroom. You're scared but your new friends are here. Together, can you stand up to them?",
      objectives: [
        { label: "Build voice to speak up", item: '💪', chain: 'resilience', level: 4 },
        { label: "Rally friends for support", item: '🎉', chain: 'friends', level: 4 }
      ],
      startingItems: ['😢', '👋', '😐', '📄']
    },
    {
      id: 5,
      title: "Exam Panic",
      story: "First big exam tomorrow! The classroom is dark, your desk is broken, and half the pages in your book are missing. You need to study somehow and pass this test!",
      objectives: [
        { label: "Get study materials", item: '📚', chain: 'education', level: 4 },
        { label: "Fix your workspace", item: '✨', chain: 'classroom', level: 3 }
      ],
      startingItems: ['📄', '🪑', '💧', '😐']
    },
    {
      id: 6,
      title: "The Cane Punishment",
      story: "The strict math teacher caught you talking in class. She's reaching for the cane. Your hands are shaking. Can you find the courage to accept this punishment with dignity?",
      objectives: [
        { label: "Build inner strength", item: '👑', chain: 'resilience', level: 5 },
        { label: "Maintain dignity", item: '📓', chain: 'education', level: 3 }
      ],
      startingItems: ['😢', '😐', '📖', '🛠️']
    },
    {
      id: 7,
      title: "Toilet Troubles",
      story: "The school toilets are disgusting. No locks on doors, no water, terrible smell. Girls are afraid to go. You decide to rally students and talk to the principal about fixing this!",
      objectives: [
        { label: "Clean facilities", item: '🚽', chain: 'hygiene', level: 4 },
        { label: "Gather student support", item: '🎉', chain: 'friends', level: 4 }
      ],
      startingItems: ['💧', '👋', '😐', '🪑']
    },
    {
      id: 8,
      title: "The Science Fair",
      story: "Science fair next week! You want to participate but have no materials. Your family can't afford supplies. Can you collect scraps and create something amazing from nothing?",
      objectives: [
        { label: "Create project materials", item: '📚', chain: 'education', level: 5 },
        { label: "Get creative supplies", item: '🎨', chain: 'supplies', level: 4 }
      ],
      startingItems: ['📄', '🪑', '😐', '📖']
    },
    {
      id: 9,
      title: "Monsoon Madness",
      story: "Heavy monsoon! The roof is leaking, classrooms are flooded, and you forgot your umbrella. The teacher still expects everyone to attend. How will you survive this wet, miserable day?",
      objectives: [
        { label: "Find shelter from rain", item: '📐', chain: 'classroom', level: 4 },
        { label: "Get dry water source", item: '🧴', chain: 'water', level: 3 }
      ],
      startingItems: ['💧', '🚰', '🪑', '😐']
    },
    {
      id: 10,
      title: "The Friendship Test",
      story: "Your best friend was caught cheating and blamed you! Everyone thinks you're a cheater. The teacher is disappointed. Can you prove your innocence and save your friendship?",
      objectives: [
        { label: "Restore reputation", item: '👑', chain: 'resilience', level: 5 },
        { label: "Rebuild trust", item: '💖', chain: 'friends', level: 5 }
      ],
      startingItems: ['😢', '😐', '👋', '📖']
    },
    {
      id: 11,
      title: "Sports Day Struggle",
      story: "Annual sports day! You're not athletic and the PE teacher keeps yelling at you. Other kids are laughing. But you won't give up. Show them that effort matters more than talent!",
      objectives: [
        { label: "Build determination", item: '👑', chain: 'resilience', level: 5 },
        { label: "Earn respect", item: '🎉', chain: 'friends', level: 4 }
      ],
      startingItems: ['😢', '😐', '👋', '🛠️']
    },
    {
      id: 12,
      title: "The Class Monitor Election",
      story: "Class monitor elections are here! You want to run but the popular kids are mocking you. \"You? A leader? You couldn't even tie your shoes on the first day!\" Time to prove them wrong.",
      objectives: [
        { label: "Become a leader", item: '👑', chain: 'resilience', level: 5 },
        { label: "Win classmates over", item: '💖', chain: 'friends', level: 5 }
      ],
      startingItems: ['😐', '😊', '👋', '📖']
    },
    {
      id: 13,
      title: "Cultural Day Celebration",
      story: "School cultural day! Each student must perform. You're terrified of stage fright but you have a beautiful traditional dance to share. Can you overcome fear and shine on stage?",
      objectives: [
        { label: "Perfect your performance", item: '🎓', chain: 'education', level: 5 },
        { label: "Build confidence", item: '👑', chain: 'resilience', level: 5 }
      ],
      startingItems: ['😐', '😊', '📖', '🛠️']
    },
    {
      id: 14,
      title: "The Teacher's Secret",
      story: "You discovered the strict teacher who always seemed mean is struggling - she's caring for her sick mother and has no money. The same teacher who caned you. What will you do?",
      objectives: [
        { label: "Show compassion", item: '👑', chain: 'resilience', level: 5 },
        { label: "Organize help", item: '💖', chain: 'friends', level: 5 },
        { label: "Gather resources", item: '📚', chain: 'education', level: 4 }
      ],
      startingItems: ['😐', '😊', '👋', '📚']
    },
    {
      id: 15,
      title: "Graduation Day Glory",
      story: "Final day of the school year! You've survived everything - bullies, strict teachers, broken toilets, and countless challenges. From a scared little girl to a confident leader. Time to celebrate your triumph!",
      objectives: [
        { label: "Achieve leadership", item: '👑', chain: 'resilience', level: 5 },
        { label: "Complete education milestone", item: '🎓', chain: 'education', level: 5 },
        { label: "Build lasting friendships", item: '💖', chain: 'friends', level: 5 }
      ],
      startingItems: ['😊', '💪', '📚', '✨']
    }
  ];

  const currentChapterData = chapters[currentChapter - 1];

  // Initialize grid with starting items when chapter starts
  useEffect(() => {
    if (!showStory && !showCompletion) {
      const newGrid = Array(16).fill(null);
      const startingItems = currentChapterData.startingItems;

      for (let i = 0; i < Math.min(startingItems.length, 4); i++) {
        newGrid[i] = startingItems[i];
      }

      setGrid(newGrid);
      setInventory({});
      setSelectedCell(null);
    }
  }, [currentChapter, showStory, showCompletion]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(100, prev + 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check chapter completion
  useEffect(() => {
    const allObjectivesMet = currentChapterData.objectives.every(obj => {
      return inventory[obj.item] >= 1;
    });

    if (allObjectivesMet && !showCompletion && !showStory) {
      setShowCompletion(true);
      setScore(prev => prev + 100);

      // Create confetti
      if (currentChapter === 15) {
        const newConfetti = [];
        for (let i = 0; i < 50; i++) {
          newConfetti.push({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            emoji: ['🎉', '⭐', '👑', '🎓', '💖', '✨'][Math.floor(Math.random() * 6)]
          });
        }
        setConfetti(newConfetti);
      }
    }
  }, [inventory, showCompletion, showStory]);

  // Find which chain an item belongs to
  const findChain = (item) => {
    for (const [chainName, items] of Object.entries(chains)) {
      const index = items.indexOf(item);
      if (index !== -1) {
        return { chainName, index };
      }
    }
    return null;
  };

  // Handle cell click
  const handleCellClick = (index) => {
    if (grid[index] === null) {
      // Empty cell - spawn new item
      if (energy >= 10) {
        const startingItems = currentChapterData.startingItems;
        const randomItem = startingItems[Math.floor(Math.random() * startingItems.length)];

        const newGrid = [...grid];
        newGrid[index] = randomItem;
        setGrid(newGrid);
        setEnergy(prev => prev - 10);
        setMessage(`Spawned ${itemNames[randomItem]}`);
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Not enough energy!');
        setTimeout(() => setMessage(''), 2000);
      }
    } else {
      // Cell has item - try to merge
      if (selectedCell === null) {
        setSelectedCell(index);
      } else {
        if (selectedCell === index) {
          setSelectedCell(null);
        } else {
          // Try to merge
          const item1 = grid[selectedCell];
          const item2 = grid[index];

          if (item1 === item2) {
            const chainInfo = findChain(item1);
            if (chainInfo && chainInfo.index < chains[chainInfo.chainName].length - 1) {
              const nextItem = chains[chainInfo.chainName][chainInfo.index + 1];
              const newGrid = [...grid];
              newGrid[selectedCell] = null;
              newGrid[index] = nextItem;
              setGrid(newGrid);

              // Update inventory
              const newInventory = { ...inventory };
              if (newInventory[item1]) {
                newInventory[item1] = Math.max(0, newInventory[item1] - 2);
              }
              newInventory[nextItem] = (newInventory[nextItem] || 0) + 1;
              setInventory(newInventory);

              // Update score and energy
              const points = (chainInfo.index + 2) * 10;
              setScore(prev => prev + points);
              setEnergy(prev => Math.min(100, prev + 5));

              setMessage(`Merged! Created ${itemNames[nextItem]} (+${points} points)`);
              setTimeout(() => setMessage(''), 2000);
            } else {
              setMessage('Already at max level!');
              setTimeout(() => setMessage(''), 2000);
            }
          } else {
            setMessage('Items must match to merge!');
            setTimeout(() => setMessage(''), 2000);
          }
          setSelectedCell(null);
        }
      }
    }
  };

  // Start new chapter
  const startChapter = () => {
    setShowStory(false);
  };

  // Move to next chapter
  const nextChapter = () => {
    if (currentChapter < 15) {
      setCurrentChapter(prev => prev + 1);
      setShowCompletion(false);
      setShowStory(true);
      setConfetti([]);
    } else {
      setShowCompletion(false);
      setShowFinalVictory(true);
    }
  };

  // Restart game
  const restartGame = () => {
    setCurrentChapter(1);
    setShowStory(true);
    setShowCompletion(false);
    setShowFinalVictory(false);
    setScore(0);
    setEnergy(100);
    setGrid(Array(16).fill(null));
    setInventory({});
    setSelectedCell(null);
    setConfetti([]);
  };

  // Get background color based on chapter
  const getChapterBg = () => {
    if (currentChapter <= 5) return 'from-amber-100 to-orange-200';
    if (currentChapter <= 10) return 'from-rose-100 to-pink-200';
    return 'from-purple-100 to-indigo-200';
  };

  // Story screen
  if (showStory) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getChapterBg()} flex items-center justify-center p-4`}>
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">School Days</h1>
            <p className="text-lg text-gray-600">A Survivor's Story</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-600">
                Chapter {currentChapter} of 15
              </h2>
              <div className="text-sm text-gray-500">
                Day {currentChapter}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {currentChapterData.title}
            </h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              {currentChapterData.story}
            </p>

            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Objectives:</h4>
              <ul className="space-y-2">
                {currentChapterData.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <span className="mr-2 text-xl">{obj.item}</span>
                    <span>{obj.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={startChapter}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Start Chapter
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-4 relative overflow-hidden">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti absolute text-4xl"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`
            }}
          >
            {c.emoji}
          </div>
        ))}

        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Chapter {currentChapter} Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {currentChapterData.title}
            </p>

            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-700 mb-4">
                You've overcome all challenges in this chapter!
              </p>
              <div className="text-3xl font-bold text-green-600">
                Score: {score}
              </div>
            </div>

            <button
              onClick={nextChapter}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              {currentChapter < 15 ? 'Next Chapter' : 'Complete Game!'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final victory screen
  if (showFinalVictory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti absolute text-4xl"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`
            }}
          >
            {c.emoji}
          </div>
        ))}

        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          <div className="text-center">
            <div className="text-6xl mb-4">👑</div>
            <h1 className="text-4xl font-bold text-purple-600 mb-4">
              GAME COMPLETE!
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              You've Survived All 15 Chapters!
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                From a scared little girl on her first day to a confident leader who inspires others -
                you've faced strict teachers, bullies, broken facilities, and countless challenges.
                You've learned that courage isn't about never being afraid, it's about standing up anyway.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                You've made lasting friendships, shown compassion even to those who hurt you,
                and proved that determination and kindness can overcome any obstacle.
              </p>
              <div className="text-4xl font-bold text-purple-600 mt-6">
                Final Score: {score}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">School Days</h1>
              <p className="text-sm text-gray-500">Chapter {currentChapter} of 15</p>
            </div>
            <button
              onClick={restartGame}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              <RefreshCw size={16} />
              Restart
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-700">
                {currentChapterData.title}
              </h2>
              <div className="text-sm text-gray-500">Day {currentChapter}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">
                {score}
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
              {/* Energy Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">Energy</span>
                  <span className="text-gray-600">{energy}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${energy}%` }}
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg mb-4 text-sm">
                  {message}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-4 gap-2">
                {grid.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-4xl transition-all ${
                      item === null
                        ? 'bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300'
                        : selectedCell === index
                        ? 'bg-amber-200 border-4 border-amber-500 scale-95'
                        : 'bg-gradient-to-br from-white to-gray-50 hover:scale-105 border-2 border-gray-200 shadow-md'
                    }`}
                  >
                    {item || <Plus className="text-gray-400" size={24} />}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Click empty cells (+) to spawn items (10 energy) • Click two matching items to merge
              </div>
            </div>

            {/* Little girl character */}
            <div className="text-center">
              <div className="bounce inline-block text-6xl">👧</div>
            </div>
          </div>

          {/* Objectives Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Objectives
              </h3>
              <div className="space-y-2">
                {currentChapterData.objectives.map((obj, idx) => {
                  const completed = inventory[obj.item] >= 1;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg ${
                        completed ? 'bg-green-100 border border-green-300' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{obj.item}</span>
                          <span className="text-sm text-gray-700">{obj.label}</span>
                        </div>
                        {completed && <span className="text-green-600">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Merge Chains Reference */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">Merge Chains</h3>
              <div className="space-y-3 text-xs">
                {Object.entries(chains).map(([chainName, items]) => (
                  <div key={chainName}>
                    <div className="font-semibold text-gray-600 capitalize mb-1">
                      {chainName}
                    </div>
                    <div className="flex gap-1">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center">
                          <span className="text-lg">{item}</span>
                          {idx < items.length - 1 && (
                            <span className="text-gray-400 mx-1">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
